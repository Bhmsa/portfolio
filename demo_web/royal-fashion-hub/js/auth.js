/* ============================================
   Authentication Module
   Royal Fashion Hub - Admin Login/Logout
   
   Handles:
   - Admin login with email/password
   - Logout functionality
   - Auth state monitoring
   - Protected route redirection
   ============================================ */

import {
    auth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from './firebase-config.js';

// ==============================
// Login Handler
// ==============================
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    if (!loginForm) return;

    // If already logged in, redirect to admin
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.location.href = 'admin.html';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        // Hide previous error
        loginError.classList.remove('show');
        loginError.textContent = '';

        // Validate inputs
        if (!email || !password) {
            showLoginError('Please enter both email and password.');
            return;
        }

        // Show loading state on button
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="inline-spinner" style="width:20px;height:20px;margin:0;border-width:2px;"></span> Signing in...';

        try {
            // Attempt login with Firebase
            await signInWithEmailAndPassword(auth, email, password);

            // Success - redirect to admin dashboard
            window.location.href = 'admin.html';
        } catch (error) {
            // Handle specific Firebase auth errors
            let errorMessage = 'Login failed. Please try again.';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = `Error: ${error.message}`;
            }

            showLoginError(errorMessage);
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Sign In';
        }
    });

    // Helper to show login error message
    function showLoginError(message) {
        loginError.textContent = message;
        loginError.classList.add('show');
    }
}

// ==============================
// Logout Handler
// ==============================
async function handleLogout() {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out. Please try again.', 'error');
    }
}

// ==============================
// Auth State Guard (for admin pages)
// Redirects to login if not authenticated
// ==============================
function requireAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in - execute callback
            if (callback) callback(user);
        } else {
            // Not logged in - redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// ==============================
// Toast Notification Helper
// ==============================
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast with animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-hide after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// Export functions for use in other modules
export { initLoginPage, handleLogout, requireAuth, showToast };
