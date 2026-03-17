/**
 * Projects Loader — Dynamically loads project cards
 * Loads from demo_web/ folder data
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Project data — maps to demo_web/ folder structure
  // Add new projects here when you add them to demo_web/
  const projects = [
    {
      folder: "Dr.Modi's-clinic",
      title: "Dr. Modi's Clinic",
      category: "Healthcare",
      description: "A modern, professional medical clinic website with appointment booking, doctor profiles, and services showcase. Built with clean UI and mobile-first approach.",
      image: "images/clinic-preview.png",
      link: "demo_web/Dr.Modi's-clinic/index.html"
    },
    {
      folder: "The1857House",
      title: "The 1857 House",
      category: "Hospitality",
      description: "An elegant heritage hotel website featuring room showcases, booking functionality, and stunning visual presentation with premium typography.",
      image: "images/hotel-preview.png",
      link: "demo_web/The1857House/index.html"
    },
    {
      folder: "TheGoldenCrustBakery",
      title: "The Golden Crust Bakery",
      category: "Food & Beverages",
      description: "A warm, appetizing bakery website with menu showcase, online ordering features, and a cozy design that makes you crave fresh bread.",
      image: "images/bakery-preview.png",
      link: "demo_web/TheGoldenCrustBakery/index.html"
    },
    {
      folder: "royal-fashion-hub",
      title: "Royal Fashion Hub",
      category: "E-Commerce",
      description: "A stylish fashion e-commerce website with product catalogs, shopping features, and elegant minimal design focused on showcasing clothing collections.",
      image: "images/fashion-preview.png",
      link: "demo_web/royal-fashion-hub/index.html"
    }
  ];

  const projectsGrid = document.getElementById('projectsGrid');
  const noProjects = document.getElementById('noProjects');

  if (!projectsGrid) return;

  if (projects.length === 0) {
    if (noProjects) noProjects.style.display = 'block';
    return;
  }

  // Render project cards
  projects.forEach((project, index) => {
    const delay = (index % 4) + 1;
    
    const card = document.createElement('div');
    card.className = `project-card reveal reveal-delay-${delay}`;
    
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
        <div class="project-overlay">
          <a href="${project.link}" class="btn btn-primary btn-sm" target="_blank">View Live →</a>
        </div>
      </div>
      <div class="project-info">
        <span class="project-category">${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" class="btn btn-outline btn-sm" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Live
        </a>
      </div>
    `;
    
    projectsGrid.appendChild(card);
  });

  // Re-observe new elements for scroll reveal
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

  document.querySelectorAll('#projectsGrid .reveal').forEach(el => {
    revealObserver.observe(el);
  });

});
