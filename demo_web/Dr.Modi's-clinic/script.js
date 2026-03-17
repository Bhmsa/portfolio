/* ==========================================
   DR. MODI'S NEURO PSYCHIATRY CLINIC
   JavaScript - Interactions & Animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Initialize AOS Animations =====
    AOS.init({
        once: true,
        duration: 600,
        easing: 'ease-out-cubic',
        offset: 50
    });

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNav();
    }

    window.addEventListener('scroll', handleScroll);

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Mobile Navigation =====
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    // Create overlay
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function toggleNav() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav);

    // Close nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleNav();
            }
        });
    });

    // ===== Active Navigation Highlight =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.hero-stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });

        countersAnimated = true;
    }

    // Trigger counter when hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }

    // ===== Hero Particles =====
    const particlesContainer = document.getElementById('heroParticles');

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 6;
        const delay = Math.random() * 4;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -20px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        particlesContainer.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
        createParticle();
    }

    // Continuous particle creation
    setInterval(createParticle, 2000);

    // ===== Appointment Form =====
    const appointmentForm = document.getElementById('appointmentForm');
    const successModal = document.getElementById('successModal');

    if (appointmentForm) {
        // Set min date to today
        const dateInput = document.getElementById('preferredDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const date = document.getElementById('preferredDate').value;
            const message = document.getElementById('patientMessage').value.trim();

            // Basic validation
            if (!name || !phone || !date) {
                shakeButton();
                return;
            }

            // Phone validation (Indian format)
            const phoneRegex = /^[6-9]\d{9}$/;
            const cleanPhone = phone.replace(/[\s\-\+91]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                alert('Please enter a valid 10-digit Indian phone number.');
                return;
            }

            // Submit button loading state
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Show success modal
                successModal.classList.add('active');

                // Reset form
                appointmentForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Construct WhatsApp message
                const whatsappMsg = `Hello Dr. Modi,%0AI'd like to book an appointment.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0APreferred Date: ${encodeURIComponent(date)}%0AMessage: ${encodeURIComponent(message || 'N/A')}`;

                // Optional: Open WhatsApp after booking
                // window.open(`https://wa.me/91XXXXXXXXXX?text=${whatsappMsg}`, '_blank');
            }, 1500);
        });
    }

    function shakeButton() {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.style.animation = 'shake 0.5s';
        setTimeout(() => {
            submitBtn.style.animation = '';
        }, 500);
    }

    // Close modal on clicking outside
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // ===== Smooth Scroll for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Service Cards Tilt Effect =====
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== Floating WhatsApp Animation Delay =====
    const floatingWhatsApp = document.getElementById('floatingWhatsApp');
    if (floatingWhatsApp) {
        floatingWhatsApp.style.transform = 'scale(0)';
        setTimeout(() => {
            floatingWhatsApp.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            floatingWhatsApp.style.transform = 'scale(1)';
        }, 2000);
    }

    // ===== Keyboard Accessibility =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close modal
            if (successModal.classList.contains('active')) {
                successModal.classList.remove('active');
            }
            // Close mobile nav
            if (nav.classList.contains('active')) {
                toggleNav();
            }
        }
    });

    // ===== Input Focus Animation =====
    document.querySelectorAll('.input-icon-wrap input, .input-icon-wrap textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
        });
    });

    console.log('%c🧠 Dr. Modi\'s Neuro Psychiatry Clinic', 'font-size: 16px; font-weight: bold; color: #1a73e8;');
    console.log('%cWebsite loaded successfully!', 'color: #10b981;');
});

// ===== Shake Animation (inline) =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);
