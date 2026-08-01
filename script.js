// Landing hero — flashlight sweep on background image
(function initLandingHeroSpotlight() {
    const hero = document.querySelector('.landing-hero');
    const litBg = document.querySelector('.landing-hero-bg-lit');

    if (!hero || !litBg) return;

    let pointerX = 0;
    let pointerY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let beamX = 0;
    let beamY = 0;
    let beamStrength = 0;
    let isActive = false;
    let rafId = null;

    function updateBeam() {
        const vx = pointerX - lastPointerX;
        const vy = pointerY - lastPointerY;
        const speed = Math.hypot(vx, vy);
        const len = speed || 1;

        const lead = Math.min(speed * 1.4, 36);
        const targetX = pointerX + (vx / len) * lead;
        const targetY = pointerY + (vy / len) * lead;

        beamX += (targetX - beamX) * 0.28;
        beamY += (targetY - beamY) * 0.28;

        const movingTarget = isActive ? Math.min(0.22 + speed * 0.14, 0.62) : 0;
        beamStrength += (movingTarget - beamStrength) * (speed > 0.4 ? 0.22 : 0.1);

        litBg.style.setProperty('--spot-x', `${beamX}px`);
        litBg.style.setProperty('--spot-y', `${beamY}px`);
        litBg.style.setProperty('--beam-strength', beamStrength.toFixed(3));

        lastPointerX = pointerX;
        lastPointerY = pointerY;

        if (isActive || beamStrength > 0.01) {
            rafId = requestAnimationFrame(updateBeam);
        } else {
            rafId = null;
        }
    }

    function startLoop() {
        if (!rafId) rafId = requestAnimationFrame(updateBeam);
    }

    function setPointer(clientX, clientY) {
        const rect = hero.getBoundingClientRect();
        pointerX = clientX - rect.left;
        pointerY = clientY - rect.top;
        startLoop();
    }

    hero.addEventListener('mouseenter', (event) => {
        isActive = true;
        hero.classList.add('is-spotlight-active');
        setPointer(event.clientX, event.clientY);
        beamX = pointerX;
        beamY = pointerY;
    });

    hero.addEventListener('mouseleave', () => {
        isActive = false;
        hero.classList.remove('is-spotlight-active');
        startLoop();
    });

    hero.addEventListener('mousemove', (event) => {
        setPointer(event.clientX, event.clientY);
    });

    hero.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        isActive = true;
        hero.classList.add('is-spotlight-active');
        setPointer(touch.clientX, touch.clientY);
        beamX = pointerX;
        beamY = pointerY;
    }, { passive: true });

    hero.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        setPointer(touch.clientX, touch.clientY);
    }, { passive: true });

    hero.addEventListener('touchend', () => {
        isActive = false;
        hero.classList.remove('is-spotlight-active');
        startLoop();
    });
})();

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    const setMenuOpen = (open) => {
        hamburger.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };

    hamburger.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('active')));

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            setMenuOpen(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenuOpen(false);
            hamburger.focus();
        }
    });
}

// Smooth scroll for same-page navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe why items
document.querySelectorAll('.why-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Observe portfolio items
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});


// Form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalLabel = submitButton?.textContent;
        const formData = new FormData(contactForm);
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const response = await fetch('https://formsubmit.co/ajax/contact@gianniperugini.com', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });
            if (!response.ok) throw new Error(`Message service returned ${response.status}`);
            showConfirmation('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            console.error('Contact form submission failed:', error);
            showConfirmation('Your message could not be sent. Please try again, or email contact@gianniperugini.com directly.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalLabel || 'Send Message';
            }
        }
    });
}

function showConfirmation(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Message status');
    const box = document.createElement('div');
    box.style.cssText = 'background:#1a1a1a;border:1px solid #cc0000;padding:2.5rem;max-width:400px;text-align:center;color:#fff;font-family:Roboto,sans-serif;';
    const paragraph = document.createElement('p');
    paragraph.style.cssText = 'font-size:1.1rem;line-height:1.6;margin-bottom:1.5rem;';
    paragraph.textContent = message;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.cssText = 'background:#cc0000;color:#fff;border:none;padding:0.6rem 2rem;font-size:0.9rem;text-transform:uppercase;letter-spacing:1px;cursor:pointer;';
    button.textContent = 'OK';
    box.append(paragraph, button);
    button.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    button.focus();
}

// Add parallax effect to hero section (skip landing page — spotlight uses fixed layers)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero:not(.landing-hero)');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// Add glow effect to highlighted text on hover
document.querySelectorAll('.highlight').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.textShadow = '0 0 30px rgba(212, 175, 55, 0.8)';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    });
});

// Add typing effect to hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect
// window.addEventListener('load', () => {
//     const subtitle = document.querySelector('.hero-subtitle');
//     const originalText = subtitle.textContent;
//     typeWriter(subtitle, originalText, 30);
// });

