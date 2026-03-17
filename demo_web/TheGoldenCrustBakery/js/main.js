/* ============================================================
   THE GOLDEN CRUST BAKERY - MAIN JAVASCRIPT
   ============================================================ */

'use strict';

// ─── Navbar Scroll Effect ────────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll-to-top button
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  // Active nav link highlight
  updateActiveNav();
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Mobile Nav ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close mobile nav when a link is clicked
document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }
});

// ─── Active Nav Link ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ─── Hero Background Parallax & Load ─────────────────────────
const heroBg = document.getElementById('hero-bg');
if (heroBg) {
  // Trigger the Ken Burns animation after load
  window.addEventListener('load', () => {
    heroBg.classList.add('loaded');
  });

  // Subtle parallax on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${scrollY * 0.35}px)`;
  }, { passive: true });
}

// ─── Scroll Reveal Animation ─────────────────────────────────
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger for sibling elements
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── Stagger product cards ────────────────────────────────────
document.querySelectorAll('.stagger > *').forEach((el, i) => {
  el.style.setProperty('--i', i);
});

// ─── Smooth scroll for all internal anchor links ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // Navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Counter Animation (Stats bar) ───────────────────────────
const counters = document.querySelectorAll('[data-count]');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        let start = 0;
        const duration = 1600;
        const step = target / (duration / 16);

        const update = () => {
          start = Math.min(start + step, target);
          counter.textContent = prefix + Math.round(start) + suffix;
          if (start < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) counterObserver.observe(statsSection);

// ─── Gallery Lightbox ─────────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay span');

    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(30, 16, 8, 0.92);
      display: flex; align-items: center; justify-content: center;
      padding: 24px; cursor: zoom-out;
      animation: fadeInUp 0.3s ease;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.style.cssText = `
      max-width: 90vw; max-height: 88vh;
      border-radius: 16px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.7);
      object-fit: contain;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: fixed; top: 20px; right: 24px;
      background: rgba(255,255,255,0.15); border: none;
      color: #fff; font-size: 1.4rem; width: 44px; height: 44px;
      border-radius: 50%; cursor: pointer; backdrop-filter: blur(6px);
    `;

    overlay.appendChild(imgEl);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  console.log('🍞 The Golden Crust Bakery website loaded successfully!');
});
