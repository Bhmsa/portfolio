/* ═══════════════════════════════════════════════
   The1857House — Cafe Website Scripts
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── DOM Elements ──
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const heroSection = document.getElementById('home');
  const reveals     = document.querySelectorAll('.reveal');
  const heroParticles = document.getElementById('heroParticles');

  // ════════════════════════════════════════════════
  // NAVBAR SCROLL EFFECT
  // ════════════════════════════════════════════════
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        handleReveal();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  handleScroll();


  // ════════════════════════════════════════════════
  // HAMBURGER MENU
  // ════════════════════════════════════════════════
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ════════════════════════════════════════════════
  // ACTIVE NAV LINK HIGHLIGHTING
  // ════════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  // ════════════════════════════════════════════════
  // SCROLL REVEAL ANIMATIONS
  // ════════════════════════════════════════════════
  function handleReveal() {
    const triggerBottom = window.innerHeight * 0.88;

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  }

  // Initial check
  handleReveal();


  // ════════════════════════════════════════════════
  // HERO FLOATING PARTICLES
  // ════════════════════════════════════════════════
  function createParticles() {
    if (!heroParticles) return;
    const count = window.innerWidth < 768 ? 12 : 25;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('hero-particle');
      particle.style.left     = Math.random() * 100 + '%';
      particle.style.animationDuration  = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay     = (Math.random() * 5) + 's';
      particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
      heroParticles.appendChild(particle);
    }
  }

  createParticles();


  // ════════════════════════════════════════════════
  // SMOOTH SCROLL — fallback for older browsers
  // ════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });


  // ════════════════════════════════════════════════
  // MENU CARD TILT EFFECT (optional micro-interaction)
  // ════════════════════════════════════════════════
  const menuCards = document.querySelectorAll('.menu-card');

  menuCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return; // disable on mobile

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ════════════════════════════════════════════════
  // WHATSAPP TOOLTIP AUTO-SHOW ON FIRST VISIT
  // ════════════════════════════════════════════════
  const whatsappFloat = document.getElementById('whatsappFloat');

  if (whatsappFloat && !sessionStorage.getItem('wa_shown')) {
    setTimeout(() => {
      const tooltip = whatsappFloat.querySelector('.whatsapp-tooltip');
      if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(0)';

        setTimeout(() => {
          tooltip.style.opacity = '';
          tooltip.style.transform = '';
          sessionStorage.setItem('wa_shown', '1');
        }, 3500);
      }
    }, 3000);
  }


  // ════════════════════════════════════════════════
  // KEYBOARD ACCESSIBILITY — ESC closes mobile menu
  // ════════════════════════════════════════════════
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

});
