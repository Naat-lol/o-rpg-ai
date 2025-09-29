// /functions/api/save.js
export async function onRequestPost({ request, env }) {
  // pega o JSON enviado pelo frontend
  const body = await request.json().catch(() => null);
  if (!body) return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });

  // gera ID curto aleatório
  const id = cryptoRandomId();

  // salva no KV
  await env.LS_STORE.put(id, JSON.stringify(body));

  // retorna o ID pro frontend
  return new Response(JSON.stringify({ id }), { headers: { 'Content-Type': 'application/json' } });
}

// função para gerar ID curto aleatório
function cryptoRandomId(len = 8) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return Array.from(a).map(b => ('0' + (b % 36).toString(36)).slice(-1)).join('');
}
