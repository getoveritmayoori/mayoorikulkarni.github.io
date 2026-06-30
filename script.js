// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initTypewriter();
    initParticles();
    initScrollReveal();
    initCardTilt();
});

/* =========================================================================
   Navbar Scroll and Section Highlighting
   ========================================================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add scrolled class to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightNav();
    });

    // Highlight current section in navbar
    function highlightNav() {
        let scrollPosition = window.scrollY + 100; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* =========================================================================
   Mobile Navigation Menu
   ========================================================================= */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* =========================================================================
   Typewriter Effect
   ========================================================================= */
function initTypewriter() {
    const typewriter = document.getElementById('typewriter');
    const words = [
        "Third-Year ENTC Student",
        "Data Science Scholar",
        "Software Developer",
        "Creative Architect"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Deletes faster
        } else {
            typewriter.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150; // Types slower
        }

        // Logical branching for word state changes
        if (!isDeleting && charIndex === currentWord.length) {
            typeDelay = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Pause before typing next word
        }

        setTimeout(type, typeDelay);
    }

    // Start typing if element exists
    if (typewriter) {
        setTimeout(type, 1000);
    }
}

/* =========================================================================
   Canvas Interactive Particle System
   ========================================================================= */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const colors = ['#4f46e5', '#8b5cf6', '#ec4899'];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse interactive coordinates
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            // Mouse interact (gentle hover push)
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * 1.0;
                    let directionY = forceDirectionY * force * 1.0;
                    
                    this.x += directionX;
                    this.y += directionY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize particles
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 22000;
        // Cap particles for good performance and subtle effect
        numberOfParticles = Math.min(numberOfParticles, 60); 
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    init();

    // Connect particles with lines
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.08})`; // Faint violet links
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================================================
   Scroll Reveal Animations
   ========================================================================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.glass-panel, .timeline-item, .section-header');

    // Add scroll animation styles dynamically to avoid layout shifting on initial load
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before screen
    });

    revealElements.forEach(el => observer.observe(el));
}

/* =========================================================================
   3D Tilt Effect on Cards
   ========================================================================= */
function initCardTilt() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    // Only apply on non-touch devices for better mobile experience
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Mouse position relative to card
            const mouseX = e.clientX - cardRect.left;
            const mouseY = e.clientY - cardRect.top;
            
            // Calculate tilt percentages (-0.5 to 0.5)
            const rotateX = -((mouseY / cardHeight) - 0.5) * 12; // Cap tilt at 12 degrees
            const rotateY = ((mouseX / cardWidth) - 0.5) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Set dynamic glow position if glow element exists
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle 120px at ${mouseX}px ${mouseY}px, rgba(0, 240, 255, 0.12), transparent)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = 'transparent';
            }
        });
    });
}
