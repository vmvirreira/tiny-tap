import { createClient } from '@supabase/supabase-js';

const BUCKET = 'tiny-tap-audio';
const audioKeys = new Set(['peekaboo', 'cow', 'sheep', 'duck', 'pig', 'cat', 'dog', 'horse', 'rooster', 'piano', 'drum', 'clap', 'pop', 'paint', 'star', 'success']);
const allowedTypes = new Set(['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm']);

type RequestLike = { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type ResponseLike = { statusCode: number; setHeader(name: string, value: string): void; end(value?: string): void };

function json(response: ResponseLike, status: number, value: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(value));
}

export default async function handler(request: RequestLike, response: ResponseLike) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return json(response, 503, { error: 'Sound profiles are not configured.' });
  const token = String(request.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return json(response, 401, { error: 'Please sign in first.' });
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error: authError } = await admin.auth.getUser(token);
  if (authError || !data.user) return json(response, 401, { error: 'Your sign-in has expired.' });
  const folder = data.user.id;

  if (request.method === 'GET') {
    const { data: files, error } = await admin.storage.from(BUCKET).list(folder, { limit: 50 });
    if (error) return json(response, 500, { error: error.message });
    const names = (files ?? []).map((file) => file.name).filter((name) => audioKeys.has(name));
    if (!names.length) return json(response, 200, {});
    const { data: signed, error: signedError } = await admin.storage.from(BUCKET).createSignedUrls(names.map((name) => `${folder}/${name}`), 60 * 60 * 12);
    if (signedError) return json(response, 500, { error: signedError.message });
    return json(response, 200, Object.fromEntries((signed ?? []).flatMap((item, index) => item.signedUrl ? [[names[index], item.signedUrl]] : [])));
  }

  if (request.method === 'POST') {
    const key = typeof request.body === 'object' && request.body && 'key' in request.body ? String(request.body.key) : '';
    const type = typeof request.body === 'object' && request.body && 'contentType' in request.body ? String(request.body.contentType).split(';')[0].toLowerCase() : '';
    if (!audioKeys.has(key)) return json(response, 400, { error: 'Unknown sound slot.' });
    if (!allowedTypes.has(type)) return json(response, 415, { error: 'Please choose an MP3, M4A, WAV, AAC, OGG, or WebM audio file.' });
    const path = `${folder}/${key}`;
    const { data: ticket, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true });
    if (error || !ticket) return json(response, 500, { error: error?.message ?? 'Could not prepare the upload.' });
    return json(response, 200, { path: ticket.path, token: ticket.token });
  }

  if (request.method === 'DELETE') {
    const key = typeof request.body === 'object' && request.body && 'key' in request.body ? String(request.body.key) : '';
    if (!audioKeys.has(key)) return json(response, 400, { error: 'Unknown sound slot.' });
    const { error } = await admin.storage.from(BUCKET).remove([`${folder}/${key}`]);
    if (error) return json(response, 500, { error: error.message });
    return json(response, 200, { ok: true });
  }

  response.setHeader('Allow', 'GET, POST, DELETE');
  return json(response, 405, { error: 'Method not allowed.' });
}
