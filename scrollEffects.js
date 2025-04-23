// scrollEffects.js - Implementación de efectos de scroll con GSAP

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargamos dinámicamente GSAP y ScrollTrigger
    const loadGSAP = async () => {
        // Cargar GSAP
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js';
        document.head.appendChild(gsapScript);
        
        // Esperar a que GSAP se cargue
        await new Promise(resolve => {
            gsapScript.onload = resolve;
        });
        
        // Cargar ScrollTrigger
        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js';
        document.head.appendChild(scrollTriggerScript);
        
        // Esperar a que ScrollTrigger se cargue e inicializar
        await new Promise(resolve => {
            scrollTriggerScript.onload = () => {
                gsap.registerPlugin(ScrollTrigger);
                resolve();
            };
        });
        
        // Iniciar las animaciones
        initScrollAnimations();
    };
    
    // Función para inicializar todas las animaciones de scroll
    const initScrollAnimations = () => {
        // Aplicar efecto a los elementos con la clase .scroll-float
        const scrollElements = document.querySelectorAll('.scroll-float');
        
        scrollElements.forEach(container => {
            // Obtener parámetros de animación desde atributos data-*
            const duration = parseFloat(container.dataset.duration || 1);
            const ease = container.dataset.ease || 'back.inOut(2)';
            const scrollStart = container.dataset.start || 'center bottom+=50%';
            const scrollEnd = container.dataset.end || 'bottom bottom-=40%';
            const stagger = parseFloat(container.dataset.stagger || 0.03);
            
            // Obtener elementos hijos directos para animar
            const elements = Array.from(container.children);
            
            // Crear la animación con GSAP
            gsap.fromTo(
                elements,
                { 
                    y: 30, 
                    opacity: 0,
                    // Desactivar cualquier transición CSS
                    transition: 'none'
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: duration,
                    ease: ease,
                    stagger: stagger,
                    scrollTrigger: {
                        trigger: container,
                        start: scrollStart,
                        end: scrollEnd,
                        toggleActions: 'play none none reverse',
                        // Para depuración: descomentar la siguiente línea
                        // markers: true
                    }
                }
            );
        });
        
        // También podemos aplicar animaciones específicas a diferentes tipos de elementos
        animateServiceCards();
        animatePackageCards();
        animateWhyUsCards();
    };
    
    // Animación para las tarjetas de servicios
    const animateServiceCards = () => {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            gsap.fromTo(
                card,
                { 
                    y: 50, 
                    opacity: 0 
                },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom-=10%',
                        end: 'center center',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    };
    
    // Animación para los paquetes
    const animatePackageCards = () => {
        const packageCards = document.querySelectorAll('.package-card, .star-package');
        
        gsap.fromTo(
            packageCards,
            { 
                scale: 0.95, 
                opacity: 0 
            },
            { 
                scale: 1, 
                opacity: 1, 
                duration: 0.7,
                stagger: 0.1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: packageCards[0].parentElement,
                    start: 'top bottom-=20%',
                    end: 'bottom center',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    };
    
    // Animación para las tarjetas de "Por qué elegirnos"
    const animateWhyUsCards = () => {
        const whyUsCards = document.querySelectorAll('.why-us-card');
        
        gsap.fromTo(
            whyUsCards,
            { 
                y: 40, 
                opacity: 0 
            },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.6,
                stagger: 0.1,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: whyUsCards[0].parentElement,
                    start: 'top bottom-=10%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    };
    
    // Iniciar la carga de GSAP
    loadGSAP();
});

// scrollEffects.js - Gestiona los efectos y animaciones durante el scroll
document.addEventListener('DOMContentLoaded', function() {
    // Observador de intersecciones para elementos que se animan al entrar en la pantalla
    const createScrollObserver = () => {
        // Excluir gráficos y elementos que ya tienen otros efectos
        const animateElements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in, .rotate-in');
        
        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% del elemento debe ser visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // No aplicar efectos de scroll a los gráficos o elementos con la clase graph-container
                if (entry.target.classList.contains('graph-container')) {
                    return;
                }
                
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Si el elemento tiene la clase 'once', dejar de observarlo
                    if (entry.target.classList.contains('once')) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    // Si no tiene la clase 'once', quitar la clase 'animate' cuando salga de la vista
                    if (!entry.target.classList.contains('once')) {
                        entry.target.classList.remove('animate');
                    }
                }
            });
        }, options);
        
        // Observar cada elemento, excluyendo gráficos
        animateElements.forEach(el => {
            // No observar elementos que son gráficos o tienen la clase graph-container
            if (el.classList.contains('graph-container') || 
                el.closest('.graph-container') || 
                el.closest('canvas')) {
                return;
            }
            
            observer.observe(el);
            
            // Aplicar clases de animación por defecto si no tiene ninguna
            if (!el.classList.contains('fade-in') && 
                !el.classList.contains('slide-in') && 
                !el.classList.contains('zoom-in') && 
                !el.classList.contains('rotate-in')) {
                el.classList.add('fade-in');
            }
        });
        
        return observer;
    };
    
    // Crear efecto de paralaje para elementos con la clase 'parallax'
    const initParallaxEffect = () => {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        // Aplicar efecto de parallax durante el scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallaxSpeed || 0.5;
                const offset = scrollTop * speed;
                element.style.transform = `translateY(${offset}px)`;
            });
        });
    };
    
    // Crear efecto de scroll suave para los enlaces internos
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
        });
    };
    
    // Detectar la dirección del scroll y aplicar efectos en consecuencia
    const initScrollDirectionDetection = () => {
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scroll hacia abajo
                header.classList.add('header-hidden');
            } else {
                // Scroll hacia arriba
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    };
    
    // Inicializar todos los efectos de scroll
    const observer = createScrollObserver();
    initParallaxEffect();
    initSmoothScroll();
    initScrollDirectionDetection();
    
    // Función para actualizar los efectos cuando se agreguen nuevos elementos
    window.updateScrollEffects = function() {
        observer.disconnect();
        createScrollObserver();
    };
    
    // Agregar más estilos de animación para elementos específicos
    const addScrollStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Animaciones básicas */
            .fade-in {
                opacity: 0;
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .slide-in {
                opacity: 0;
                transform: translateY(50px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .zoom-in {
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            .rotate-in {
                opacity: 0;
                transform: rotate(-5deg) scale(0.9);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            
            /* Clases aplicadas cuando el elemento está visible */
            .fade-in.animate, .slide-in.animate, .zoom-in.animate, .rotate-in.animate {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0);
            }
            
            /* Efecto para secciones que aparecen con delay */
            [data-animation-delay] {
                transition-delay: attr(data-animation-delay ms);
            }
            
            /* Estilo para header que se oculta/muestra con scroll */
            .header-hidden {
                transform: translateY(-100%);
                transition: transform 0.3s ease-out;
            }
            
            header {
                transition: transform 0.3s ease-out;
            }
        `;
        
        document.head.appendChild(styleElement);
    };
    
    // Agregar estilos CSS para las animaciones
    addScrollStyles();
}); 