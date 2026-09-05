type WebkitWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let context: AudioContext | null = null;
let master: GainNode | null = null;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const AudioContextClass =
      window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass({ latencyHint: 'interactive' });
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.22;
    master = context.createGain();
    master.gain.value = 0.72;
    master.connect(compressor).connect(context.destination);
  }
  return context;
}

export function unlockAudio() {
  const ctx = audio();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  // iOS Safari reliably unlocks its hardware audio route after a silent buffer
  // is started inside the first direct touch event.
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
}

function output(ctx: AudioContext, volume: number) {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(master ?? ctx.destination);
  return gain;
}

function oscillator(
  ctx: AudioContext,
  destination: AudioNode,
  type: OscillatorType,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  endFrequency = frequency,
) {
  const osc = ctx.createOscillator();
  const envelope = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  osc.frequency.exponentialRampToValueAtTime(
    Math.max(30, endFrequency),
    start + duration,
  );
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(envelope).connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBuffer(ctx: AudioContext, seconds = 0.5) {
  const buffer = ctx.createBuffer(
    1,
    Math.ceil(ctx.sampleRate * seconds),
    ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function playTone(frequency: number, duration = 0.25, volume = 0.16) {
  const ctx = audio();
  if (!ctx) return;
  void ctx.resume();
  const now = ctx.currentTime;
  const bus = output(ctx, volume);
  oscillator(
    ctx,
    bus,
    'sine',
    frequency,
    now,
    duration,
    0.9,
    frequency * 0.997,
  );
  oscillator(
    ctx,
    bus,
    'sine',
    frequency * 2,
    now,
    duration * 0.72,
    0.22,
    frequency * 1.99,
  );
  oscillator(
    ctx,
    bus,
    'sine',
    frequency * 3,
    now,
    duration * 0.52,
    0.07,
    frequency * 2.98,
  );
}

export function playSound(
  name:
    | 'pop'
    | 'paint'
    | 'star'
    | 'success'
    | 'drum'
    | 'clap'
    | 'cow'
    | 'sheep'
    | 'duck'
    | 'pig',
) {
  const ctx = audio();
  if (!ctx) return;
  void ctx.resume();
  const now = ctx.currentTime;
  const bus = output(ctx, 0.2);

  if (name === 'pop') {
    oscillator(ctx, bus, 'sine', 760, now, 0.09, 0.65, 290);
    oscillator(ctx, bus, 'triangle', 1220, now, 0.055, 0.18, 520);
  } else if (name === 'paint') {
    oscillator(ctx, bus, 'sine', 310, now, 0.1, 0.22, 390);
  } else if (name === 'star' || name === 'success') {
    [0, 0.08, 0.16].forEach((delay, index) =>
      oscillator(
        ctx,
        bus,
        'sine',
        [523, 659, 784][index],
        now + delay,
        0.35,
        0.42,
      ),
    );
  } else if (name === 'drum') {
    oscillator(ctx, bus, 'sine', 145, now, 0.24, 0.9, 52);
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer(ctx, 0.08);
    filter.type = 'lowpass';
    filter.frequency.value = 850;
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    source.connect(filter).connect(gain).connect(bus);
    source.start(now);
  } else if (name === 'clap') {
    [0, 0.025, 0.05].forEach((delay) => {
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      source.buffer = noiseBuffer(ctx, 0.12);
      filter.type = 'bandpass';
      filter.frequency.value = 1350;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.5, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.09);
      source.connect(filter).connect(gain).connect(bus);
      source.start(now + delay);
      source.stop(now + delay + 0.11);
    });
  } else if (name === 'cow') {
    // Low, breathy two-part moo with a slow natural pitch bend.
    [0, 0.55].forEach((delay, index) => {
      oscillator(
        ctx,
        bus,
        'sawtooth',
        118 - index * 8,
        now + delay,
        0.7,
        0.38,
        92 - index * 6,
      );
      oscillator(
        ctx,
        bus,
        'sine',
        236 - index * 16,
        now + delay,
        0.63,
        0.17,
        184 - index * 12,
      );
    });
  } else if (name === 'sheep') {
    // A nasal, wavering baa built from short alternating formants.
    [0, 0.14, 0.28, 0.42].forEach((delay, index) => {
      oscillator(
        ctx,
        bus,
        'sawtooth',
        index % 2 ? 208 : 232,
        now + delay,
        0.2,
        0.24,
        index % 2 ? 228 : 205,
      );
      oscillator(ctx, bus, 'sine', 690, now + delay, 0.17, 0.08, 610);
    });
  } else if (name === 'duck') {
    [0, 0.17].forEach((delay) => {
      oscillator(ctx, bus, 'square', 315, now + delay, 0.13, 0.22, 205);
      oscillator(ctx, bus, 'sine', 920, now + delay, 0.08, 0.08, 520);
    });
  } else if (name === 'pig') {
    [0, 0.2].forEach((delay) => {
      oscillator(ctx, bus, 'sawtooth', 128, now + delay, 0.16, 0.28, 82);
      oscillator(ctx, bus, 'sine', 255, now + delay, 0.13, 0.12, 170);
    });
  }
}
