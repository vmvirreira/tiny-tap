import { mkdirSync, writeFileSync } from 'node:fs';

const rate = 22050;
const destination = new URL('../public/audio/', import.meta.url);
mkdirSync(destination, { recursive: true });

const envelope = (time, duration, attack = 0.015, release = 0.16) =>
  Math.min(1, time / attack) *
  Math.min(1, Math.max(0, (duration - time) / release));
const sine = (phase) => Math.sin(phase * Math.PI * 2);
const seededNoise = (index) => {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
};

function render(name, duration, makeSample) {
  const length = Math.ceil(duration * rate);
  const samples = new Float32Array(length);
  let peak = 0;
  for (let i = 0; i < length; i += 1) {
    const value = makeSample(i / rate, i);
    samples[i] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  const scale = peak > 0 ? 0.82 / peak : 1;
  const output = Buffer.alloc(44 + length * 2);
  output.write('RIFF', 0);
  output.writeUInt32LE(36 + length * 2, 4);
  output.write('WAVE', 8);
  output.write('fmt ', 12);
  output.writeUInt32LE(16, 16);
  output.writeUInt16LE(1, 20);
  output.writeUInt16LE(1, 22);
  output.writeUInt32LE(rate, 24);
  output.writeUInt32LE(rate * 2, 28);
  output.writeUInt16LE(2, 32);
  output.writeUInt16LE(16, 34);
  output.write('data', 36);
  output.writeUInt32LE(length * 2, 40);
  for (let i = 0; i < length; i += 1)
    output.writeInt16LE(
      Math.max(-32767, Math.min(32767, samples[i] * scale * 32767)),
      44 + i * 2,
    );
  writeFileSync(new URL(`${name}.wav`, destination), output);
}

function mallet(name, frequency) {
  render(name, 0.72, (t) => {
    const decay = Math.exp(-5.2 * t);
    return (
      (sine(frequency * t) +
        0.28 * sine(frequency * 2.01 * t) +
        0.09 * sine(frequency * 3.98 * t)) *
      decay *
      envelope(t, 0.72, 0.006, 0.18)
    );
  });
}

render('unlock', 0.08, () => 0);
render(
  'pop',
  0.16,
  (t) =>
    sine((820 - (560 * t) / 0.16) * t) * Math.exp(-24 * t) +
    seededNoise(Math.floor(t * rate)) * Math.exp(-38 * t) * 0.2,
);
render(
  'paint',
  0.16,
  (t) => sine((280 + 180 * t) * t) * Math.exp(-13 * t) * 0.55,
);
render(
  'star',
  0.82,
  (t) =>
    [523, 659, 784].reduce((sum, frequency, index) => {
      const local = t - index * 0.09;
      return local > 0
        ? sum + sine(frequency * local) * Math.exp(-4.8 * local)
        : sum;
    }, 0) * 0.42,
);
render(
  'drum',
  0.34,
  (t, i) =>
    (sine((145 - 95 * Math.min(1, t / 0.25)) * t) * 0.9 +
      seededNoise(i) * Math.exp(-32 * t) * 0.22) *
    Math.exp(-9 * t),
);
render('clap', 0.3, (t, i) => {
  const pulse = [0, 0.05, 0.1].reduce(
    (sum, start) => (t >= start ? sum + Math.exp(-45 * (t - start)) : sum),
    0,
  );
  return seededNoise(i) * pulse * 0.52;
});
render('cow', 1.65, (t) => {
  const part = t < 0.78 ? t : t - 0.86;
  if (part < 0 || part > 0.78) return 0;
  const f = (t < 0.78 ? 118 : 105) - 25 * part;
  const breath = 1 + 0.06 * sine(5.2 * part);
  return (
    (sine(f * part) + 0.34 * sine(f * 2 * part) + 0.13 * sine(f * 3 * part)) *
    envelope(part, 0.78, 0.08, 0.24) *
    breath
  );
});
render('sheep', 1.0, (t) => {
  const wobble = 220 + 22 * sine(8.5 * t) + 8 * sine(17 * t);
  return (
    (sine(wobble * t) +
      0.42 * sine(wobble * 2.9 * t) +
      0.18 * sine(wobble * 5.1 * t)) *
    envelope(t, 1, 0.045, 0.18) *
    (0.8 + 0.2 * sine(7 * t))
  );
});
render('duck', 0.48, (t) => {
  const part = t < 0.2 ? t : t - 0.27;
  if (part < 0 || part > 0.2) return 0;
  const f = 330 - (120 * part) / 0.2;
  return (
    (Math.sign(sine(f * part)) * 0.5 + sine(f * 2.7 * part) * 0.2) *
    envelope(part, 0.2, 0.008, 0.09)
  );
});
render('pig', 0.62, (t) => {
  const part = t < 0.22 ? t : t - 0.31;
  if (part < 0 || part > 0.24) return 0;
  const f = 125 - (45 * part) / 0.24;
  return (
    (sine(f * part) +
      0.45 * sine(f * 2.05 * part) +
      0.15 * sine(f * 4.2 * part)) *
    envelope(part, 0.24, 0.012, 0.1)
  );
});

[262, 330, 392, 523, 659, 370, 440, 510, 580, 650].forEach((frequency) =>
  mallet(`note-${frequency}`, frequency),
);
