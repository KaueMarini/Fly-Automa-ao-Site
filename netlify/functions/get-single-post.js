exports.handler = async function(event, context) {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
    const postSlug = event.queryStringParameters && event.queryStringParameters.slug;

    if (!STRAPI_URL) {
        const msg = 'Environment variable STRAPI_URL is not defined';
        console.error(msg);
        return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }
    if (!STRAPI_TOKEN) {
        const msg = 'Environment variable STRAPI_TOKEN is not defined';
        console.error(msg);
        return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }

    if (!postSlug) {
        return { statusCode: 400, body: JSON.stringify({ error: "Slug não fornecido" }) };
    }

    const API_ENDPOINT = `${STRAPI_URL}/api/articles?filters[slug][$eq]=${postSlug}&populate=*`;

    try {
        const response = await fetch(API_ENDPOINT, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('get-single-post error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
    }
};