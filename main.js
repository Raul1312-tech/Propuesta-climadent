// main.js - Archivo principal que gestiona la carga de scripts y funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar scripts de forma asíncrona
    const loadScript = (src, callback = null) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                if (callback) callback();
                resolve();
            };
            script.onerror = () => reject(`Error cargando el script: ${src}`);
            
            document.head.appendChild(script);
        });
    };
    
    // Configuración global del proyecto
    const settings = {
        // Opciones de optimización
        optimizeForMobile: true,
        lazyLoadImages: true,
        enableAnimations: true,
        
        // Rutas a los scripts
        scripts: {
            scrollEffects: 'scrollEffects.js',
            dockEffect: 'dockEffect.js',
            userInteraction: 'userInteraction.js',
            charts: 'charts.js',
            formHandlers: 'formHandlers.js'
        },
        
        // Estado de la aplicación
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024
    };
    
    // Detectar cambios en el tamaño de la ventana
    window.addEventListener('resize', () => {
        settings.isMobile = window.innerWidth < 768;
        settings.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        settings.isDesktop = window.innerWidth >= 1024;
        
        // Ejecutar funciones específicas cuando cambia el tamaño
        handleResponsiveChanges();
    });
    
    // Función para manejar cambios responsivos
    const handleResponsiveChanges = () => {
        // Actualizar elementos responsivos según el tamaño actual
        document.querySelectorAll('[data-responsive]').forEach(element => {
            const config = JSON.parse(element.dataset.responsive || '{}');
            
            if (settings.isMobile && config.mobile) {
                Object.entries(config.mobile).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
            } else if (settings.isTablet && config.tablet) {
                Object.entries(config.tablet).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
            } else if (settings.isDesktop && config.desktop) {
                Object.entries(config.desktop).forEach(([prop, value]) => {
                    element.style[prop] = value;
                });
            }
        });
        
        // Si tenemos funciones de actualización disponibles, llamarlas
        if (window.updateScrollEffects) window.updateScrollEffects();
        if (window.updateDockEffects) window.updateDockEffects();
    };
    
    // Función para inicializar la carga perezosa (lazy loading) de imágenes
    const initLazyLoading = () => {
        if (!settings.lazyLoadImages) return;
        
        const lazyImages = document.querySelectorAll('img[data-src], video[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const media = entry.target;
                        media.src = media.dataset.src;
                        
                        // Si también hay srcset, cargar
                        if (media.dataset.srcset) {
                            media.srcset = media.dataset.srcset;
                        }
                        
                        media.classList.add('loaded');
                        imageObserver.unobserve(media);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            lazyImages.forEach(media => {
                media.src = media.dataset.src;
                if (media.dataset.srcset) {
                    media.srcset = media.dataset.srcset;
                }
                media.classList.add('loaded');
            });
        }
    };
    
    // Optimizar animaciones para dispositivos con rendimiento limitado
    const optimizeForPerformance = () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let shouldOptimize = settings.isMobile; // Por defecto optimizar en móviles
        
        // Detectar conexiones lentas o modo ahorro de datos
        if (connection) {
            if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                shouldOptimize = true;
            }
        }
        
        // Aplicar optimizaciones
        if (shouldOptimize) {
            document.documentElement.classList.add('reduced-motion');
            settings.enableAnimations = false;
        }
    };
    
    // Inicializar características principales
    const initMainFeatures = async () => {
        try {
            // Primero cargamos interacciones básicas de usuario (mayor prioridad)
            await loadScript(settings.scripts.userInteraction);
            
            // Cargar efectos y animaciones en segundo plano
            if (settings.enableAnimations) {
                loadScript(settings.scripts.scrollEffects);
                loadScript(settings.scripts.dockEffect);
            }
            
            // Inicializar lazy loading
            initLazyLoading();
            
            // Inicializar optimizaciones
            if (settings.optimizeForMobile) {
                optimizeForPerformance();
            }
            
            // Inicializar gestores de formularios si hay formularios en la página
            if (document.querySelector('form')) {
                loadScript(settings.scripts.formHandlers);
            }
            
            // Inicializar gráficos solo si hay contenedores de gráficos
            if (document.querySelector('.chart-container, .graph-container')) {
                loadScript(settings.scripts.charts);
            }
            
            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
        }
    };
    
    // Exponer utilidades y configuración globalmente
    window.climadentApp = {
        settings,
        loadScript,
        handleResponsiveChanges,
        refreshUI: function() {
            // Función para actualizar la UI tras cambios dinámicos
            if (window.userInteraction) window.userInteraction.reinitAll();
            if (window.updateScrollEffects) window.updateScrollEffects();
            initLazyLoading(); // Re-iniciar lazy loading para nuevas imágenes
        }
    };
    
    // Iniciar la aplicación
    initMainFeatures();
}); 