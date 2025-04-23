// dockEffect.js - Implementa un efecto tipo Dock de macOS para elementos interactivos
document.addEventListener('DOMContentLoaded', function() {
    // Primero, asegurar que los servicios estén visibles
    makeServicesVisible();
    
    const initDockEffect = (selector = '.dock-item', options = {}) => {
        // Opciones por defecto
        const defaultOptions = {
            maxScale: 1.5,            // Escala máxima al hacer hover
            neighborScale: 1.2,       // Escala para elementos vecinos
            scaleRange: 150,          // Rango en píxeles para aplicar el efecto
            transitionDuration: 0.2,  // Duración de la transición en segundos
            easing: 'ease-out'        // Función de suavizado
        };
        
        // Combinar opciones por defecto con las proporcionadas
        const settings = {...defaultOptions, ...options};
        
        // Seleccionar todos los elementos dock SOLO los que son gráficos
        const dockItems = Array.from(document.querySelectorAll(selector)).filter(item => {
            // Aplicar efecto solo a gráficos, no a tarjetas de servicios u otros elementos importantes
            return item.classList.contains('graph-container') || 
                  item.classList.contains('chart-container') ||
                  item.closest('canvas') !== null;
        });
        
        if (dockItems.length === 0) return;
        
        // Preparar los elementos
        dockItems.forEach(item => {
            // Asegurarse de que el elemento tenga posición relativa para el efecto
            if (getComputedStyle(item).position === 'static') {
                item.style.position = 'relative';
            }
            
            // Aplicar la transición para suavizar el efecto
            item.style.transition = `transform ${settings.transitionDuration}s ${settings.easing}`;
            
            // Restablecer el transform al inicio
            item.style.transform = 'scale(1)';
        });
        
        // Aplicar el efecto a cada elemento individualmente, sin depender de un contenedor común
        dockItems.forEach(container => {
            // Evento para aplicar el efecto
            container.addEventListener('mousemove', (e) => {
                // Verificar si el usuario está utilizando el móvil y salir
                if (window.matchMedia('(max-width: 768px)').matches) return;
                
                // Obtener la posición del elemento
                const rect = container.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const itemCenterY = rect.top + rect.height / 2;
                
                // Calcular la distancia entre el cursor y el centro del elemento
                const distanceX = e.clientX - itemCenterX;
                const distanceY = e.clientY - itemCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                // Si el cursor está dentro del rango de escala
                if (distance < settings.scaleRange) {
                    // Calcular la escala basada en la distancia (más cerca = más grande)
                    const scale = 1 + (settings.maxScale - 1) * (1 - distance / settings.scaleRange);
                    container.style.transform = `scale(${scale})`;
                    container.style.zIndex = "10";
                } else {
                    container.style.transform = 'scale(1)';
                    container.style.zIndex = "1";
                }
            });
            
            // Restablecer cuando el cursor sale del elemento
            container.addEventListener('mouseleave', () => {
                container.style.transform = 'scale(1)';
                container.style.zIndex = "1";
            });
        });
    };
    
    // Hacer los servicios visibles
    function makeServicesVisible() {
        // Seleccionar elementos importantes que NO deben tener efecto dock
        const importantElements = document.querySelectorAll('.service-card, .package-card, .star-package, .why-us-card, h2, h3, h4');
        
        // Asegurarse de que sean visibles
        importantElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
            el.style.setProperty('opacity', '1', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.style.setProperty('transform', 'none', 'important');
        });
        
        // Título de Servicios Estrella (solución específica)
        const serviciosEstrellaTitle = document.querySelector('h2.text-2xl.md\\:text-3xl.font-semibold.text-gray-800.mb-6.text-center.scroll-float');
        if (serviciosEstrellaTitle) {
            serviciosEstrellaTitle.innerHTML = "Nuestros Servicios Estrella";
            serviciosEstrellaTitle.style.setProperty('opacity', '1', 'important');
            serviciosEstrellaTitle.style.setProperty('visibility', 'visible', 'important');
            serviciosEstrellaTitle.style.setProperty('transform', 'none', 'important');
            serviciosEstrellaTitle.style.setProperty('display', 'block', 'important');
        }
    }
    
    // Aplicar el efecto a todos los contenedores de gráficos
    initDockEffect('.graph-container');
    
    // También aplicar específicamente al gráfico de escenarios de facturación usando su id
    const revenueChart = document.getElementById('revenue-chart-container');
    if (revenueChart) {
        // Añadir estilos adicionales para asegurar que el efecto funciona correctamente
        revenueChart.style.transformOrigin = 'center center';
        revenueChart.style.transition = 'transform 0.2s ease-out';
        revenueChart.style.willChange = 'transform, z-index';
        
        // Aplicar un efecto ligeramente más pronunciado a este gráfico específico
        const enhancedSettings = {
            maxScale: 1.6,            // Un poco más de escala para este gráfico
            scaleRange: 180,          // Mayor rango de activación
            transitionDuration: 0.25  // Transición ligeramente más lenta para mejor efecto
        };
        
        // Inicializar con configuración mejorada
        initDockEffect('#revenue-chart-container', enhancedSettings);
    }
    
    // Hacer disponible la función globalmente para inicializar en elementos adicionales
    window.initDockEffect = initDockEffect;
    
    // Función para actualizar los efectos dock cuando se redimensiona la ventana
    window.updateDockEffects = function() {
        // Reaccionar a los cambios de tamaño
        initDockEffect('.graph-container');
        
        // Asegurar que los servicios permanezcan visibles
        makeServicesVisible();
    };
    
    // Función para añadir efecto flecha cuando el efecto dock está activo
    const initDockArrows = (selector = '.dock-item') => {
        const dockItems = document.querySelectorAll(selector);
        
        dockItems.forEach(item => {
            // Crear elemento de flecha
            const arrow = document.createElement('div');
            arrow.classList.add('dock-arrow');
            arrow.style.cssText = `
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%) scale(0);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid #ffffff;
                opacity: 0;
                transition: transform 0.2s ease, opacity 0.2s ease;
            `;
            
            // Añadir flecha al elemento
            item.appendChild(arrow);
            
            // Mostrar flecha al hacer hover
            item.addEventListener('mouseenter', () => {
                arrow.style.transform = 'translateX(-50%) scale(1)';
                arrow.style.opacity = '1';
            });
            
            // Ocultar flecha al quitar hover
            item.addEventListener('mouseleave', () => {
                arrow.style.transform = 'translateX(-50%) scale(0)';
                arrow.style.opacity = '0';
            });
        });
    };
    
    // Inicializar flechas en elementos dock (opcional)
    // initDockArrows();
    
    // Hacer disponible la función de flechas globalmente
    window.initDockArrows = initDockArrows;
    
    // Aplicar reflejo debajo de elementos dock (efecto macOS)
    const initDockReflection = (selector = '.dock-item') => {
        const dockItems = document.querySelectorAll(selector);
        
        dockItems.forEach(item => {
            // Crear elemento de reflejo
            const reflection = document.createElement('div');
            reflection.classList.add('dock-reflection');
            
            // Estilo básico del reflejo
            reflection.style.cssText = `
                position: absolute;
                bottom: -20px;
                left: 0;
                width: 100%;
                height: 15px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
                transform: scaleY(-1);
                opacity: 0.3;
                filter: blur(1px);
                border-radius: 50%;
                pointer-events: none;
                transition: opacity 0.2s ease;
            `;
            
            // Añadir reflejo al elemento
            item.appendChild(reflection);
            
            // Intensificar reflejo al hacer hover
            item.addEventListener('mouseenter', () => {
                reflection.style.opacity = '0.5';
            });
            
            // Restablecer reflejo al quitar hover
            item.addEventListener('mouseleave', () => {
                reflection.style.opacity = '0.3';
            });
        });
    };
    
    // Inicializar reflejos en elementos dock (opcional)
    // initDockReflection();
    
    // Hacer disponible la función de reflejos globalmente
    window.initDockReflection = initDockReflection;
    
    // Añadir listener para el evento window load
    window.addEventListener('load', function() {
        // Asegurar que todos los gráficos tienen el efecto dock aplicado
        setTimeout(() => {
            initDockEffect('.graph-container');
            makeServicesVisible();
        }, 500);
    });
}); 