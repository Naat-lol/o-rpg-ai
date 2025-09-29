// /functions/api/get.js
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response('missing id', { status: 400 });

  const val = await env.LS_STORE.get(id);
  if (!val) return new Response('not found', { status: 404 });

  return new Response(val, { headers: { 'Content-Type': 'application/json' } });
}
