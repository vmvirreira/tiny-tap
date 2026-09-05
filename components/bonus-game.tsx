'use client';

import { useMemo, useState } from 'react';
import type { BonusGameConfig } from '@/lib/bonus-games';
import { playSound, playTone } from '@/lib/audio';

const positions = [
  [18, 24], [47, 18], [76, 28], [28, 58], [62, 54], [83, 68], [44, 78], [14, 76],
];

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function BonusGame({ game, muted }: { game: BonusGameConfig; muted: boolean }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [taps, setTaps] = useState<Array<{ id: number; x: number; y: number; item: string }>>([]);
  const layout = useMemo(() => shuffled(positions).slice(0, Math.max(4, game.items.length)), [game.items.length]);
  const deck = useMemo(() => game.mode === 'match' ? shuffled([...game.items, ...game.items]) : shuffled(game.items), [game.mode, game.items]);

  const sound = (kind: 'soft' | 'success' = 'soft') => {
    if (muted) return;
    if (kind === 'success') playSound('success');
    else playTone(300 + ((score + step) % 5) * 75, 0.25, 0.58);
  };

  if (game.mode === 'tap') {
    return <button className="activity-stage bonus-stage bonus-tap" onPointerDown={(event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const item = game.items[(taps.length + 1) % game.items.length];
      setTaps((current) => [...current.slice(-18), { id: Date.now(), x: event.clientX - rect.left, y: event.clientY - rect.top, item }]);
      setScore((value) => value + 1); sound();
    }}>
      <GamePrompt text={game.instruction} status={`${score} little surprises`} />
      {taps.map((tap) => <span className="tap-spark" key={tap.id} style={{ left: tap.x, top: tap.y }}>{tap.item}</span>)}
      <span className="bonus-hero">{game.icon}</span>
    </button>;
  }

  if (game.mode === 'find') {
    const target = game.items[0];
    return <div className="activity-stage bonus-stage bonus-find">
      <GamePrompt text={game.instruction} status={score ? `${score} found!` : 'Look all around'} />
      {game.items.map((item, index) => { const position = layout[(index + score) % layout.length]; return <button key={`${item}-${index}`} style={{ left: `${position[0]}%`, top: `${position[1]}%` }} className={item === target ? 'find-target' : ''} onPointerDown={() => {
        if (item === target) { setScore((value) => value + 1); setStep((value) => value + 1); sound('success'); }
        else sound();
      }}>{item}</button>; })}
    </div>;
  }

  if (game.mode === 'reveal') {
    return <div className="activity-stage bonus-stage bonus-reveal">
      <GamePrompt text={game.instruction} status={`${selected.length}/${game.items.length} opened`} />
      <div className="reveal-grid">{game.items.map((item, index) => <button key={`${item}-${index}`} className={selected.includes(index) ? 'revealed' : ''} onClick={() => {
        if (!selected.includes(index)) { setSelected((items) => [...items, index]); sound(selected.length + 1 === game.items.length ? 'success' : 'soft'); }
      }}><span>{item}</span><i>?</i></button>)}</div>
    </div>;
  }

  if (game.mode === 'collect') {
    return <div className="activity-stage bonus-stage bonus-collect">
      <GamePrompt text={game.instruction} status={selected.length === game.items.length ? 'All done! 🎉' : `${selected.length}/${game.items.length} collected`} />
      {game.items.map((item, index) => !selected.includes(index) && <button key={`${item}-${index}`} style={{ left: `${layout[index][0]}%`, top: `${layout[index][1]}%` }} onPointerDown={() => {
        const next = [...selected, index]; setSelected(next); sound(next.length === game.items.length ? 'success' : 'soft');
      }}>{item}</button>)}
      <div className="collection-bin">{selected.map((index) => <span key={index}>{game.items[index]}</span>)}</div>
    </div>;
  }

  if (game.mode === 'sort') {
    const groups = game.id === 'weather-dress' ? ['🌧️', '☀️'] : game.id === 'animal-homes' ? ['🌊', '🌳', '🏠'] : ['●', '■', '▲'];
    const weatherAnswers = [0, 0, 1, 1, 0, 1];
    const answer = game.id === 'weather-dress' ? weatherAnswers[step] : step % groups.length;
    return <div className="activity-stage bonus-stage bonus-choice">
      <GamePrompt text={game.instruction} status={step === game.items.length ? 'Everything is sorted! 🎉' : `Where does ${game.items[step]} go?`} />
      <div className="sort-item">{step < game.items.length ? game.items[step] : '✓'}</div>
      <div className="choice-row sort-bins">{groups.map((group, index) => <button key={group} onClick={() => {
        if (index !== answer) { sound(); return; }
        const next = step + 1; setStep(next); sound(next === game.items.length ? 'success' : 'soft');
      }}>{group}</button>)}</div>
    </div>;
  }

  if (game.mode === 'sequence' || game.mode === 'pretend') {
    return <div className="activity-stage bonus-stage bonus-sequence">
      <GamePrompt text={game.instruction} status={step === game.items.length ? 'You did every step! 🎉' : `Step ${Math.min(step + 1, game.items.length)} of ${game.items.length}`} />
      <div className="sequence-row">{game.items.map((item, index) => <button key={`${item}-${index}`} disabled={index < step} className={index === step ? 'current' : index < step ? 'done' : ''} onClick={() => {
        if (index !== step) { sound(); return; }
        const next = step + 1; setStep(next); sound(next === game.items.length ? 'success' : 'soft');
      }}><span>{index < step ? '✓' : item}</span><small>{index + 1}</small></button>)}</div>
    </div>;
  }

  if (game.mode === 'match') {
    const matched = selected;
    const choose = (index: number) => {
      if (open.includes(index) || matched.includes(index)) return;
      if (open.length === 0) { setOpen([index]); sound(); return; }
      const first = open[0];
      if (deck[first] === deck[index]) { const next = [...matched, first, index]; setSelected(next); setOpen([]); sound(next.length === deck.length ? 'success' : 'soft'); }
      else { setOpen([index]); sound(); window.setTimeout(() => setOpen([]), 550); }
    };
    return <div className="activity-stage bonus-stage bonus-match">
      <GamePrompt text={game.instruction} status={`${matched.length / 2}/${deck.length / 2} pairs`} />
      <div className="match-grid">{deck.map((item, index) => <button key={index} className={open.includes(index) || matched.includes(index) ? 'open' : ''} onClick={() => choose(index)}><span>{item}</span><i>★</i></button>)}</div>
    </div>;
  }

  if (game.mode === 'pattern') {
    const answer = game.items[1] ?? game.items[0];
    const options = shuffled([answer, game.items[0], answer === '🟡' ? '🔵' : '🟡']);
    return <div className="activity-stage bonus-stage bonus-choice">
      <GamePrompt text={game.instruction} status={score ? 'That completes it! 🎉' : `${game.items.join('  ')}  ?`} />
      <div className="choice-row">{options.map((item, index) => <button key={`${item}-${index}`} onClick={() => { if (item === answer) { setScore(1); sound('success'); } else sound(); }}>{item}</button>)}</div>
    </div>;
  }

  const correct = game.items[game.id === 'body-parts' ? 2 : game.id === 'feeling-faces' ? 0 : game.id === 'opposite-day' ? 1 : game.id === 'traffic-helper' ? 2 : 0];
  return <div className="activity-stage bonus-stage bonus-choice">
    <GamePrompt text={game.instruction} status={score ? 'Great choice! 🎉' : 'Tap one'} />
    <div className="choice-row">{game.items.map((item, index) => <button key={`${item}-${index}`} className={score && item === correct ? 'correct' : ''} onClick={() => {
      if (game.id === 'baby-band' || game.id === 'sound-baskets' || game.id === 'color-mixer') {
        setScore((value) => value + 1);
        if (!muted) {
          if (item === '🥁') playSound('drum');
          else if (item === '👏') playSound('clap');
          else if (item === '🐮') playSound('cow');
          else playTone(262 + index * 130);
        }
        return;
      }
      if (item === correct) { setScore(1); sound('success'); } else sound();
    }}>{item}</button>)}</div>
  </div>;
}

function GamePrompt({ text, status }: { text: string; status: string }) {
  return <div className="bonus-prompt"><strong>{text}</strong><small>{status}</small></div>;
}
