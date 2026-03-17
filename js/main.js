/**
 * Main JavaScript — Portfolio Website
 * Suryapratap Singh Chundawat
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PAGE LOADER =====
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('hidden');
      }, 300);
    });
    // Fallback: hide loader after 2 seconds regardless
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 2000);
  }

  // ===== STICKY NAVBAR =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  // ===== MOBILE MENU =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close menu when clicking a link
    const navLinkItems = navLinks.querySelectorAll('a:not(.btn)');
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate form submission (replace with actual backend later)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Create mailto link as fallback
      const subject = encodeURIComponent(`Website Project Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      
      setTimeout(() => {
        // Open email client with the form data
        window.location.href = `mailto:suryaprathap1234qw@gmail.com?subject=${subject}&body=${body}`;
        
        // Show success message
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
        }
      }, 800);
    });
  }

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-links a:not(.btn)');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // ===== COUNTER ANIMATION FOR STATS =====
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          
          // Only animate if it contains a number
          const num = parseInt(text);
          if (!isNaN(num) && num > 0) {
            let current = 0;
            const increment = Math.ceil(num / 40);
            const suffix = text.replace(/[0-9]/g, '');
            
            const timer = setInterval(() => {
              current += increment;
              if (current >= num) {
                current = num;
                clearInterval(timer);
              }
              el.textContent = current + suffix;
            }, 30);
          }
          
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

});
