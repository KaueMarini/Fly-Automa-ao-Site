// js/main.js (VERSÃO 3.0 - FOCO PROFISSIONAL)

document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDADE 1: HEADER "STICKY" ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- FUNCIONALIDADE 2: ANIMAÇÃO DE SCROLL (FADE-IN) ---
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

    // Efeitos interativos de mouse foram removidos para um design mais clean.
    
    console.log("Fly Automação: Site v3.0 inicializado com sucesso!");
});