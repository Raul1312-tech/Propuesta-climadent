// zoomEffects.js - Implementación de efectos de zoom para gráficos y tarjetas

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargamos dinámicamente GSAP si aún no está cargado
    const loadGSAPIfNeeded = async () => {
        if (window.gsap) {
            initZoomEffects();
            return;
        }
        
        // Cargar GSAP
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js';
        document.head.appendChild(gsapScript);
        
        // Esperar a que GSAP se cargue
        await new Promise(resolve => {
            gsapScript.onload = resolve;
        });
        
        // Iniciar los efectos
        initZoomEffects();
    };
    
    // Función para inicializar los efectos de zoom
    const initZoomEffects = () => {
        // Aplicar efecto de zoom a los elementos con la clase .zoom-effect
        applyZoomToElements('.chart-container', 1.03);
        applyZoomToElements('.service-card', 1.05);
        applyZoomToElements('.package-card', 1.07);
        applyZoomToElements('.star-package', 1.08);
        applyZoomToElements('.why-us-card', 1.1);
        
        // También aplicar a gráficos específicos si es necesario
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            if (!container.classList.contains('zoom-effect')) {
                applyZoomEffect(container, 1.03);
            }
        });
    };
    
    // Aplicar efecto de zoom a un conjunto de elementos
    const applyZoomToElements = (selector, scaleAmount) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            applyZoomEffect(element, scaleAmount);
        });
    };
    
    // Aplicar efecto de zoom a un único elemento
    const applyZoomEffect = (element, scaleAmount) => {
        // Añadimos la clase para el seguimiento
        element.classList.add('zoom-effect');
        
        // Establecemos estilos iniciales
        gsap.set(element, {
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease-out'
        });
        
        // Aplicamos el efecto hover
        element.addEventListener('mouseenter', () => {
            gsap.to(element, {
                scale: scaleAmount,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
            });
            
            // Efecto de elevación con sombra para mejor feedback visual
            gsap.to(element, {
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                y: -5,
                duration: 0.3,
                overwrite: true
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                scale: 1,
                y: 0,
                boxShadow: element.style.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
            });
        });
        
        // Efecto de click para mejorar interactividad
        element.addEventListener('mousedown', () => {
            gsap.to(element, {
                scale: 0.98,
                duration: 0.1,
                ease: 'power1.in',
                overwrite: true
            });
        });
        
        element.addEventListener('mouseup', () => {
            gsap.to(element, {
                scale: scaleAmount,
                duration: 0.2,
                ease: 'power1.out',
                overwrite: true
            });
        });
    };
    
    // Iniciar carga de GSAP y efectos
    loadGSAPIfNeeded();
}); 