'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { LogOut, Play, RotateCcw, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setAudioOverrides, type AudioKey } from '@/lib/audio';

const slots: Array<{ key: AudioKey; label: string; icon: string }> = [
  { key: 'peekaboo', label: 'Peekaboo voice', icon: '🙈' },
  { key: 'cow', label: 'Cow', icon: '🐮' },
  { key: 'sheep', label: 'Sheep', icon: '🐑' },
  { key: 'duck', label: 'Duck', icon: '🐥' },
  { key: 'pig', label: 'Pig', icon: '🐷' },
  { key: 'cat', label: 'Cat', icon: '🐱' },
  { key: 'dog', label: 'Dog', icon: '🐶' },
  { key: 'horse', label: 'Horse', icon: '🐴' },
  { key: 'rooster', label: 'Rooster', icon: '🐓' },
  { key: 'piano', label: 'Piano notes', icon: '🎹' },
  { key: 'drum', label: 'Drum', icon: '🥁' },
  { key: 'clap', label: 'Clapping', icon: '👏' },
  { key: 'pop', label: 'Pops & taps', icon: '🫧' },
  { key: 'paint', label: 'Painting', icon: '🎨' },
  { key: 'star', label: 'Stars', icon: '⭐' },
  { key: 'success', label: 'Celebrations', icon: '🎉' },
];

export function SoundStudio() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState('');
  const [custom, setCustom] = useState<Record<string, string>>({});
  const input = useRef<HTMLInputElement>(null);
  const pending = useRef<AudioKey | null>(null);

  const loadSounds = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    const { data: sessionData } = await client.auth.getSession();
    const response = await fetch('/api/audio', { headers: { Authorization: `Bearer ${sessionData.session?.access_token ?? ''}` } });
    if (!response.ok) { setStatus('Your sound library could not be loaded.'); return; }
    const next = (await response.json()) as Record<string, string>;
    setCustom(next); setAudioOverrides(next);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      const activeUser = data.session?.user ?? null; setUser(activeUser); if (activeUser) void loadSounds();
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => queueMicrotask(() => {
      const activeUser = session?.user ?? null; setUser(activeUser);
      if (activeUser) void loadSounds(); else { setCustom({}); setAudioOverrides({}); }
    }));
    return () => data.subscription.unsubscribe();
  }, [loadSounds]);

  const sendLink = async () => {
    if (!supabase || !email.trim()) return;
    setStatus('Sending your secure sign-in link…');
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    if (error) { setStatus(error.message); return; }
    setSent(true); setStatus('Check your email, then return here.');
  };

  const chooseFile = (key: AudioKey) => { pending.current = key; input.current?.click(); };
  const upload = async (file?: File) => {
    const key = pending.current;
    if (!supabase || !user || !key || !file) return;
    if (!file.type.startsWith('audio/')) { setStatus('Please choose an audio file.'); return; }
    if (file.size > 8 * 1024 * 1024) { setStatus('Please choose a sound smaller than 8 MB.'); return; }
    setStatus(`Uploading ${file.name}…`);
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch('/api/audio', { method: 'POST', headers: { Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ key, contentType: file.type || 'audio/mpeg' }) });
    const ticket = await response.json().catch(() => null) as { error?: string; path?: string; token?: string } | null;
    if (!response.ok || !ticket?.path || !ticket.token) { setStatus(ticket?.error ?? 'That sound could not be uploaded.'); return; }
    const { error } = await supabase.storage.from('tiny-tap-audio').uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type || 'audio/mpeg', cacheControl: '3600' });
    if (error) { setStatus(error.message); return; }
    await loadSounds(); setStatus('Your sound is ready in every matching game.');
  };

  const reset = async (key: AudioKey) => {
    if (!supabase || !user) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch('/api/audio', { method: 'DELETE', headers: { Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
    if (!response.ok) { setStatus('That sound could not be restored.'); return; }
    const next = { ...custom }; delete next[key]; setCustom(next); setAudioOverrides(next); setStatus('Original sound restored.');
  };

  if (!supabase) return <section className="sound-studio"><h3>Your sound library</h3><p>Sound profiles are being connected. The built-in sounds will keep working normally.</p></section>;
  if (!user) return <section className="sound-studio">
    <div className="studio-heading"><span>🎙️</span><div><h3>Your sound library</h3><p>Sign in to replace sounds with familiar voices, music, or recordings.</p></div></div>
    <label className="auth-field">Email address<input type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
    <button className="studio-primary" onClick={sendLink}>{sent ? 'Send another link' : 'Email me a sign-in link'}</button>
    {status && <output className="studio-status">{status}</output>}
  </section>;

  return <section className="sound-studio">
    <div className="studio-account"><div><strong>Your sound library</strong><small>{user.email}</small></div><button onClick={() => supabase?.auth.signOut()}><LogOut /> Sign out</button></div>
    <p>Choose any sound slot. Your private recording will play everywhere that sound is used.</p>
    <input ref={input} hidden type="file" accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.webm" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ''; }} />
    <div className="sound-grid">{slots.map((slot) => <article key={slot.key} className={custom[slot.key] ? 'custom' : ''}>
      <span>{slot.icon}</span><div><strong>{slot.label}</strong><small>{custom[slot.key] ? 'Your sound' : 'Original sound'}</small></div>
      <button aria-label={`Upload ${slot.label}`} onClick={() => chooseFile(slot.key)}><Upload /></button>
      {custom[slot.key] && <><button aria-label={`Preview ${slot.label}`} onClick={() => { const audio = new Audio(custom[slot.key]); void audio.play(); }}><Play /></button><button aria-label={`Restore ${slot.label}`} onClick={() => void reset(slot.key)}><RotateCcw /></button></>}
    </article>)}</div>
    {status && <output className="studio-status">{status}</output>}
  </section>;
}
