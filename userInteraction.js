// userInteraction.js - Gestiona las interacciones del usuario con la interfaz
document.addEventListener('DOMContentLoaded', function() {
    // =========== Navegación y Menú Móvil ===========
    const initMobileMenu = () => {
        const menuButton = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const closeButton = document.querySelector('.close-menu');
        const menuLinks = document.querySelectorAll('.mobile-menu a');
        
        if (!menuButton || !mobileMenu) return;
        
        // Función para abrir/cerrar el menú
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                // Animar cierre
                mobileMenu.style.transform = 'translateX(100%)';
            } else {
                mobileMenu.classList.add('active');
                document.body.classList.add('menu-open');
                // Animar apertura
                mobileMenu.style.transform = 'translateX(0)';
            }
        };
        
        // Event listeners
        menuButton.addEventListener('click', toggleMenu);
        if (closeButton) closeButton.addEventListener('click', toggleMenu);
        
        // Cerrar el menú al hacer clic en un enlace
        menuLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
        
        // Cerrar el menú al presionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    };
    
    // =========== Tabs y Pestañas ===========
    const initTabs = () => {
        const tabContainers = document.querySelectorAll('.tabs-container');
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.tab');
            const tabContents = container.querySelectorAll('.tab-content');
            
            if (tabs.length === 0 || tabContents.length === 0) return;
            
            // Activar la primera pestaña por defecto si ninguna está activa
            if (!container.querySelector('.tab.active')) {
                tabs[0].classList.add('active');
                tabContents[0].classList.add('active');
            }
            
            // Gestionar clics en pestañas
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Desactivar todas las pestañas y contenidos
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Activar la pestaña y contenido seleccionados
                    tab.classList.add('active');
                    tabContents[index].classList.add('active');
                    
                    // Animar la transición del contenido
                    tabContents[index].style.opacity = '0';
                    tabContents[index].style.transform = 'translateY(10px)';
                    
                    // Animar entrada
                    setTimeout(() => {
                        tabContents[index].style.opacity = '1';
                        tabContents[index].style.transform = 'translateY(0)';
                    }, 50);
                });
            });
        });
    };
    
    // =========== Modals y Popups ===========
    const initModals = () => {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.modal-close');
        
        // Abrir modal
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                    
                    // Animar apertura
                    modal.style.opacity = '0';
                    modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        modal.style.opacity = '1';
                        modal.querySelector('.modal-content').style.transform = 'scale(1)';
                    }, 10);
                }
            });
        });
        
        // Cerrar modal con botón
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });
        
        // Cerrar modal al hacer clic fuera
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        });
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    closeModal(activeModal);
                }
            }
        });
        
        // Función para cerrar modal con animación
        const closeModal = (modal) => {
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }, 300);
        };
    };
    
    // =========== Acordeones ===========
    const initAccordions = () => {
        const accordions = document.querySelectorAll('.accordion');
        
        accordions.forEach(accordion => {
            const headers = accordion.querySelectorAll('.accordion-header');
            
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.parentElement;
                    const content = header.nextElementSibling;
                    const isOpen = item.classList.contains('active');
                    
                    // Si la configuración permite solo un item abierto
                    if (accordion.dataset.singleOpen) {
                        // Cerrar todos los demás items
                        accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                                otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                            }
                        });
                    }
                    
                    // Alternar el estado del item actual
                    if (isOpen) {
                        item.classList.remove('active');
                        content.style.maxHeight = '0';
                    } else {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            });
            
            // Abrir el primer elemento por defecto si data-open-first está presente
            if (accordion.dataset.openFirst) {
                const firstItem = accordion.querySelector('.accordion-item');
                if (firstItem) {
                    firstItem.classList.add('active');
                    firstItem.querySelector('.accordion-content').style.maxHeight = 
                        firstItem.querySelector('.accordion-content').scrollHeight + 'px';
                }
            }
        });
    };
    
    // =========== Dropdown Menus ===========
    const initDropdowns = () => {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!trigger || !menu) return;
            
            // Alternar menú desplegable
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Cerrar todos los demás dropdowns
                document.querySelectorAll('.dropdown.active').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Alternar estado
                dropdown.classList.toggle('active');
                
                // Animar apertura/cierre
                if (dropdown.classList.contains('active')) {
                    menu.style.opacity = '0';
                    menu.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        menu.style.opacity = '1';
                        menu.style.transform = 'translateY(0)';
                    }, 10);
                }
            });
        });
        
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    };
    
    // =========== Cambio de temas (claro/oscuro) ===========
    const initThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        // Comprobar preferencia guardada o preferencias del sistema
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Establecer tema inicial
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark-theme');
            themeToggle.classList.add('active');
        }
        
        // Alternar tema
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-theme');
            themeToggle.classList.toggle('active');
            
            // Guardar preferencia
            const isDark = document.documentElement.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    };
    
    // =========== Formularios interactivos ===========
    const initForms = () => {
        // Animar etiquetas de campos cuando están en foco o tienen contenido
        const formFields = document.querySelectorAll('.form-field');
        
        formFields.forEach(field => {
            const input = field.querySelector('input, textarea, select');
            const label = field.querySelector('label');
            
            if (!input || !label) return;
            
            // Comprobar si el campo ya tiene valor al cargar
            if (input.value !== '') {
                label.classList.add('active');
            }
            
            // Al obtener el foco
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            // Al perder el foco
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    label.classList.remove('active');
                }
            });
        });
        
        // Validación de formularios
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                let valid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    // Eliminar mensajes de error anteriores
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    
                    field.classList.remove('error');
                    
                    // Validar campo
                    if (!field.value.trim()) {
                        valid = false;
                        field.classList.add('error');
                        
                        // Mostrar mensaje de error
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Este campo es obligatorio';
                        field.parentElement.appendChild(errorMessage);
                    }
                    
                    // Validación de correo electrónico
                    if (field.type === 'email' && field.value.trim() !== '') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(field.value)) {
                            valid = false;
                            field.classList.add('error');
                            
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'Por favor, introduce un correo electrónico válido';
                            field.parentElement.appendChild(errorMessage);
                        }
                    }
                });
                
                if (!valid) {
                    e.preventDefault();
                    
                    // Scroll al primer error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                        firstError.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            });
        });
    };
    
    // =========== Inicializar todas las funcionalidades ===========
    const initInteractions = () => {
        initMobileMenu();
        initTabs();
        initModals();
        initAccordions();
        initDropdowns();
        initThemeToggle();
        initForms();
        
        // Agregar funciones adicionales según sea necesario
    };
    
    // Ejecutar inicialización
    initInteractions();
    
    // Exponer funciones para uso global
    window.userInteraction = {
        initTabs,
        initModals,
        initAccordions,
        initDropdowns,
        initForms,
        reinitAll: initInteractions
    };
}); 