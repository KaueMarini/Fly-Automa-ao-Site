exports.handler = async function(event, context) {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
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
        return { statusCode: 500, body: error.toString() };
    }
};