let lastFlickerTime = 0;
const flickerInterval = 1000 / 100;
const minOpacity = 0.0;
const maxOpacity = 0.07;


document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade in sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Add hover effect to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
    function createFlickerOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: multiply;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    const overlay = createFlickerOverlay();

    function flicker() {
        overlay.style.opacity = minOpacity + (Math.random() * (maxOpacity - minOpacity));
        setTimeout(flicker, flickerInterval);
    }

    flicker();

});

