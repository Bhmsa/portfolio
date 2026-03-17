/* ============================================
   Products Module
   Royal Fashion Hub - Public Product Display
   
   Handles:
   - Fetching products from Firestore
   - Displaying products in card layout
   - Category filtering (All, Men, Women, Kids)
   - Loading states
   - Price formatting in ₹ (INR)
   ============================================ */

import {
    db,
    collection,
    getDocs,
    query,
    orderBy
} from './firebase-config.js';

// ==============================
// Fetch All Products from Firestore
// ==============================
async function fetchProducts() {
    try {
        // Query products collection, ordered by creation date (newest first)
        const productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(productsQuery);
        const products = [];

        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// ==============================
// Format Price in INR (₹)
// ==============================
function formatPrice(price) {
    // Convert to number if string
    const numPrice = Number(price);

    // Format with Indian numbering system
    return '₹' + numPrice.toLocaleString('en-IN');
}

// ==============================
// Create Product Card HTML
// ==============================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card animate-on-scroll';
    card.setAttribute('data-category', product.category || 'All');

    card.innerHTML = `
    <div class="product-card-image">
      <img 
        src="${product.imageURL || 'https://placehold.co/400x500/fce4ec/c2185b?text=No+Image'}" 
        alt="${product.name}" 
        loading="lazy"
        onerror="this.src='https://placehold.co/400x500/fce4ec/c2185b?text=No+Image'"
      >
      ${product.category ? `<span class="product-badge">${product.category}</span>` : ''}
    </div>
    <div class="product-card-body">
      <p class="product-category">${product.category || 'General'}</p>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description || ''}</p>
      <p class="product-price">${formatPrice(product.price)}</p>
    </div>
  `;

    return card;
}

// ==============================
// Render Products Grid
// ==============================
function renderProducts(products, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
      <div class="no-products" style="grid-column: 1 / -1;">
        <div class="no-products-icon">👗</div>
        <h3>No Products Found</h3>
        <p>New arrivals coming soon! Stay tuned.</p>
      </div>
    `;
        return;
    }

    // Append each product card
    products.forEach((product, index) => {
        const card = createProductCard(product);
        // Stagger animation delays
        card.style.transitionDelay = `${index * 0.1}s`;
        container.appendChild(card);
    });

    // Trigger scroll animations
    observeElements();
}

// ==============================
// Filter Products by Category
// ==============================
function initCategoryFilter(products) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            if (category === 'All') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p =>
                    p.category && p.category.toLowerCase() === category.toLowerCase()
                );
                renderProducts(filtered);
            }
        });
    });
}

// ==============================
// Initialize Shop Page
// ==============================
async function initShopPage() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Show loading spinner
    productsGrid.innerHTML = `
    <div class="products-loading" style="grid-column: 1 / -1;">
      <div class="inline-spinner"></div>
      <p>Loading our latest collection...</p>
    </div>
  `;

    // Fetch products from Firestore
    const products = await fetchProducts();

    // Render products
    renderProducts(products);

    // Initialize category filters
    initCategoryFilter(products);
}

// ==============================
// Initialize Home Page Featured Products
// ==============================
async function initFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;

    // Show loading
    featuredGrid.innerHTML = `
    <div class="products-loading" style="grid-column: 1 / -1;">
      <div class="inline-spinner"></div>
      <p>Loading featured collection...</p>
    </div>
  `;

    // Fetch all products
    const products = await fetchProducts();

    // Show only first 8 products as featured
    const featured = products.slice(0, 8);
    renderProducts(featured, 'featuredGrid');
}

// ==============================
// Scroll Animation Observer
// ==============================
function observeElements() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Export functions
export { initShopPage, initFeaturedProducts, fetchProducts, formatPrice };
