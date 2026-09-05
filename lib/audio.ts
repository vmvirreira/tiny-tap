type SoundName =
  | 'pop'
  | 'paint'
  | 'star'
  | 'success'
  | 'drum'
  | 'clap'
  | 'cow'
  | 'sheep'
  | 'duck'
  | 'pig';

type AudioSessionNavigator = Navigator & {
  audioSession?: {
    type: 'ambient' | 'playback' | 'transient' | 'transient-solo';
  };
};

const noteFiles = [262, 330, 370, 392, 440, 510, 523, 580, 650, 659];
const animalFiles = new Set(['cow', 'sheep', 'duck', 'pig']);
const bank = new Map<string, HTMLAudioElement>();
let unlocked = false;

function sourceFor(file: string) {
  return animalFiles.has(file)
    ? `/audio/${file}-real.mp3`
    : `/audio/${file}.wav`;
}

function getPlayer(file: string) {
  if (typeof window === 'undefined') return null;
  const existing = bank.get(file);
  if (existing) return existing;

  const audio = new Audio(sourceFor(file));
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  bank.set(file, audio);
  audio.load();
  return audio;
}

function setPlaybackRoute() {
  if (typeof navigator === 'undefined') return;
  const session = (navigator as AudioSessionNavigator).audioSession;
  try {
    if (session) session.type = 'playback';
  } catch {
    // Older Safari builds expose no configurable audio-session API.
  }
}

/** Starts fetching and decoding the small sound bank before the first game tap. */
export function preloadAudio() {
  const effects = [
    'unlock',
    'pop',
    'paint',
    'star',
    'drum',
    'clap',
    'cow',
    'sheep',
    'duck',
    'pig',
  ];
  [...effects, ...noteFiles.map((note) => `note-${note}`)].forEach(getPlayer);
}

/** Activates iPhone's media playback route during a direct touch event. */
export function unlockAudio() {
  setPlaybackRoute();
  preloadAudio();
  const audio = getPlayer('unlock');
  if (!audio || unlocked) return;
  audio.currentTime = 0;
  const attempt = audio.play();
  if (attempt)
    void attempt
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        unlocked = false;
      });
}

function playFile(file: string, volume = 0.72) {
  setPlaybackRoute();
  const audio = getPlayer(file);
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.volume = volume;
  const attempt = audio.play();
  if (attempt)
    void attempt
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        unlocked = false;
      });
}

export function playTone(frequency: number, _duration = 0.25, volume = 0.72) {
  const closest = noteFiles.reduce((best, note) =>
    Math.abs(note - frequency) < Math.abs(best - frequency) ? note : best,
  );
  playFile(`note-${closest}`, volume);
}

export function playSound(name: SoundName) {
  playFile(name === 'success' ? 'star' : name, name === 'drum' ? 0.82 : 0.72);
}
