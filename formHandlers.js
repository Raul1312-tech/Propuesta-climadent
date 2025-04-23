// formHandlers.js - Gestión de formularios, validación y envío
document.addEventListener('DOMContentLoaded', function() {
    // =========== Configuración ===========
    const config = {
        // Mensajes de error
        errorMessages: {
            required: 'Este campo es obligatorio',
            email: 'Por favor, introduce un correo electrónico válido',
            phone: 'Por favor, introduce un número de teléfono válido',
            minLength: 'Por favor, introduce al menos {min} caracteres',
            maxLength: 'No puedes introducir más de {max} caracteres',
            pattern: 'El formato no es válido',
            match: 'Los campos no coinciden',
            number: 'Por favor, introduce un número válido',
            url: 'Por favor, introduce una URL válida'
        },
        
        // Patrones de validación
        patterns: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^(\+?[0-9]{9,15})$/,
            url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
            numeric: /^[0-9]+$/,
            alphabetic: /^[a-zA-Z\s]+$/,
            alphanumeric: /^[a-zA-Z0-9\s]+$/
        },
        
        // URLs de envío de formularios
        endpoints: {
            contact: 'https://api.climadent.com/contact',
            newsletter: 'https://api.climadent.com/newsletter',
            appointment: 'https://api.climadent.com/appointment'
        },
        
        // Si es true, no se enviará realmente, solo simulará
        isDevelopment: true
    };
    
    // =========== Validación de Formularios ===========
    const validateField = (field) => {
        // Eliminar mensajes de error previos
        removeErrorMessages(field);
        
        let isValid = true;
        let errorMessage = '';
        
        // Validar requerido
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = config.errorMessages.required;
        } 
        // Validar correo electrónico
        else if (field.type === 'email' && field.value.trim() && !config.patterns.email.test(field.value)) {
            isValid = false;
            errorMessage = config.errorMessages.email;
        }
        // Validar teléfono
        else if (field.dataset.validate === 'phone' && field.value.trim() && !config.patterns.phone.test(field.value)) {
            isValid = false;
            errorMessage = config.errorMessages.phone;
        }
        // Validar URL
        else if (field.dataset.validate === 'url' && field.value.trim() && !config.patterns.url.test(field.value)) {
            isValid = false;
            errorMessage = config.errorMessages.url;
        }
        // Validar longitud mínima
        else if (field.minLength && field.value.length < field.minLength && field.value.trim()) {
            isValid = false;
            errorMessage = config.errorMessages.minLength.replace('{min}', field.minLength);
        }
        // Validar longitud máxima
        else if (field.maxLength && field.value.length > field.maxLength) {
            isValid = false;
            errorMessage = config.errorMessages.maxLength.replace('{max}', field.maxLength);
        }
        // Validar patrón personalizado
        else if (field.pattern && field.value.trim() && !(new RegExp(field.pattern)).test(field.value)) {
            isValid = false;
            errorMessage = field.dataset.errorMessage || config.errorMessages.pattern;
        }
        // Validar que coincide con otro campo
        else if (field.dataset.match && field.value !== document.querySelector(field.dataset.match).value) {
            isValid = false;
            errorMessage = config.errorMessages.match;
        }
        
        // Aplicar estilo y mensaje de error si no es válido
        if (!isValid) {
            field.classList.add('error');
            displayErrorMessage(field, errorMessage);
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
        }
        
        return isValid;
    };
    
    // Mostrar mensaje de error
    const displayErrorMessage = (field, message) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insertar después del campo o de su contenedor
        const container = field.closest('.form-field') || field.parentElement;
        container.appendChild(errorElement);
        
        // Animar aparición del mensaje
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
    };
    
    // Eliminar mensajes de error
    const removeErrorMessages = (field) => {
        const container = field.closest('.form-field') || field.parentElement;
        const errorMessages = container.querySelectorAll('.error-message');
        
        errorMessages.forEach(msg => {
            msg.remove();
        });
        
        field.classList.remove('error', 'valid');
    };
    
    // Validar todo el formulario
    const validateForm = (form) => {
        const fields = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    };
    
    // =========== Gestión de Envío de Formularios ===========
    const handleFormSubmit = async (form, event) => {
        event.preventDefault();
        
        // Validar formulario completo
        if (!validateForm(form)) {
            // Enfocar el primer campo con error
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Mostrar indicador de carga
        showLoadingIndicator(form);
        
        try {
            // Determinar endpoint según el tipo de formulario
            let endpoint = config.endpoints.contact; // Por defecto
            
            if (form.classList.contains('newsletter-form')) {
                endpoint = config.endpoints.newsletter;
            } else if (form.classList.contains('appointment-form')) {
                endpoint = config.endpoints.appointment;
            } else if (form.dataset.endpoint) {
                endpoint = form.dataset.endpoint;
            }
            
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const formDataObject = {};
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            
            // Añadir información adicional
            formDataObject.submitTime = new Date().toISOString();
            formDataObject.pageUrl = window.location.href;
            
            // Si estamos en desarrollo, simular éxito después de 1 segundo
            if (config.isDevelopment) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                showSuccessMessage(form);
                return;
            }
            
            // Enviar datos a la API
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject)
            });
            
            // Procesar respuesta
            if (response.ok) {
                showSuccessMessage(form);
                
                // Limpiar formulario solo si todo va bien
                form.reset();
            } else {
                const errorData = await response.json();
                showErrorMessage(form, errorData.message || 'Ha ocurrido un error al enviar el formulario');
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            showErrorMessage(form, 'Ha ocurrido un error al enviar el formulario');
        } finally {
            hideLoadingIndicator(form);
        }
    };
    
    // Mostrar indicador de carga
    const showLoadingIndicator = (form) => {
        // Desactivar botón de envío
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset.originalText = submitButton.textContent;
            submitButton.innerHTML = '<span class="spinner"></span> Enviando...';
        }
        
        // Agregar clase de carga al formulario
        form.classList.add('form-loading');
    };
    
    // Ocultar indicador de carga
    const hideLoadingIndicator = (form) => {
        // Reactivar botón de envío
        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalText || 'Enviar';
        }
        
        // Quitar clase de carga
        form.classList.remove('form-loading');
    };
    
    // Mostrar mensaje de éxito
    const showSuccessMessage = (form) => {
        // Crear mensaje de éxito
        const successContainer = document.createElement('div');
        successContainer.className = 'form-success';
        
        // Personalizar mensaje según el tipo de formulario
        let message = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
        
        if (form.classList.contains('newsletter-form')) {
            message = '¡Gracias por suscribirte a nuestro boletín!';
        } else if (form.classList.contains('appointment-form')) {
            message = '¡Tu solicitud de cita ha sido registrada! Te contactaremos pronto.';
        }
        
        successContainer.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>¡Enviado correctamente!</h3>
            <p>${message}</p>
            ${form.classList.contains('keep-form') ? '' : '<button class="close-message">Cerrar</button>'}
        `;
        
        // Mostrar mensaje
        form.style.opacity = '0';
        setTimeout(() => {
            if (!form.classList.contains('keep-form')) {
                form.style.display = 'none';
            }
            form.parentElement.appendChild(successContainer);
            
            // Animación de entrada
            successContainer.style.opacity = '0';
            successContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                successContainer.style.opacity = '1';
                successContainer.style.transform = 'translateY(0)';
            }, 10);
            
            // Botón para cerrar mensaje
            const closeButton = successContainer.querySelector('.close-message');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    // Ocultar mensaje y mostrar formulario de nuevo
                    successContainer.style.opacity = '0';
                    successContainer.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        successContainer.remove();
                        form.style.display = '';
                        form.style.opacity = '1';
                    }, 300);
                });
            }
        }, 300);
    };
    
    // Mostrar mensaje de error
    const showErrorMessage = (form, message) => {
        // Crear mensaje de error
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.innerHTML = `
            <div class="error-icon">!</div>
            <h3>Error</h3>
            <p>${message}</p>
            <button class="close-message">Cerrar</button>
        `;
        
        // Mostrar mensaje
        form.parentElement.appendChild(errorContainer);
        
        // Animación de entrada
        errorContainer.style.opacity = '0';
        errorContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            errorContainer.style.opacity = '1';
            errorContainer.style.transform = 'translateY(0)';
        }, 10);
        
        // Botón para cerrar mensaje
        const closeButton = errorContainer.querySelector('.close-message');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                errorContainer.remove();
            });
        }
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            if (errorContainer.parentElement) {
                errorContainer.style.opacity = '0';
                errorContainer.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    if (errorContainer.parentElement) {
                        errorContainer.remove();
                    }
                }, 300);
            }
        }, 5000);
    };
    
    // =========== Inicialización ===========
    const initFormHandlers = () => {
        // Inicializar validación en todos los formularios
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Para cada campo, validar al perder el foco
            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                field.addEventListener('blur', () => {
                    if (field.value.trim() !== '' || field.hasAttribute('required')) {
                        validateField(field);
                    }
                });
                
                // Quitar mensajes de error al escribir
                field.addEventListener('input', () => {
                    removeErrorMessages(field);
                });
            });
            
            // Gestionar envío del formulario
            form.addEventListener('submit', (e) => {
                handleFormSubmit(form, e);
            });
        });
        
        // Añadir estilos CSS para los mensajes de error y éxito
        addFormStyles();
    };
    
    // Agregar estilos CSS necesarios
    const addFormStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .error-message {
                color: #e53935;
                font-size: 0.85rem;
                margin-top: 5px;
                transition: opacity 0.3s, transform 0.3s;
            }
            
            input.error, textarea.error, select.error {
                border-color: #e53935 !important;
                background-color: rgba(229, 57, 53, 0.05);
            }
            
            input.valid, textarea.valid, select.valid {
                border-color: #43a047 !important;
            }
            
            .form-loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .form-success, .form-error {
                background-color: #fff;
                border-radius: 8px;
                padding: 25px;
                margin-top: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                text-align: center;
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .form-success {
                border-top: 4px solid #43a047;
            }
            
            .form-error {
                border-top: 4px solid #e53935;
            }
            
            .success-icon, .error-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                margin-bottom: 15px;
                font-size: 24px;
                font-weight: bold;
            }
            
            .success-icon {
                background-color: #43a047;
                color: white;
            }
            
            .error-icon {
                background-color: #e53935;
                color: white;
            }
            
            .close-message {
                margin-top: 15px;
                padding: 8px 16px;
                background-color: #f5f5f5;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            
            .close-message:hover {
                background-color: #e0e0e0;
            }
        `;
        
        document.head.appendChild(styleElement);
    };
    
    // Iniciar gestores de formularios
    initFormHandlers();
    
    // Exponer funciones para uso global
    window.formHandlers = {
        validateField,
        validateForm,
        resetForm: (form) => {
            form.reset();
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error, .valid').forEach(field => {
                field.classList.remove('error', 'valid');
            });
        }
    };
}); 