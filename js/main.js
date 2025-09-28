// js/main.js

// Executa o código apenas quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADE 1: HEADER "STICKY" COM EFEITO ---
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        // Adiciona a classe 'scrolled' se o scroll passar de 50px, senão remove
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- FUNCIONALIDADE 2: ANIMAÇÃO DE SCROLL (FADE-IN) ---
    // Usando a API Intersection Observer para performance máxima
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // observa em relação ao viewport
        rootMargin: '0px',
        threshold: 0.1 // aciona quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento está visível
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Deixa de observar o elemento após a animação para economizar recursos
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa cada elemento com a classe .fade-in
    fadeInElements.forEach(el => {
        observer.observe(el);
    });
    

    // --- FUNCIONALIDADE 3: ANIMAÇÃO DE FUNDO (PLEXUS EFFECT) ---
    // Esta é uma implementação conceitual e simplificada.
    // Para um efeito completo, bibliotecas como 'particles.js' são recomendadas,
    // mas entender a lógica é o pensamento do especialista.
    const canvas = document.getElementById('plexus-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Classe para criar cada partícula
    class Particle {
        // ... (lógica complexa para criar, mover e desenhar partículas)
    }

    // Função para inicializar as partículas
    function init() {
        // ... (cria um array de partículas com posições e velocidades aleatórias)
    }

    // Função para conectar partículas que estão próximas
    function connect() {
        // ... (percorre o array, calcula a distância entre as partículas e desenha uma linha se estiverem perto o suficiente)
    }

    // Loop de animação
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // ... (atualiza a posição de cada partícula e chama a função connect())
    }

    // init();
    // animate();
    
    // Recalcula o tamanho do canvas se a janela for redimensionada
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // init();
    });

    console.log("Fly Automação site inicializado com sucesso!");

});