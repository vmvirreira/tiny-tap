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
  | 'cat'
  | 'dog'
  | 'horse'
  | 'rooster'
  | 'peekaboo';
type AudioSessionNavigator = Navigator & {
  audioSession?: {
    type: 'ambient' | 'playback' | 'transient' | 'transient-solo';
  };
};
type WebkitWindow = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

const bank = new Map<string, HTMLAudioElement>();
const generations = new Map<string, number>();
type AnimalSound =
  | 'cow'
  | 'sheep'
  | 'duck'
  | 'pig'
  | 'cat'
  | 'dog'
  | 'horse'
  | 'rooster';
const animalFiles = new Set<AnimalSound>([
  'cow',
  'sheep',
  'duck',
  'pig',
  'cat',
  'dog',
  'horse',
  'rooster',
]);
const lowLatencyFiles = {
  piano: '/audio/piano-c4.flac',
  drum: '/audio/drum-real.wav',
  clap: '/audio/clap-real.wav',
} as const;

let unlocked = false;
let context: AudioContext | null = null;
const raw = new Map<string, Promise<ArrayBuffer>>();
const decoded = new Map<string, AudioBuffer>();

function sourceFor(file: string) {
  if (file === 'peekaboo') return '/audio/peekaboo-female.mp3';
  if (file === 'piano') return lowLatencyFiles.piano;
  if (file === 'drum') return lowLatencyFiles.drum;
  if (file === 'clap') return lowLatencyFiles.clap;
  if (animalFiles.has(file as AnimalSound)) return `/audio/${file}-real.mp3`;
  return `/audio/${file}.wav`;
}

function isAnimalSound(name: SoundName): name is AnimalSound {
  return animalFiles.has(name as AnimalSound);
}

function getPlayer(file: string) {
  if (typeof window === 'undefined') return null;
  const existing = bank.get(file);
  if (existing) return existing;
  const audio = new Audio(sourceFor(file));
  audio.preload = 'auto';
  audio.setAttribute('playsinline', '');
  audio.setAttribute('webkit-playsinline', '');
  if (file === 'piano') {
    audio.preservesPitch = false;
    audio.setAttribute('webkitpreservespitch', 'false');
  }
  bank.set(file, audio);
  audio.load();
  return audio;
}

function setPlaybackRoute() {
  if (typeof navigator === 'undefined') return;
  try {
    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session) session.type = 'playback';
  } catch {
    // Older Safari builds expose no configurable audio-session API.
  }
}

function preloadBuffers() {
  if (typeof window === 'undefined') return;
  Object.entries(lowLatencyFiles).forEach(([name, url]) => {
    if (!raw.has(name))
      raw.set(
        name,
        fetch(url).then((response) => response.arrayBuffer()),
      );
  });
}

function getContext() {
  if (context?.state === 'closed') context = null;
  if (context) return context;
  const AudioContextClass =
    window.AudioContext || (window as WebkitWindow).webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    context = new AudioContextClass({ latencyHint: 'interactive' });
  } catch {
    context = new AudioContextClass();
  }
  return context;
}

async function decodeBuffers() {
  const ctx = getContext();
  if (!ctx) return;
  await Promise.all(
    [...raw.entries()].map(async ([name, request]) => {
      if (decoded.has(name)) return;
      const data = await request;
      decoded.set(name, await ctx.decodeAudioData(data.slice(0)));
    }),
  );
}

export function preloadAudio() {
  [
    'unlock',
    'pop',
    'paint',
    'star',
    'peekaboo',
    'cow',
    'sheep',
    'duck',
    'pig',
    'cat',
    'dog',
    'horse',
    'rooster',
    'piano',
    'drum',
    'clap',
  ].forEach(getPlayer);
  preloadBuffers();
}

/** Activates iPhone media audio, then prepares pre-decoded low-latency samples. */
export function unlockAudio() {
  setPlaybackRoute();
  preloadAudio();
  const audio = getPlayer('unlock');
  if (audio && !unlocked) {
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
  const ctx = getContext();
  if (ctx && ctx.state !== 'running') {
    void ctx
      .resume()
      .catch(() => undefined)
      .finally(() => decodeBuffers().catch(() => undefined));
  } else {
    void decodeBuffers().catch(() => undefined);
  }
}

function playMedia(
  file: string,
  volume = 0.7,
  playbackRate = 1,
  stopAfterMs?: number,
) {
  setPlaybackRoute();
  const audio = getPlayer(file);
  if (!audio) return;
  audio.pause();
  const generation = (generations.get(file) ?? 0) + 1;
  generations.set(file, generation);
  audio.currentTime = 0;
  audio.volume = volume;
  audio.playbackRate = playbackRate;
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

function playBuffer(
  name: keyof typeof lowLatencyFiles,
  playbackRate = 1,
  volume = 0.72,
  delay = 0,
) {
  const ctx = getContext();
  const buffer = decoded.get(name);
  if (!ctx || ctx.state !== 'running' || !buffer) return false;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;
  source.connect(gain).connect(ctx.destination);
  source.start(ctx.currentTime + delay);
  return true;
}

export function playTone(frequency: number, _duration = 0.25, volume = 0.72) {
  const rate = frequency / 262;
  if (!playBuffer('piano', rate, volume))
    playMedia('piano', volume, rate, 1400);
}

export function playSound(name: SoundName) {
  if (isAnimalSound(name)) {
    animalFiles.forEach((animal) => bank.get(animal)?.pause());
    const length = {
      cow: 1100,
      sheep: 1000,
      duck: 850,
      pig: 700,
      cat: 800,
      dog: 1000,
      horse: 1400,
      rooster: 1600,
    }[name];
    playMedia(name, 0.52, 1, length);
    return;
  }
  if (name === 'drum' || name === 'clap') {
    if (!playBuffer(name, 1, name === 'drum' ? 0.8 : 0.68))
      playMedia(name, 0.72, 1, 900);
    return;
  }
  if (name === 'star' || name === 'success') {
    const ready =
      playBuffer('piano', 2, 0.55) &&
      playBuffer('piano', 2.52, 0.42, 0.07) &&
      playBuffer('piano', 3, 0.35, 0.14);
    if (!ready) playMedia('star', 0.64);
    return;
  }
  playMedia(name, name === 'peekaboo' ? 0.82 : 0.68);
}
