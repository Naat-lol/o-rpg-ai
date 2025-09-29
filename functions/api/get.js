export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
        return new Response(JSON.stringify({
            success: false,
            error: 'ID não fornecido'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const dados = await env.LS_STORE.get(id);
        
        if (!dados) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Dados não encontrados'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const parsed = JSON.parse(dados);
        
        return new Response(JSON.stringify({
            success: true,
            dados: parsed.dados,
            created: parsed.created
        }), {
            headers: { 'Content-Type': 'application/json' }
