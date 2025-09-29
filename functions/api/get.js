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

    if (context.request.method !== 'GET') {
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
        const { env, request } = context;
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                message: 'ID não especificado'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
        
        // Buscar dados do KV
        const data = await env.LS_STORE.get(id);
        
        if (!data) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Ficha não encontrada ou expirada'
            }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
        
        const parsedData = JSON.parse(data);
        
        // Remover campo interno de timestamp antes de retornar
        delete parsedData._timestamp;
        
        return new Response(JSON.stringify({
            success: true,
            data: parsedData
        }), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
        
    } catch (error) {
        console.error('Erro ao buscar ficha:', error);
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
