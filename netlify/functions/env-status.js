exports.handler = async function(event, context) {
    try {
        const vars = {
            STRAPI_URL: !!process.env.STRAPI_URL,
            STRAPI_TOKEN: !!process.env.STRAPI_TOKEN,
            N8N_WEBHOOK_URL: !!process.env.N8N_WEBHOOK_URL
        };
        return {
            statusCode: 200,
            body: JSON.stringify(vars)
        };
    } catch (err) {
        console.error('env-status error', err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};