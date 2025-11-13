// Cursor personalizado (optimizado)
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animación suave del cursor con requestAnimationFrame
function animateCursor() {
    // Lerp para suavizado
    cursorX += (mouseX - cursorX) * 0.9;
    cursorY += (mouseY - cursorY) * 0.9;
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Efecto de hover en links
const links = document.querySelectorAll('a, button, .btn-project, .btn-submit');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Navegación por secciones
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');
let currentSection = 0;
let isScrolling = false;

function showSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    
    isScrolling = true;
    const previousSection = currentSection;
    currentSection = index;
    
    // Resetear scroll de la nueva sección al inicio
    sections[index].scrollTop = 0;
    
    // Marcar secciones para animación
    sections.forEach((section, i) => {
        section.classList.remove('active', 'prev');
        if (i === currentSection) {
            section.classList.add('active');
        } else if (i < currentSection) {
            section.classList.add('prev');
        }
    });
    
    // Actualizar navegación
    navDots.forEach((dot, i) => {
        if (i === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Re-iniciar animaciones si volvemos al home
    if (currentSection === 0) {
        resetHomeAnimations();
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 700);
}

// Navegación con rueda del ratón (mejorado para scroll interno)
let touchStartY = 0;
let touchEndY = 0;
let scrollTimeout = null;
let canChangeSection = true;

document.addEventListener('wheel', (e) => {
    const activeSection = sections[currentSection];
    const isAtTop = activeSection.scrollTop === 0;
    const isAtBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 5;
    
    // Si hay contenido scrolleable, permitir scroll interno
    if (activeSection.scrollHeight > activeSection.clientHeight) {
        // Scroll hacia abajo
        if (e.deltaY > 0 && !isAtBottom) {
            return; // Permitir scroll interno
        }
        // Scroll hacia arriba
        if (e.deltaY < 0 && !isAtTop) {
            return; // Permitir scroll interno
        }
    }
    
    // Si llegamos al final/inicio, cambiar de sección
    if (!canChangeSection || isScrolling) return;
    
    e.preventDefault();
    canChangeSection = false;
    
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        if (e.deltaY > 50 && isAtBottom) {
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
            }
        } else if (e.deltaY < -50 && isAtTop) {
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
        }
        
        setTimeout(() => {
            canChangeSection = true;
        }, 100);
    }, 50);
}, { passive: false });

// Navegación táctil para móviles
document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    if (isScrolling) return;
    
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            // Swipe hacia arriba
            if (currentSection < sections.length - 1) {
                showSection(currentSection + 1);
            }
        } else {
            // Swipe hacia abajo
            if (currentSection > 0) {
                showSection(currentSection - 1);
            }
        }
    }
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection > 0) {
            showSection(currentSection - 1);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        showSection(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        showSection(sections.length - 1);
    }
});

// Click en los puntos de navegación
navDots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(index);
    });
});

// Navegación con enlaces hash
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetIndex = Array.from(sections).findIndex(
            section => section.id === targetId
        );
        if (targetIndex !== -1) {
            showSection(targetIndex);
        }
    });
});

// Función para resetear animaciones del home
function resetHomeAnimations() {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        // Remover y reagregar animaciones
        typingText.classList.remove('typing-animation', 'blink-animation');
        
        // Forzar reflow
        void typingText.offsetWidth;
        
        // Iniciar animación de typing
        typingText.classList.add('typing-animation');
        
        // Después de la animación de typing, agregar el blink
        setTimeout(() => {
            typingText.classList.remove('typing-animation');
            typingText.classList.add('blink-animation');
        }, 3000);
    }
}

// Inicializar primera sección
showSection(0);

// Iniciar animaciones del home
setTimeout(() => {
    resetHomeAnimations();
}, 100);

// Animación del indicador de scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            showSection(currentSection + 1);
        }
    });
}

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        // Por ahora solo mostramos un mensaje
        alert('¡Gracias por tu mensaje! Te responderé pronto.');
        contactForm.reset();
    });
}

// Animación de las tarjetas al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos animables
const animatedElements = document.querySelectorAll(
    '.about-card, .skill-item, .timeline-item, .project-card, .contact-card'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efecto parallax en las formas flotantes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Easter egg: Konami Code mejorado
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                       'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let easterEggActive = false;

const easterEggOverlay = document.getElementById('easterEggOverlay');
const easterEggModal = document.getElementById('easterEggModal');
const easterEggTrigger = document.querySelector('.easter-egg-trigger');
const closeModalBtn = document.getElementById('closeModal');

// Click en el mando del gamepad - Muestra las instrucciones
if (easterEggTrigger) {
    easterEggTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        showInstructions();
    });
}

// Función para mostrar las instrucciones
function showInstructions() {
    easterEggModal.classList.add('active');
}

// Cerrar modal de instrucciones
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        easterEggModal.classList.remove('active');
    });
}

// Cerrar modal con click fuera
easterEggModal.addEventListener('click', (e) => {
    if (e.target === easterEggModal) {
        easterEggModal.classList.remove('active');
    }
});

// Activar con código Konami
document.addEventListener('keydown', (e) => {
    // Si el modal está abierto, cerrar con ESC
    if (e.key === 'Escape') {
        if (easterEggModal.classList.contains('active')) {
            easterEggModal.classList.remove('active');
        } else if (easterEggActive) {
            deactivateEasterEgg();
        }
        return;
    }
    
    // Detectar código Konami
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Cerrar modal de instrucciones si está abierto
        easterEggModal.classList.remove('active');
        // Activar easter egg
        activateEasterEgg();
    }
});

// Función para activar el easter egg
function activateEasterEgg() {
    if (!easterEggActive) {
        easterEggActive = true;
        document.body.classList.add('rainbow-mode');
        easterEggOverlay.classList.add('active');
        
        // Mostrar mensaje por 3 segundos
        setTimeout(() => {
            easterEggOverlay.classList.remove('active');
        }, 3000);
        
        console.log('🎉 ¡Easter Egg Activado! Presiona ESC para desactivar');
    }
}

// Función para desactivar el easter egg
function deactivateEasterEgg() {
    easterEggActive = false;
    document.body.classList.remove('rainbow-mode');
    easterEggOverlay.classList.remove('active');
    console.log('Easter Egg desactivado');
}

// Contador de visitas (usando localStorage)
let visits = localStorage.getItem('portfolioVisits') || 0;
visits++;
localStorage.setItem('portfolioVisits', visits);
console.log(`¡Gracias por visitar mi portafolio! Esta es tu visita número ${visits} 🎉`);

// Mensajes motivacionales en consola
const motivationalMessages = [
    "💻 Sigue programando, el código perfecto no existe pero el tuyo puede ser excelente!",
    "🚀 Cada línea de código te acerca más a tu meta!",
    "⭐ La práctica hace al maestro, sigue aprendiendo!",
    "🎯 El mejor momento para empezar era ayer, el segundo mejor momento es ahora!",
    "💡 Los bugs son solo características no documentadas!"
];

console.log(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

// Detección de tema del sistema (opcional)
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    console.log('📱 Tema claro del sistema detectado. El portafolio usa tema oscuro por diseño.');
}

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Página cargada en ${loadTime.toFixed(2)}ms`);
});
