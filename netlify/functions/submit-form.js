exports.handler = async function(event, context) {
    // Só aceita requisições POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    if (!N8N_WEBHOOK_URL) {
        const msg = 'Environment variable N8N_WEBHOOK_URL is not defined';
        console.error(msg);
        return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }
    
    try {
        // Pega os dados enviados pelo js/main.js
        const data = JSON.parse(event.body);

        // Encaminha os dados para o n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const body = await response.text();
            console.error('submit-form forwarding error:', response.status, body);
            return { statusCode: 502, body: JSON.stringify({ error: 'Failed to forward to n8n', status: response.status, body }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Formulário enviado com sucesso" })
        };
    } catch (error) {
        console.error('submit-form error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
    }
};