// masonryLayout.js - Implementación de layout tipo Masonry para elementos

document.addEventListener('DOMContentLoaded', () => {
    // Cargamos dinámicamente GSAP si aún no está cargado
    const loadGSAPIfNeeded = async () => {
        if (window.gsap) {
            initMasonryLayout();
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
        
        // Iniciar el layout
        initMasonryLayout();
    };
    
    // Función para inicializar el layout de tipo masonry
    const initMasonryLayout = () => {
        // Para los paquetes de servicios
        applyMasonryLayout('.grid.md\\:grid-cols-2', 2);
        
        // Para las tarjetas de "Por qué elegirnos"
        applyMasonryLayout('.grid.md\\:grid-cols-3', 3);
        
        // Para los gráficos en la sección de servicios
        applyMasonryLayout('.grid.grid-cols-1.md\\:grid-cols-2', 2);
        
        // Escuchar cambios de tamaño de ventana para reajustar
        window.addEventListener('resize', debounce(() => {
            applyMasonryLayout('.grid.md\\:grid-cols-2', 2);
            applyMasonryLayout('.grid.md\\:grid-cols-3', 3);
            applyMasonryLayout('.grid.grid-cols-1.md\\:grid-cols-2', 2);
        }, 250));
    };
    
    // Aplicar layout tipo masonry a un conjunto de elementos
    const applyMasonryLayout = (containerSelector, columnsDesktop) => {
        const containers = document.querySelectorAll(containerSelector);
        
        containers.forEach(container => {
            const items = Array.from(container.children);
            
            // No aplicar masonry si hay menos de 3 elementos
            if (items.length < 3) return;
            
            // Determinar número de columnas basado en tamaño de pantalla
            const columns = window.innerWidth < 768 ? 1 : columnsDesktop;
            
            // Si solo hay una columna en móvil, no aplicamos masonry
            if (columns === 1) {
                resetItemStyles(items);
                return;
            }
            
            // Obtener la anchura del contenedor y calcular anchura por columna
            const containerWidth = container.offsetWidth;
            const columnWidth = containerWidth / columns;
            
            // Array para rastrear la altura de cada columna
            const columnHeights = Array(columns).fill(0);
            
            // Posicionar cada elemento
            items.forEach((item, index) => {
                // Asegurarnos de que el elemento es visible para poder medir su altura
                gsap.set(item, { visibility: 'visible', opacity: 1 });
                
                // Medir la altura natural del elemento
                const itemHeight = item.offsetHeight;
                
                // Encontrar la columna con menor altura
                const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
                
                // Calcular posición X (columna) e Y (altura acumulada)
                const xPos = minHeightIndex * columnWidth;
                const yPos = columnHeights[minHeightIndex];
                
                // Animar el elemento a su posición
                gsap.to(item, {
                    x: xPos,
                    y: yPos,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: true
                });
                
                // Actualizar la altura de la columna
                columnHeights[minHeightIndex] += itemHeight + 20; // 20px de margen
            });
            
            // Actualizar la altura del contenedor
            gsap.to(container, {
                height: Math.max(...columnHeights),
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        });
    };
    
    // Restablecer estilos de los elementos
    const resetItemStyles = (items) => {
        items.forEach(item => {
            gsap.to(item, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
            });
        });
    };
    
    // Función debounce para evitar múltiples llamadas en eventos como resize
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // Iniciar carga de GSAP y layout
    loadGSAPIfNeeded();
}); 