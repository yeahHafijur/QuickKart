import { setupShopStatus, updateShopStatus, isShopOpen } from './firebase-config.js';
import { initStore } from './store.js';
import cart from './cart-data.js';
import {
    updateCartUI,
    removeFromCart,
    openCart,
    closeCart,
    setupCartElements
} from './cart.js';
import { showNotification } from './utils.js';

// DOM Elements
const elements = {
    storeDiv: document.getElementById('storeItems'),
    popularDiv: document.getElementById('popularItems'),
    cartList: document.getElementById('cartList'),
    cartCount: document.getElementById('cartCount'),
    cartTotal: document.getElementById('cartTotal'),
    itemTotal: document.getElementById('itemTotal'),
    cartToggle: document.getElementById('cartToggle'),
    closeCartBtn: document.getElementById('closeCart'),
    notification: document.getElementById('notification'),
    searchInput: document.getElementById('searchInput'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    cartElement: document.getElementById('cart'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartFull: document.getElementById('cartFull'),
    continueShoppingBtn: document.getElementById('continueShopping'),
    cartOverlay: document.getElementById('cartOverlay'),
    placeOrderBtn: document.getElementById('placeOrderBtn'),
    locationStatus: document.getElementById('locationStatus'),
    customerNameInput: document.getElementById('customerName'),
    customerPhoneInput: document.getElementById('customerPhone'),
    shopStatusToggle: document.getElementById('shopStatusToggle'),
    shopStatusText: document.getElementById('shopStatusText'),
    resetCartBtn: document.getElementById('resetCartBtn')
};

// Initialize cart functions
setupCartElements(elements);

// Make functions available globally
window.showNotification = showNotification;
window.updateCartUI = updateCartUI;

// Reset corrupted cart data
function resetCorruptedCart() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (totalItems > 1000) {
        console.warn('Resetting corrupted cart data');
        cart.length = 0;
        localStorage.setItem('quickKartCart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    elements.cartToggle.addEventListener('click', openCart);
    elements.closeCartBtn.addEventListener('click', closeCart);
    elements.continueShoppingBtn.addEventListener('click', closeCart);
    elements.cartOverlay.addEventListener('click', closeCart);
    elements.cartElement.addEventListener('click', e => e.stopPropagation());

    // Search debounce
    let searchTimer;
    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            const activeBtn = document.querySelector('.category-btn.active');
            const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
            initStore(category, searchTerm, elements.storeDiv);
        }, 300);
    });

    // Category filtering
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            initStore(category, searchTerm, elements.storeDiv);
        });
    });

    elements.customerPhoneInput.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });

    // Manual cart reset button
    if (elements.resetCartBtn) {
        elements.resetCartBtn.addEventListener('click', () => {
            cart.length = 0;
            localStorage.setItem('quickKartCart', JSON.stringify(cart));
            updateCartUI();
            showNotification('Cart has been reset');
        });
    }
}

// Initialize the app
function initializeApp() {
    resetCorruptedCart();
    setupShopStatus(elements);
    setupEventListeners();
    
    // Initialize store with all items
    initStore('all', '', elements.storeDiv);
    
    // Initialize popular items (you can customize this)
    const popularItems = items.filter(item => item.rating >= 4.0);
    if (elements.popularDiv) {
        initStore('all', '', elements.popularDiv);
    }
    
    // Initial UI update
    updateCartUI();
}

document.addEventListener('DOMContentLoaded', initializeApp);