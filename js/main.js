document.addEventListener('DOMContentLoaded', () => {
    // --- ANIMAÇÕES E EFEITOS DO SITE ---
    console.log('Fly Automação: Site v3.0 inicializado com sucesso!');

    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const fadeInElements = document.querySelectorAll('.fade-in');
    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        fadeInElements.forEach((el) => observer.observe(el));
    }

    // --- MENU MOBILE ---
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    // --- CONFIGURAÇÕES DO BACKEND ---

    const STRAPI_URL = "https://mindful-card-cc3832d952.strapiapp.com";
    const STRAPI_TOKEN = "f90c12ae24aef1333c12c7ecff452e12e72cf250962a4cc8b0f8f233c5b14c93abfbd2d81dfe273fedd15889e5c0a3a19734e67ca87fcf8c649f85d3f35038f5d612ff3ff9a2dbe0305b65c0d76c99dbc3499c5742734caef9d1cf412e1baa79a5a2a9ea85253036cb11fe9a8805e2dccb470978b4ce14a0fb7a2bc187f02918";

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

    //Lógica para a secção de blog na homepage (index.html)
    const homeBlogGrid = document.querySelector('.blog-grid');
    if (homeBlogGrid) {
        const fetchHomePosts = async () => {
            try {
                const response = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc&pagination[limit]=3`, fetchOptions);
                if (!response.ok) throw new Error('Falha ao buscar os artigos para a home');
                
                const { data } = await response.json();
                
                homeBlogGrid.innerHTML = ''; 

                if (!data || data.length === 0) return;

                data.forEach(post => {
                    const imageUrl = post.cover?.formats?.small?.url || post.cover?.url || 'https://images.unsplash.com/photo-1544214249-9f342c81e87d?q=80&w=2070&auto=format=fit=crop';
                    
                    const postCardHTML = `
                        <a href="post.html?slug=${post.slug}" class="post-card fade-in visible">
                            <div class="post-image-wrapper">
                                <img src="${imageUrl}" alt="Imagem do artigo ${post.title || ''}">
                            </div>
                            <div class="post-content">
                                <span class="post-category">${post.category?.name || 'Sem Categoria'}</span>
                                <h3>${post.title || 'Artigo sem Título'}</h3>
                                <span class="post-date">${formatDate(post.createdAt)}</span>
                            </div>
                        </a>
                    `;
                    homeBlogGrid.innerHTML += postCardHTML;
                });
            } catch (error) {
                console.error("Erro ao carregar posts da home:", error);
                homeBlogGrid.innerHTML = '<p>Não foi possível carregar os artigos recentes.</p>';
            }
        };
        fetchHomePosts();
    }

    // Lógica para a página principal do blog (blog.html)
    const blogListContainer = document.querySelector('.blog-list-section');
    if (blogListContainer) {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=publishedAt:desc`, fetchOptions);
                if (!response.ok) throw new Error('Falha ao buscar os artigos');
                
                const { data } = await response.json(); 
                
                blogListContainer.innerHTML = ''; 

                if (!data || data.length === 0) {
                    blogListContainer.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                    return;
                }

                data.forEach(post => {
                    const imageUrl = post.cover?.url || 'https://images.unsplash.com/photo-1483817101829-339b08e8d83f?q=80&w=1104&auto=format=fit=crop';

                    const postCardHTML = `
                        <a href="post.html?slug=${post.slug}" class="post-card-full fade-in visible">
                            <div class="post-image-wrapper">
                                <img src="${imageUrl}" alt="Imagem do artigo ${post.title || ''}">
                            </div>
                            <div class="post-content">
                                <span class="post-category">${post.category?.name || 'Sem Categoria'}</span>
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
                const postSlug = urlParams.get('slug');

                if (!postSlug) {
                    postArticleContainer.innerHTML = '<h1>Artigo não encontrado.</h1>';
                    return;
                }

                const response = await fetch(`${STRAPI_URL}/api/articles?filters[slug][$eq]=${postSlug}&populate=*`, fetchOptions);
                if (!response.ok) throw new Error('Artigo não encontrado');

                const { data } = await response.json();
                
                if (!data || data.length === 0) {
                     postArticleContainer.innerHTML = '<h1>Artigo não encontrado.</h1>';
                    return;
                }

                const post = data[0];
                document.title = `${post.title || 'Artigo'} | Fly Automação`;
                const imageUrl = post.cover?.url || 'https://images.unsplash.com/photo-1677756119517-756a/1w=2070&auto=format&fit=crop';

                let postBodyHTML = '';
                if (post.blocks && Array.isArray(post.blocks)) {
                    post.blocks.forEach(block => {
                        if (block.__component === 'shared.rich-text' && block.body && window.marked) {
                            postBodyHTML += window.marked.parse(block.body);
                        }
                    });
                }

                postArticleContainer.innerHTML = `
                    <header class="post-header fade-in visible">
                        <span class="post-category">${post.category?.name || 'Sem Categoria'}</span>
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

    // --- LÓGICA DO MODAL DE WHATSAPP ---
    const fab = document.getElementById('whatsapp-fab');
    const modalOverlay = document.getElementById('whatsapp-modal-overlay');
    const closeModalBtn = document.getElementById('whatsapp-modal-close');
    const form = document.getElementById('whatsapp-form');

    // Função para abrir o modal
    const openModal = (e) => {
        e.preventDefault();
        modalOverlay.classList.add('visible');
    };

    // Função para fechar o modal
    const closeModal = () => {
        modalOverlay.classList.remove('visible');
    };

    // Abrir modal ao clicar no botão flutuante
    if (fab) {
        fab.addEventListener('click', openModal);
    }

    // Fechar modal ao clicar no 'X'
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Fechar modal ao clicar fora da área do modal
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Lidar com o envio do formulário
    if (form) {
        // Aplicar máscara de telefone com iMask.js
        const phoneInput = document.getElementById('whatsapp-phone');
        const phoneMask = IMask(phoneInput, {
            mask: '(00) 00000-0000'
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Pegar os dados do formulário
            const name = document.getElementById('whatsapp-name').value;
            const service = document.getElementById('whatsapp-service').value;
            
            // Número de telefone da sua empresa (apenas números)
            const businessPhone = '5513996901919';
            
            // Montar a mensagem pré-pronta, agora mais limpa
            const message = `Olá! Meu nome é *${name}*, tenho interesse em *${service}*.`;
            
            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Criar a URL do WhatsApp
            const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;
            
            // Abrir o WhatsApp em uma nova aba
            window.open(whatsappUrl, '_blank');
            
            // Opcional: fechar o modal e limpar o formulário após o envio
            closeModal();
            form.reset();
        });
    }
});