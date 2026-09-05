-- Tiny Tap shares the VM Vieira project and keeps its resources namespaced.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tiny-tap-audio',
  'tiny-tap-audio',
  false,
  8388608,
  array['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Audio access is intentionally server-mediated. The browser sends its Supabase
-- access token to /api/audio, which verifies the user before using the service role.
-- No public storage policies are required and the bucket remains private.
