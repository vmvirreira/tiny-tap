'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Info,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { playSound, playTone, preloadAudio, unlockAudio } from '@/lib/audio';

type Game = {
  id: string;
  age: '6m' | '9m' | '12m' | '18m' | '24m';
  title: string;
  prompt: string;
  icon: string;
  color: string;
  skill: string;
};
const games: Game[] = [
  {
    id: 'color',
    age: '6m',
    title: 'Color Splash',
    prompt: 'Tap anywhere',
    icon: '🌈',
    color: '#ff6b6b',
    skill: 'Cause & effect',
  },
  {
    id: 'peekaboo',
    age: '6m',
    title: 'Peekaboo!',
    prompt: 'Find the friend',
    icon: '🙈',
    color: '#f6bd60',
    skill: 'Object permanence',
  },
  {
    id: 'animals',
    age: '9m',
    title: 'Animal Hello',
    prompt: 'Who makes that sound?',
    icon: '🐮',
    color: '#7cc576',
    skill: 'Sound recognition',
  },
  {
    id: 'bubbles',
    age: '9m',
    title: 'Bubble Pop',
    prompt: 'Pop, pop, pop!',
    icon: '🫧',
    color: '#53c7e8',
    skill: 'Visual tracking',
  },
  {
    id: 'paint',
    age: '12m',
    title: 'Finger Paint',
    prompt: 'Wiggle and swirl',
    icon: '🎨',
    color: '#a78bfa',
    skill: 'Fine motor play',
  },
  {
    id: 'music',
    age: '12m',
    title: 'Happy Notes',
    prompt: 'Make a tiny tune',
    icon: '🎵',
    color: '#ef75b6',
    skill: 'Sound exploration',
  },
  {
    id: 'light',
    age: '18m',
    title: 'Catch the Star',
    prompt: 'Follow the sparkle',
    icon: '⭐',
    color: '#ff9f43',
    skill: 'Hand-eye coordination',
  },
  {
    id: 'shapes',
    age: '18m',
    title: 'Shape Homes',
    prompt: 'Match each shape',
    icon: '🔷',
    color: '#24b99a',
    skill: 'Shape matching',
  },
  {
    id: 'count',
    age: '24m',
    title: 'Apple Basket',
    prompt: 'Count 1, 2, 3',
    icon: '🍎',
    color: '#e8584f',
    skill: 'Early counting',
  },
  {
    id: 'rhythm',
    age: '24m',
    title: 'Copy the Beat',
    prompt: 'Listen, then tap',
    icon: '🥁',
    color: '#5965d8',
    skill: 'Memory & rhythm',
  },
];
const ages = [
  { id: 'all', label: 'All play' },
  { id: '6m', label: '6+ months' },
  { id: '9m', label: '9+ months' },
  { id: '12m', label: '12+ months' },
  { id: '18m', label: '18+ months' },
  { id: '24m', label: '2+ years' },
];
const palette = [
  '#ff6b6b',
  '#f6bd60',
  '#7cc576',
  '#53c7e8',
  '#a78bfa',
  '#ef75b6',
];

export default function Home() {
  const [age, setAge] = useState('all');
  const [active, setActive] = useState<Game | null>(null);
  const [muted, setMuted] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const filtered =
    age === 'all' ? games : games.filter((game) => game.age === age);
  useEffect(() => {
    document.body.style.overflow = active ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
  useEffect(() => {
    preloadAudio();
    document.addEventListener('pointerdown', unlockAudio, true);
    document.addEventListener('touchend', unlockAudio, true);
    return () => {
      document.removeEventListener('pointerdown', unlockAudio, true);
      document.removeEventListener('touchend', unlockAudio, true);
    };
  }, []);
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tiny Tap home">
          <span className="brand-mark" aria-hidden="true">
            t
          </span>
          <span>Tiny Tap</span>
        </a>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <button className="grownup-button" onClick={() => setShowNote(true)}>
            <Info /> Grown-ups
          </button>
        </div>
      </header>
      <section className="intro" id="top">
        <div>
          <span className="eyebrow">
            <Sparkles /> Little games for growing minds
          </span>
          <h1>
            Tap, giggle,
            <br />
            <em>discover.</em>
          </h1>
          <p>
            Ten gentle mini-games made for curious fingers — no ads, no scores,
            just play.
          </p>
        </div>
        <div className="intro-orbit" aria-hidden="true">
          <span className="orbit-main">🖐️</span>
          <span className="orbit-item orbit-one">★</span>
          <span className="orbit-item orbit-two">●</span>
          <span className="orbit-item orbit-three">♥</span>
        </div>
      </section>
      <nav className="age-filter" aria-label="Choose an age">
        {ages.map((item) => (
          <button
            key={item.id}
            className={age === item.id ? 'active' : ''}
            onClick={() => setAge(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <section className="game-grid" aria-label="Games">
        {filtered.map((game, index) => (
          <button
            className="game-card"
            style={
              {
                '--game-color': game.color,
                '--delay': `${index * 40}ms`,
              } as React.CSSProperties
            }
            key={game.id}
            onClick={() => setActive(game)}
          >
            <span className="age-badge">
              {game.age === '24m'
                ? '2+ years'
                : `${game.age.replace('m', '')}+ months`}
            </span>
            <span className="game-icon" aria-hidden="true">
              {game.icon}
            </span>
            <span className="game-copy">
              <strong>{game.title}</strong>
              <small>{game.prompt}</small>
            </span>
            <span className="play-dot" aria-hidden="true">
              →
            </span>
            <span className="skill-label">{game.skill}</span>
          </button>
        ))}
      </section>
      <footer>
        <Heart fill="currentColor" /> Made for little hands and shared moments.
        <a href="/audio/CREDITS.txt" target="_blank" rel="noreferrer">
          Sound credits
        </a>
      </footer>
      {active && (
        <Playroom
          game={active}
          muted={muted}
          onMute={() => setMuted(!muted)}
          onClose={() => setActive(null)}
        />
      )}
      {showNote && (
        <dialog open className="dialog-backdrop">
          <section className="grownup-note" aria-labelledby="grownup-title">
            <button
              className="dialog-close"
              onClick={() => setShowNote(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <span className="note-icon">👋</span>
            <h2 id="grownup-title">A note for grown-ups</h2>
            <p>
              These games are designed for short, shared play. Sit nearby, name
              what happens, and follow your child’s lead.
            </p>
            <ul>
              <li>Keep volume comfortable and take screen breaks.</li>
              <li>Ages are friendly suggestions, not milestones.</li>
              <li>For babies, place the device on a steady surface.</li>
            </ul>
            <button className="note-done" onClick={() => setShowNote(false)}>
              Let’s play
            </button>
          </section>
        </dialog>
      )}
    </main>
  );
}

function Playroom({
  game,
  muted,
  onMute,
  onClose,
}: {
  game: Game;
  muted: boolean;
  onMute: () => void;
  onClose: () => void;
}) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <dialog
      open
      className="playroom"
      style={{ '--game-color': game.color } as React.CSSProperties}
      aria-label={game.title}
    >
      <div className="playroom-bar">
        <button onClick={onClose}>
          <ArrowLeft /> All games
        </button>
        <div className="playroom-title">
          <span>{game.icon}</span>
          {game.title}
        </div>
        <div className="playroom-actions">
          <button
            onClick={() => setResetKey((key) => key + 1)}
            aria-label="Start over"
          >
            <RotateCcw />
          </button>
          <button
            onClick={onMute}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
        </div>
      </div>
      <GameStage key={resetKey} id={game.id} muted={muted} />
    </dialog>
  );
}
function GameStage({ id, muted }: { id: string; muted: boolean }) {
  if (id === 'color') return <ColorSplash muted={muted} />;
  if (id === 'peekaboo') return <Peekaboo muted={muted} />;
  if (id === 'animals') return <Animals muted={muted} />;
  if (id === 'bubbles') return <Bubbles muted={muted} />;
  if (id === 'paint') return <FingerPaint muted={muted} />;
  if (id === 'music') return <Music muted={muted} />;
  if (id === 'light') return <CatchStar muted={muted} />;
  if (id === 'shapes') return <ShapeHomes muted={muted} />;
  if (id === 'count') return <AppleBasket muted={muted} />;
  return <CopyBeat muted={muted} />;
}

function ColorSplash({ muted }: { muted: boolean }) {
  const [index, setIndex] = useState(0);
  const [splashes, setSplashes] = useState<
    { x: number; y: number; id: number }[]
  >([]);
  const colors = [
    '#ff6b6b',
    '#ffc857',
    '#58c4a3',
    '#4dabf7',
    '#9c72e8',
    '#ff82b2',
  ];
  const names = ['Red!', 'Yellow!', 'Green!', 'Blue!', 'Purple!', 'Pink!'];
  const tap = (event: React.PointerEvent) => {
    const next = (index + 1) % colors.length;
    setIndex(next);
    setSplashes((items) => [
      ...items.slice(-5),
      { x: event.clientX, y: event.clientY, id: Date.now() },
    ]);
    if (!muted) playTone(260 + next * 70, 0.28);
  };
  return (
    <button
      className="full-tap color-stage"
      style={{ background: colors[index] }}
      onPointerDown={tap}
    >
      <span>{names[index]}</span>
      {splashes.map((s) => (
        <i key={s.id} style={{ left: s.x, top: s.y }} />
      ))}
      <small>Tap anywhere</small>
    </button>
  );
}
function Peekaboo({ muted }: { muted: boolean }) {
  const [open, setOpen] = useState(false);
  const friends = ['🐵', '🐻', '🐰', '🦁'];
  const [friend, setFriend] = useState(0);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !muted) playSound('peekaboo');
  };
  return (
    <div className={`activity-stage peek-stage ${open ? 'open' : ''}`}>
      <button
        className="peek-tap"
        onPointerDown={toggle}
        aria-label={open ? 'Hide friend' : 'Show friend'}
      />
      <span className="curtain left" />
      <span className="curtain right" />
      <span className="peek-friend">{friends[friend]}</span>
      <strong>{open ? 'Peekaboo!' : 'Tap to peek'}</strong>
      {open && (
        <button
          className="next-friend"
          onClick={() => setFriend((friend + 1) % friends.length)}
        >
          Another friend →
        </button>
      )}
    </div>
  );
}
function Animals({ muted }: { muted: boolean }) {
  const animals = [
    { icon: '🐮', name: 'Cow', sound: 'Moooo!', audio: 'cow' },
    { icon: '🐑', name: 'Sheep', sound: 'Baaaa!', audio: 'sheep' },
    { icon: '🐥', name: 'Duck', sound: 'Quack quack!', audio: 'duck' },
    { icon: '🐷', name: 'Pig', sound: 'Oink oink!', audio: 'pig' },
  ] as const;
  const [message, setMessage] = useState('Tap an animal');
  return (
    <div className="activity-stage animal-stage">
      <h2>{message}</h2>
      <div className="animal-grid">
        {animals.map((animal) => (
          <button
            key={animal.name}
            onPointerDown={() => {
              setMessage(`${animal.name} says ${animal.sound}`);
              if (!muted) playSound(animal.audio);
            }}
          >
            <span>{animal.icon}</span>
            <strong>{animal.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
function Bubbles({ muted }: { muted: boolean }) {
  const initial = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 8 + ((i * 37) % 84),
        y: 12 + ((i * 29) % 75),
        size: 58 + (i % 4) * 22,
      })),
    [],
  );
  const [bubbles, setBubbles] = useState(initial);
  return (
    <div className="activity-stage bubble-stage">
      <p>
        {bubbles.length
          ? `${bubbles.length} bubbles floating`
          : 'All popped! ✨'}
      </p>
      {bubbles.map((bubble) => (
        <button
          aria-label="Pop bubble"
          className="bubble"
          key={bubble.id}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          onClick={() => {
            setBubbles((items) =>
              items.filter((item) => item.id !== bubble.id),
            );
            if (!muted) playSound('pop');
          }}
        />
      ))}
    </div>
  );
}
function FingerPaint({ muted }: { muted: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(palette[0]);
  const drawing = useRef(false);
  const point = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || !canvas.current) return;
      const rect = canvas.current.getBoundingClientRect();
      const ctx = canvas.current.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        event.clientX - rect.left,
        event.clientY - rect.top,
        28,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    },
    [color],
  );
  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = canvas.current.clientWidth;
    canvas.current.height = canvas.current.clientHeight;
  }, []);
  return (
    <div className="activity-stage paint-stage">
      <div className="paint-tools">
        {palette.map((item) => (
          <button
            aria-label={`Choose ${item}`}
            className={item === color ? 'selected' : ''}
            key={item}
            style={{ background: item }}
            onClick={() => setColor(item)}
          />
        ))}
      </div>
      <canvas
        ref={canvas}
        onPointerDown={(e) => {
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          point(e);
          if (!muted) playSound('paint');
        }}
        onPointerMove={point}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
    </div>
  );
}
function Music({ muted }: { muted: boolean }) {
  const notes = [262, 330, 392, 523, 659];
  return (
    <div className="activity-stage music-stage">
      <h2>Tap a note!</h2>
      <div className="music-row">
        {notes.map((note, i) => (
          <button
            key={note}
            style={{ background: palette[i] }}
            onPointerDown={() => {
              if (!muted) playTone(note, 0.62);
            }}
          >
            <span>{['●', '▲', '■', '♥', '★'][i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function CatchStar({ muted }: { muted: boolean }) {
  const [position, setPosition] = useState({ x: 50, y: 48 });
  const [count, setCount] = useState(0);
  const move = () => {
    setCount(count + 1);
    setPosition({ x: 12 + Math.random() * 76, y: 18 + Math.random() * 64 });
    if (!muted) playSound('star');
  };
  return (
    <div className="activity-stage star-stage">
      <p>{count === 0 ? 'Where is the star?' : `${count} happy catches!`}</p>
      <button
        aria-label="Catch the star"
        className="catch-star"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        onPointerDown={move}
      >
        ⭐
      </button>
    </div>
  );
}
function ShapeHomes({ muted }: { muted: boolean }) {
  const shapes = [
    { char: '●', name: 'circle', color: '#ff6b6b' },
    { char: '▲', name: 'triangle', color: '#f6bd60' },
    { char: '■', name: 'square', color: '#53c7e8' },
  ];
  const [next, setNext] = useState(0);
  return (
    <div className="activity-stage shape-stage">
      <h2>
        {next === shapes.length
          ? 'They’re all home! 🎉'
          : `Find the ${shapes[next].name}`}
      </h2>
      <div className="shape-options">
        {shapes.map((shape, i) => (
          <button
            key={shape.name}
            disabled={i < next}
            style={{ color: shape.color }}
            onClick={() => {
              if (i === next) {
                setNext(next + 1);
                if (!muted) {
                  if (i === shapes.length - 1) playSound('success');
                  else playTone(420 + i * 120);
                }
              }
            }}
          >
            {i < next ? '✓' : shape.char}
          </button>
        ))}
      </div>
      <div className="shape-homes">
        {shapes.map((shape, i) => (
          <span key={shape.name} className={i < next ? 'filled' : ''}>
            {shape.char}
          </span>
        ))}
      </div>
    </div>
  );
}
function AppleBasket({ muted }: { muted: boolean }) {
  const [count, setCount] = useState(0);
  const add = () => {
    if (count >= 5) return;
    const next = count + 1;
    setCount(next);
    if (!muted) {
      if (next === 5) playSound('success');
      else playTone(300 + next * 70);
    }
  };
  return (
    <div className="activity-stage count-stage">
      <h2>{count < 5 ? 'Put apples in the basket' : 'Five apples! Hooray!'}</h2>
      <button
        className="apple-tree"
        onClick={add}
        disabled={count >= 5}
        aria-label="Pick an apple"
      >
        🌳<span>🍎</span>
      </button>
      <div className="basket">
        <span>🧺</span>
        <div>
          {Array.from({ length: count }, (_, i) => (
            <i key={i}>🍎</i>
          ))}
        </div>
      </div>
      <strong>{count}</strong>
    </div>
  );
}
function CopyBeat({ muted }: { muted: boolean }) {
  const [step, setStep] = useState(0);
  const [beat] = useState(() => {
    const pattern = Array.from({ length: 4 }, () =>
      Math.random() < 0.5 ? 0 : 1,
    );
    if (new Set(pattern).size === 1) pattern[3] = pattern[0] === 0 ? 1 : 0;
    return pattern;
  });
  const tap = (side: number) => {
    if (!muted) playSound(side ? 'clap' : 'drum');
    if (side === beat[step]) setStep(step + 1);
    else setStep(0);
  };
  return (
    <div className="activity-stage rhythm-stage">
      <h2>
        {step >= beat.length
          ? 'You got the beat! 🎉'
          : `Copy the beat · ${step}/${beat.length}`}
      </h2>
      <div className="beat-guide">
        {beat.map((item, i) => (
          <span
            key={i}
            className={i === step ? 'current' : i < step ? 'done' : ''}
          >
            {item ? '👏' : '🥁'}
          </span>
        ))}
      </div>
      <div className="drums">
        <button onPointerDown={() => tap(0)}>
          🥁<small>drum</small>
        </button>
        <button onPointerDown={() => tap(1)}>
          👏<small>clap</small>
        </button>
      </div>
    </div>
  );
}
