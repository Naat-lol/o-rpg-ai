export async function onRequest(context) {
    // Configurar CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Responder a requisições OPTIONS para CORS
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders,
        });
    }

    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({
            success: false,
            message: 'Método não permitido'
        }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    try {
        const { env } = context;
        const data = await context.request.json();
        
        // Gerar ID único
        const id = generateId();
        
        // Adicionar timestamp para expiração (30 dias)
        const timestamp = Date.now();
        const dataComTimestamp = {
            ...data,
            _timestamp: timestamp
        };
        
        // Salvar no KV
        await env.LS_STORE.put(id, JSON.stringify(dataComTimestamp), {
            expirationTtl: 60 * 60 * 24 * 30 // 30 dias em segundos
        });
        
        return new Response(JSON.stringify({
            success: true,
            id: id,
            message: 'Ficha salva com sucesso'
        }), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
        
    } catch (error) {
        console.error('Erro ao salvar ficha:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Erro interno do servidor'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}

// Função para gerar ID curto
function generateId() {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
}
