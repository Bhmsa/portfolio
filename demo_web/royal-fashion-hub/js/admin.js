/* ============================================
   Admin Dashboard Module
   Royal Fashion Hub - Product Management (CRUD)
   
   Handles:
   - Authentication guard
   - Add new product
   - Edit existing product
   - Delete product (with confirmation)
   - View all products in table
   - Stats display
   - Logout
   ============================================ */

import {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from './firebase-config.js';

import { requireAuth, handleLogout, showToast } from './auth.js';
import { formatPrice } from './products.js';

// Store products locally for quick access
let allProducts = [];
let editingProductId = null;

// ==============================
// Initialize Admin Dashboard
// ==============================
function initAdminDashboard() {
    // Guard: Only accessible if authenticated
    requireAuth((user) => {
        // User is authenticated - show dashboard
        document.getElementById('adminUserEmail').textContent = user.email;

        // Load products
        loadProducts();

        // Initialize form handler
        initProductForm();

        // Initialize logout button
        initLogout();

        // Initialize mobile sidebar toggle
        initMobileSidebar();

        // Remove loading overlay
        hideLoadingOverlay();
    });
}

// ==============================
// Load Products from Firestore
// ==============================
async function loadProducts() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    // Show loading state
    tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center; padding:40px;">
        <div class="inline-spinner"></div>
        <p style="color:var(--text-secondary); margin-top:10px;">Loading products...</p>
      </td>
    </tr>
  `;

    try {
        // Fetch products ordered by creation date
        const productsQuery = query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(productsQuery);
        allProducts = [];

        querySnapshot.forEach((doc) => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Render products table
        renderProductsTable();

        // Update stats
        updateStats();

    } catch (error) {
        console.error('Error loading products:', error);
        tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:40px; color:var(--text-secondary);">
          <p>⚠️ Error loading products. Please check your Firebase configuration.</p>
        </td>
      </tr>
    `;
    }
}

// ==============================
// Render Products Table
// ==============================
function renderProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    if (allProducts.length === 0) {
        tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:40px;">
          <div class="no-products">
            <div class="no-products-icon">📦</div>
            <h3>No Products Yet</h3>
            <p>Add your first product using the form above!</p>
          </div>
        </td>
      </tr>
    `;
        return;
    }

    tableBody.innerHTML = allProducts.map(product => `
    <tr>
      <td>
        <img 
          class="admin-table-image" 
          src="${product.imageURL || 'https://placehold.co/100x100/fce4ec/c2185b?text=No+Img'}" 
          alt="${product.name}"
          onerror="this.src='https://placehold.co/100x100/fce4ec/c2185b?text=No+Img'"
        >
      </td>
      <td><strong>${product.name}</strong></td>
      <td>${formatPrice(product.price)}</td>
      <td><span class="product-badge" style="position:static;">${product.category || 'N/A'}</span></td>
      <td>${product.description ? product.description.substring(0, 50) + '...' : 'No description'}</td>
      <td>
        <div class="admin-table-actions">
          <button class="btn-edit" onclick="editProduct('${product.id}')" title="Edit Product">✏️ Edit</button>
          <button class="btn-danger" onclick="confirmDelete('${product.id}', '${product.name.replace(/'/g, "\\'")}')" title="Delete Product">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ==============================
// Update Dashboard Stats
// ==============================
function updateStats() {
    const totalProducts = allProducts.length;
    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    const totalCategories = categories.length;

    // Update stat values
    const totalEl = document.getElementById('statTotalProducts');
    const catEl = document.getElementById('statCategories');

    if (totalEl) totalEl.textContent = totalProducts;
    if (catEl) catEl.textContent = totalCategories;
}

// ==============================
// Initialize Product Form
// ==============================
function initProductForm() {
    const form = document.getElementById('productForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Gather form data
        const name = document.getElementById('productName').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const category = document.getElementById('productCategory').value;
        const imageURL = document.getElementById('productImageURL').value.trim();
        const description = document.getElementById('productDescription').value.trim();

        // Validate
        if (!name || !price || !category) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        // Get submit button
        const submitBtn = document.getElementById('productSubmitBtn');
        submitBtn.disabled = true;

        try {
            if (editingProductId) {
                // UPDATE existing product
                submitBtn.innerHTML = '<span class="inline-spinner" style="width:18px;height:18px;margin:0;border-width:2px;"></span> Updating...';

                const productRef = doc(db, 'products', editingProductId);
                await updateDoc(productRef, {
                    name,
                    price: Number(price),
                    category,
                    imageURL,
                    description
                });

                showToast('Product updated successfully! ✅', 'success');
                editingProductId = null;
                document.getElementById('formTitle').textContent = 'Add New Product';
                submitBtn.innerHTML = '➕ Add Product';

                // Hide cancel button
                document.getElementById('cancelEditBtn').style.display = 'none';

            } else {
                // ADD new product
                submitBtn.innerHTML = '<span class="inline-spinner" style="width:18px;height:18px;margin:0;border-width:2px;"></span> Adding...';

                await addDoc(collection(db, 'products'), {
                    name,
                    price: Number(price),
                    category,
                    imageURL,
                    description,
                    createdAt: serverTimestamp()
                });

                showToast('Product added successfully! 🎉', 'success');
            }

            // Reset form
            form.reset();

            // Reload products
            await loadProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            showToast('Error saving product. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            if (!editingProductId) {
                submitBtn.innerHTML = '➕ Add Product';
            }
        }
    });

    // Cancel edit handler
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            cancelEdit();
        });
    }
}

// ==============================
// Edit Product
// ==============================
window.editProduct = function (productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Set editing mode
    editingProductId = productId;

    // Fill form with product data
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productImageURL').value = product.imageURL || '';
    document.getElementById('productDescription').value = product.description || '';

    // Update UI
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productSubmitBtn').innerHTML = '💾 Update Product';
    document.getElementById('cancelEditBtn').style.display = 'inline-flex';

    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
};

// ==============================
// Cancel Edit
// ==============================
function cancelEdit() {
    editingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('productSubmitBtn').innerHTML = '➕ Add Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// ==============================
// Delete Product (with Confirmation Modal)
// ==============================
window.confirmDelete = function (productId, productName) {
    const modal = document.getElementById('deleteModal');
    const productNameEl = document.getElementById('deleteProductName');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    if (!modal) return;

    // Set product name in modal
    productNameEl.textContent = productName;

    // Show modal
    modal.classList.add('show');

    // Confirm delete handler
    const handleConfirm = async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="inline-spinner" style="width:16px;height:16px;margin:0;border-width:2px;"></span>';

        try {
            await deleteDoc(doc(db, 'products', productId));
            showToast('Product deleted successfully! 🗑️', 'success');
            modal.classList.remove('show');
            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Error deleting product. Please try again.', 'error');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Yes, Delete';
            cleanup();
        }
    };

    // Cancel handler
    const handleCancel = () => {
        modal.classList.remove('show');
        cleanup();
    };

    // Cleanup event listeners
    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) handleCancel();
    });
};

// ==============================
// Logout Handler
// ==============================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', handleLogout);
    }
}

// ==============================
// Mobile Sidebar Toggle
// ==============================
function initMobileSidebar() {
    const toggle = document.getElementById('adminMobileToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// ==============================
// Hide Loading Overlay
// ==============================
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 500);
        }, 500);
    }
}

// Export init function
export { initAdminDashboard };
