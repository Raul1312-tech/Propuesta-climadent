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