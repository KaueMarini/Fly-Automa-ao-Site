document.addEventListener('DOMContentLoaded', () => {
    
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

    
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    

    // Atenção: chaves e URLs sensíveis foram removidas do frontend.
    // As requisições agora apontam para Netlify Functions em /.netlify/functions/*

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    
    const homeBlogGrid = document.querySelector('.blog-grid');
    if (homeBlogGrid) {
        const fetchHomePosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/get-home-posts');
                if (!response.ok) throw new Error('Falha ao buscar os artigos para a home');
                const payload = await response.json();
                // payload pode ser um objeto com { data: [...] } ou já o array dependendo da função
                const data = payload.data || payload;
                
                homeBlogGrid.innerHTML = ''; 
                if (!data || data.length === 0) {
                    homeBlogGrid.innerHTML = '<p>Nenhum artigo recente encontrado.</p>';
                    return;
                }

                data.forEach(item => {
                    const post = item.attributes ? item.attributes : item;
                    // ajustar caminho da imagem caso venha com data.attributes
                    const cover = post.cover?.data?.attributes || post.cover;
                    const imageUrl = (cover && (cover.formats?.small?.url || cover.url)) || 'https://images.unsplash.com/photo-1544214249-9f342c81e87d?q=80&w=2070&auto=format=fit=crop';
                    const postSlug = post.slug || post.slug;

                    const postCardHTML = `
                        <a href="post.html?slug=${postSlug}" class="post-card fade-in visible">
                            <div class="post-image-wrapper">
                                <img src="${imageUrl.startsWith('http') ? imageUrl : imageUrl}" alt="Imagem do artigo ${post.title || ''}">
                            </div>
                            <div class="post-content">
                                <span class="post-category">${post.category?.data?.attributes?.name || post.category?.name || 'Sem Categoria'}</span>
                                <h3>${post.title || 'Artigo sem Título'}</h3>
                                <span class="post-date">${formatDate(post.createdAt || post.publishedAt)}</span>
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

    
    const blogListContainer = document.querySelector('.blog-list-section');
    if (blogListContainer) {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/get-all-posts');
                if (!response.ok) throw new Error('Falha ao buscar os artigos');

                const payload = await response.json();
                const data = payload.data || payload;

                blogListContainer.innerHTML = ''; 

                if (!data || data.length === 0) {
                    blogListContainer.innerHTML = '<p>Nenhum artigo encontrado.</p>';
                    return;
                }

                data.forEach(item => {
                    const post = item.attributes ? item.attributes : item;
                    const cover = post.cover?.data?.attributes || post.cover;
                    const imageUrl = (cover && (cover.formats?.small?.url || cover.url)) || 'https://images.unsplash.com/photo-1483817101829-339b08e8d83f?q=80&w=1104&auto=format=fit=crop';

                    const postCardHTML = `
                        <a href="post.html?slug=${post.slug}" class="post-card-full fade-in visible">
                            <div class="post-image-wrapper">
                                <img src="${imageUrl}" alt="Imagem do artigo ${post.title || ''}">
                            </div>
                            <div class="post-content">
                                <span class="post-category">${post.category?.data?.attributes?.name || post.category?.name || 'Sem Categoria'}</span>
                                <h3>${post.title || 'Artigo sem Título'}</h3>
                                <p>${post.description || ''}</p>
                                <span class="post-date">${formatDate(post.createdAt || post.publishedAt)}</span>
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

                const response = await fetch(`/.netlify/functions/get-single-post?slug=${encodeURIComponent(postSlug)}`);
                if (!response.ok) throw new Error('Artigo não encontrado');

                const payload = await response.json();
                const data = payload.data || payload;

                if (!data || data.length === 0) {
                     postArticleContainer.innerHTML = '<h1>Artigo não encontrado.</h1>';
                    return;
                }

                const post = data[0].attributes ? data[0].attributes : data[0];
                document.title = `${post.title || 'Artigo'} | Fly Automação`;
                const cover = post.cover?.data?.attributes || post.cover;
                const imageUrl = (cover && (cover.url || cover.formats?.large?.url)) || 'https://images.unsplash.com/photo-1677756119517-756a/1w=2070&auto=format&fit=crop';

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

    
    const fab = document.getElementById('whatsapp-fab');
    const modalOverlay = document.getElementById('whatsapp-modal-overlay');
    const closeModalBtn = document.getElementById('whatsapp-modal-close');
    const form = document.getElementById('whatsapp-form');

    
    const openModal = (e) => {
        e.preventDefault();
        modalOverlay.classList.add('visible');
    };

    
    const closeModal = () => {
        modalOverlay.classList.remove('visible');
    };

    
    if (fab) {
        fab.addEventListener('click', openModal);
    }

   
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    
    if (form) {
        
        const phoneInput = document.getElementById('whatsapp-phone');
        const phoneMask = IMask(phoneInput, {
            mask: '(00) 00000-0000'
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            
            const name = document.getElementById('whatsapp-name').value;
            const service = document.getElementById('whatsapp-service').value;
            
            
            const businessPhone = '5513996901919';
            
            
            const message = `Olá! Meu nome é *${name}*, tenho interesse em *${service}*.`;
            
            
            const encodedMessage = encodeURIComponent(message);
            
            
            const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;
            
            
            window.open(whatsappUrl, '_blank');
            
            
            closeModal();
            form.reset();
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            
        // N8N webhook removido do frontend — agora usamos a Netlify Function /submit-form

            const form = e.target;
            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const buttonTextOriginal = button.textContent;

            
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            
            button.disabled = true;
            button.textContent = "Enviando...";

            try {
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Falha no envio');
                }

                window.location.href = '/obrigado.html';

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
                
                button.disabled = false;
                button.textContent = buttonTextOriginal;
            }
        });
    }
});