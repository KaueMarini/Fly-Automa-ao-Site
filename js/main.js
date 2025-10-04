document.addEventListener('DOMContentLoaded', () => {

    
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    
    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeInElements.forEach(el => observer.observe(el));
    }

    
    
    console.log("Fly Automação: Site v3.0 inicializado com sucesso!");
});
document.addEventListener('DOMContentLoaded', () => {
    // Código original do seu main.js...
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeInElements.forEach(el => observer.observe(el));
    }
    
    console.log("Fly Automação: Site v3.0 inicializado com sucesso!");

    // ------------------- LÓGICA DO BLOG DINÂMICO (VERSÃO ATUALIZADA) -------------------

    // 1. Cole aqui a URL do seu Strapi App
    const STRAPI_URL = "https://remarkable-bear-63ed3d8a30.strapiapp.com";
    
    // 2. Cole aqui o seu Token de API
    const STRAPI_TOKEN = "0c2b6b47dd82bafbb50c3b82f9210dd137cd58e96fe34ee11e4bca2cb168731c20146bd816de427afa12846ee0d3046327e08fa3fb36efdd4c121ed6adf8b31a5e30904f96ba9df275beb519c779d0987714250c075bc1b62cf9d7febd0ad49a1accbdf371db2eb93e93f1020e48a4b3c0c339a048a91a3af46b80f84fb8aeff";

    const fetchOptions = {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    // Lógica para a página principal do blog (blog.html)
    const blogListContainer = document.querySelector('.blog-list-section');
    if (blogListContainer) {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`, fetchOptions);
                if (!response.ok) throw new Error('Falha ao buscar os artigos');
                
                const { data } = await response.json();
                
                blogListContainer.innerHTML = ''; 

                if (!data || data.length === 0) {
                    blogListContainer.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                    return;
                }

                data.forEach(article => {
                    if (!article.attributes) return; // Pula artigos malformados

                    const post = article.attributes;
                    const imageUrl = post.cover?.data?.attributes?.url 
                        ? `${post.cover.data.attributes.url}` // A URL da nuvem já é completa
                        : 'https://images.unsplash.com/photo-1483817101829-339b08e8d83f?q=80&w=1104&auto=format&fit=crop';

                    const postCardHTML = `
                        <a href="post.html?id=${article.id}" class="post-card-full fade-in visible">
                            <div class="post-image-wrapper">
                                <img src="${imageUrl}" alt="Imagem do artigo ${post.title || ''}">
                            </div>
                            <div class="post-content">
                                <span class="post-category">${post.category?.data?.attributes?.name || 'Sem Categoria'}</span>
                                <h3>${post.title || 'Artigo sem Título'}</h3>
                                <p>${post.description || ''}</p>
                                <span class="post-date">${formatDate(post.createdAt)}</span>
                            </div>
                        </a>
                    `;
                    blogListContainer.innerHTML += postCardHTML;
                });

            } catch (error) {
                console.error("Erro ao carregar posts:", error);
                blogListContainer.innerHTML = '<p>Ocorreu um erro ao carregar os artigos. Tente novamente mais tarde.</p>';
            }
        };
        fetchPosts();
    }

    // Lógica para a página de um único post (post.html)
    const postArticleContainer = document.querySelector('.post-article');
    if (postArticleContainer) {
        const fetchSinglePost = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const postId = urlParams.get('id');

                if (!postId) {
                    postArticleContainer.innerHTML = '<h1>Artigo não encontrado.</h1>';
                    return;
                }

                const response = await fetch(`${STRAPI_URL}/api/articles/${postId}?populate[cover]=*&populate[category]=*&populate[blocks][populate]=*`, fetchOptions);
                if (!response.ok) throw new Error('Artigo não encontrado');

                const { data } = await response.json();
                const post = data.attributes;

                document.title = `${post.title || 'Artigo'} | Fly Automação`;

                const imageUrl = post.cover?.data?.attributes?.url
                    ? `${post.cover.data.attributes.url}`
                    : 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop';

                let postBodyHTML = '';
                if (post.blocks && Array.isArray(post.blocks)) {
                    post.blocks.forEach(block => {
                        if (block.__component === 'shared.rich-text' && block.body && window.marked) {
                            postBodyHTML += window.marked.parse(block.body);
                        } else if (block.__component === 'shared.quote' && block.body) {
                            postBodyHTML += `<blockquote><p>${block.body}</p>${block.title ? `<cite>${block.title}</cite>` : ''}</blockquote>`;
                        } else if (block.__component === 'shared.media' && block.file?.data?.attributes?.url) {
                            postBodyHTML += `<img src="${block.file.data.attributes.url}" alt="" style="width:100%; height:auto; border-radius:12px; margin: 2rem 0;">`;
                        }
                    });
                }

                postArticleContainer.innerHTML = `
                    <header class="post-header fade-in visible">
                        <span class="post-category">${post.category?.data?.attributes?.name || 'Sem Categoria'}</span>
                        <h1>${post.title || 'Artigo sem Título'}</h1>
                        <span class="post-date">Publicado em ${formatDate(post.createdAt)}</span>
                    </header>
                    <div class="post-main-image fade-in visible">
                        <img src="${imageUrl}" alt="Imagem principal do artigo">
                    </div>
                    <div class="post-body fade-in visible">
                        ${postBodyHTML}
                    </div>
                `;
            } catch (error) {
                console.error("Erro ao carregar o post:", error);
                postArticleContainer.innerHTML = '<h1>Erro ao carregar o artigo.</h1><p>Não foi possível encontrar o conteúdo solicitado.</p>';
            }
        };
        fetchSinglePost();
    }
});