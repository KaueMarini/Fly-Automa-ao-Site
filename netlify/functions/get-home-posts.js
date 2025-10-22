exports.handler = async function(event, context) {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

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

    const API_ENDPOINT = `${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[limit]=3`;

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
        console.error('get-home-posts error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message, stack: error.stack }) };
    }
};