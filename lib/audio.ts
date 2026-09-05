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
  | 'pig'
  | 'peekaboo';

type AudioSessionNavigator = Navigator & {
  audioSession?: {
    type: 'ambient' | 'playback' | 'transient' | 'transient-solo';
  };
};

const noteFiles = [262, 330, 370, 392, 440, 510, 523, 580, 650, 659];
const animalFiles = new Set(['cow', 'sheep', 'duck', 'pig']);
const bank = new Map<string, HTMLAudioElement>();
const generations = new Map<string, number>();
let unlocked = false;
let warmupStarted = false;

function sourceFor(file: string) {
  if (file.endsWith('-cartoon')) {
    return `/audio/${file.replace('-cartoon', '')}.wav`;
  }
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
    'peekaboo',
    'cow',
    'sheep',
    'duck',
    'pig',
    'cow-cartoon',
    'sheep-cartoon',
    'duck-cartoon',
    'pig-cartoon',
  ];
  [...effects, ...noteFiles.map((note) => `note-${note}`)].forEach(getPlayer);
}

function warmLatencyCriticalPlayers() {
  if (warmupStarted) return;
  warmupStarted = true;
  const files = [
    'star',
    'peekaboo',
    ...noteFiles.map((note) => `note-${note}`),
  ];
  files.forEach((file) => {
    const audio = getPlayer(file);
    if (!audio) return;
    const generation = (generations.get(file) ?? 0) + 1;
    generations.set(file, generation);
    audio.muted = true;
    audio.currentTime = 0;
    const attempt = audio.play();
    if (attempt) {
      void attempt
        .then(() => {
          if (generations.get(file) !== generation) return;
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          warmupStarted = false;
        });
    }
  });
}

/** Activates iPhone's media playback route during a direct touch event. */
export function unlockAudio() {
  setPlaybackRoute();
  preloadAudio();
  warmLatencyCriticalPlayers();
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

function playFile(file: string, volume = 0.72, stopAfterMs?: number) {
  setPlaybackRoute();
  const audio = getPlayer(file);
  if (!audio) return;
  const generation = (generations.get(file) ?? 0) + 1;
  generations.set(file, generation);
  audio.pause();
  audio.currentTime = 0;
  audio.muted = false;
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
  if (stopAfterMs) {
    window.setTimeout(() => {
      if (generations.get(file) === generation) audio.pause();
    }, stopAfterMs);
  }
}

export function playTone(frequency: number, _duration = 0.25, volume = 0.72) {
  const closest = noteFiles.reduce((best, note) =>
    Math.abs(note - frequency) < Math.abs(best - frequency) ? note : best,
  );
  playFile(`note-${closest}`, volume);
}

export function playSound(name: SoundName) {
  if (animalFiles.has(name)) {
    animalFiles.forEach((animal) => {
      bank.get(animal)?.pause();
      bank.get(`${animal}-cartoon`)?.pause();
    });
    playFile(name, 0.38, 1400);
    playFile(`${name}-cartoon`, 0.18, 900);
    return;
  }
  playFile(name === 'success' ? 'star' : name, name === 'drum' ? 0.82 : 0.72);
}
