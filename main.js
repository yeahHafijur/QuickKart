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
import { setupLocation } from './location.js';
import { showNotification } from './utils.js';

// DOM Elements
const elements = {
    storeDiv: document.getElementById('storeItems'),
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
    getLocationBtn: document.getElementById('getLocationBtn'),
    locationDisplay: document.getElementById('locationDisplay'),
    customerAddressInput: document.getElementById('customerAddress'),
    userLatInput: document.getElementById('userLat'),
    userLngInput: document.getElementById('userLng'),
    orderBtn: document.getElementById('orderBtn'),
    phoneInput: document.getElementById("customerPhone"),
    shopStatusToggle: document.getElementById('shopStatusToggle'),
    shopStatusText: document.getElementById('shopStatusText'),
    customerNameInput: document.getElementById('customerName'),
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

// Place Order Button
elements.orderBtn.addEventListener('click', () => {
    if (!isShopOpen) {
        showNotification("Cannot place orders when shop is closed", 'error');
        return;
    }

    const name = elements.customerNameInput.value.trim();
    const address = elements.customerAddressInput.value.trim();
    const phone = elements.phoneInput.value.trim();
    const lat = elements.userLatInput.value.trim();
    const lng = elements.userLngInput.value.trim();

    if (!name || !address || !phone || cart.length === 0) {
        showNotification("Please fill all details and add items to cart", 'error');
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showNotification("Please enter a valid 10-digit phone number", 'error');
        return;
    }

    const deliveryFeeText = document.getElementById('deliveryFee').textContent;
    if (deliveryFeeText.includes('Not Available')) {
        showNotification("Delivery not available for your location", 'error');
        return;
    }

    let deliveryFee = 0;
    if (deliveryFeeText !== 'FREE') {
        deliveryFee = parseInt(deliveryFeeText.replace('₹', '')) || 0;
    }

    let message = `*New Order from QuickKart!*%0A%0A`;
    message += `*Customer Details:*%0AName: ${name}%0AAddress: ${address}%0APhone: ${phone}%0A`;

    if (lat && lng) {
        message += `Location: https://www.google.com/maps?q=${lat},${lng}%0A`;
    }

    message += `%0A*Order Items:*%0A`;
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}%0A`;
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `%0A*Subtotal: ₹${subtotal}*%0A`;
    message += `*Delivery Fee: ₹${deliveryFee}*%0A`;
    message += `*Total: ₹${subtotal + deliveryFee}*%0A%0APlease confirm this order. Thank you!`;

    const whatsappNumber = "919716940448";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

    cart.length = 0;
    updateCartUI();
    closeCart();
});

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
            initStore(category, searchTerm);
        }, 300);
    });

    // Category filtering
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            initStore(category, searchTerm);
        });
    });

    elements.phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });

    elements.customerAddressInput.setAttribute('readonly', true);

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

// In your initializeApp() function:
function initializeApp() {
    resetCorruptedCart();
    initStore('all', '', elements.storeDiv);
    setupShopStatus(elements);
    setupLocation();
    setupEventListeners();
    elements.orderBtn.disabled = true;
    // Initial UI update - important!
    updateCartUI();
}

document.addEventListener('DOMContentLoaded', initializeApp);