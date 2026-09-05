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
let player: HTMLAudioElement | null = null;
let unlocked = false;

function getPlayer() {
  if (typeof window === 'undefined') return null;
  if (!player) {
    player = new Audio('/audio/unlock.wav');
    player.preload = 'auto';
    player.setAttribute('playsinline', '');
    player.setAttribute('webkit-playsinline', '');
  }
  return player;
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

/**
 * Activates one reusable HTML media element during a direct touch event.
 * Unlike Web Audio, this route remains audible on iPhones using the silent
 * switch and avoids Safari's suspended/interrupted AudioContext failure mode.
 */
export function unlockAudio() {
  setPlaybackRoute();
  const audio = getPlayer();
  if (!audio || unlocked) return;
  const attempt = audio.play();
  if (attempt) {
    void attempt
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        unlocked = false;
      });
  }
}

function playFile(file: string, volume = 0.72) {
  setPlaybackRoute();
  const audio = getPlayer();
  if (!audio) return;

  audio.pause();
  audio.src = `/audio/${file}.wav`;
  audio.currentTime = 0;
  audio.volume = volume;
  const attempt = audio.play();
  if (attempt) {
    void attempt
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        // A later direct tap retries automatically; never leave a rejected
        // promise uncaught in Safari.
        unlocked = false;
      });
  }
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
