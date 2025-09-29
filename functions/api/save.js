export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const dados = await request.json();
        
        // Gera ID único curto
        const id = generateId();
        
        // Salva no KV Store
        await env.LS_STORE.put(id, JSON.stringify({
            dados: dados,
            created: new Date().toISOString()
        }), {
            expirationTtl: 60 * 60 * 24 * 7 // Expira em 7 dias
        });
        
        return new Response(JSON.stringify({
            success: true,
            id: id,
            message: 'Dados salvos com sucesso'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function generateId() {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
}
