exports.handler = async function(event, context) {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
    
    // Pega o 'slug' enviado pela URL (ex: /?slug=meu-artigo)
    const postSlug = event.queryStringParameters.slug;

    if (!postSlug) {
        return { statusCode: 400, body: "Slug não fornecido" };
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
        return { statusCode: 500, body: error.toString() };
    }
};