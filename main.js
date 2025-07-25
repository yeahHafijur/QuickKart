import { setupShopStatus } from './firebase-config.js';
import { initStore, renderCategoryGrid } from './store.js';
import cart from './cart-data.js';
import { initLocation } from './location.js'
import {
    updateCartUI,
    openCart,
    closeCart,
    setupCartElements
} from './cart.js';
import { showNotification } from './utils.js';

// DOM Elements
const elements = {
    body: document.body,
    storeDiv: document.getElementById('storeItems'),
    cartList: document.getElementById('cartList'),
    cartTotal: document.getElementById('cartTotal'),
    itemTotal: document.getElementById('itemTotal'),
    closeCartBtn: document.getElementById('closeCart'),
    searchInput: document.getElementById('searchInput'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    cartElement: document.getElementById('cart'),
    cartEmpty: document.getElementById('cartEmpty'),
    cartFull: document.getElementById('cartFull'),
    continueShoppingBtn: document.getElementById('continueShopping'),
    cartOverlay: document.getElementById('cartOverlay'),
    placeOrderBtn: document.getElementById('placeOrderBtn'),
    shopStatusToggle: document.getElementById('shopStatusToggle'),
    shopStatusText: document.getElementById('shopStatusText'),
    resetCartBtn: document.getElementById('resetCartBtn'),
    searchSection: document.querySelector('.search-section'),
    categoriesScroll: document.querySelector('.categories-scroll'),
    sectionTitle: document.querySelector('.section-title'),
    logoBox: document.querySelector('.logo-box'),
    // Login Modal
    loginModal: document.getElementById('loginModal'),
    // Footer Elements
    navHome: document.getElementById('navHome'),
    navAllItems: document.getElementById('navAllItems'), 
    navSearch: document.getElementById('navSearch'),
    navCart: document.getElementById('navCart'),
    navCartCount: document.getElementById('navCartCount'),
    bottomNavBar: document.querySelector('.bottom-nav-bar')
};

// --- VIEW MANAGEMENT FUNCTIONS ---

function updateActiveNav(activeButton) {
    [elements.navHome, elements.navAllItems, elements.navSearch, elements.navCart].forEach(btn => {
        btn.classList.remove('active');
    });
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function showCategoryView() {
    elements.body.classList.add('category-view');
    elements.body.classList.remove('product-view');

    elements.searchSection.classList.add('hidden');
    elements.categoriesScroll.classList.add('hidden');
    
    elements.logoBox.innerHTML = `<span class="logo-text">Quick<span>Kart</span></span>`;
    elements.logoBox.style.cursor = 'default';

    elements.sectionTitle.textContent = 'Shop by Category';
    renderCategoryGrid(elements.storeDiv);
    updateActiveNav(elements.navHome);
    window.scrollTo(0, 0);
}

function showProductView(category, focusSearch = false) {
    elements.body.classList.remove('category-view');
    elements.body.classList.add('product-view');

    elements.searchSection.classList.remove('hidden');
    elements.categoriesScroll.classList.remove('hidden');
    
    elements.logoBox.innerHTML = `<i class="fas fa-arrow-left"></i> Back`;
    elements.logoBox.style.cursor = 'pointer';

    elements.sectionTitle.textContent = category === 'all' ? 'All Products' : category;
    initStore(category, '', elements.storeDiv);

    elements.categoryBtns.forEach(b => b.classList.remove('active'));
    
    if (category === 'all') {
        updateActiveNav(elements.navAllItems);
    } else {
        const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
    
    if (focusSearch) {
        elements.searchInput.focus();
        updateActiveNav(elements.navSearch);
    } else if (category !== 'all') { 
        updateActiveNav(elements.navHome);
    }

    window.scrollTo(0, 0);
}

window.showProductView = showProductView;


// Pass the nav elements to the setup function from cart.js
setupCartElements(elements, { navCartCount: elements.navCartCount });

// Make functions available globally
window.showNotification = showNotification;
window.updateCartUI = updateCartUI;

// Setup Event Listeners
function setupEventListeners() {
    
    const handleCloseCart = () => {
        closeCart();
        if (elements.body.classList.contains('category-view')) {
            updateActiveNav(elements.navHome);
        } else {
            if(document.activeElement === elements.searchInput){
                 updateActiveNav(elements.navSearch);
            } else if (document.querySelector('.category-btn.active')) {
                 updateActiveNav(elements.navHome);
            } else {
                updateActiveNav(elements.navAllItems);
            }
        }
    };

    elements.closeCartBtn.addEventListener('click', handleCloseCart);
    elements.continueShoppingBtn.addEventListener('click', handleCloseCart);
    elements.cartOverlay.addEventListener('click', handleCloseCart);
    
    elements.logoBox.addEventListener('click', () => {
        if (elements.body.classList.contains('product-view')) {
            showCategoryView();
        }
    });
    
    let searchTimer;
    elements.searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            // --- CHANGE: ALWAYS SEARCH IN 'all' CATEGORIES ---
            initStore('all', searchTerm, elements.storeDiv);
            
            // Visually deselect category buttons to indicate a global search
            if (searchTerm) {
                elements.categoryBtns.forEach(b => b.classList.remove('active'));
                elements.sectionTitle.textContent = `Search results for "${searchTerm}"`;
            } else {
                // If search is cleared, go back to 'All Products' view
                showProductView('all');
            }
        }, 300);
    });

    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            // Clear search input when a category is clicked
            elements.searchInput.value = '';
            showProductView(category);
        });
    });

    // --- FOOTER NAVIGATION LISTENERS ---
    elements.navHome.addEventListener('click', () => {
        closeCart();
        showCategoryView();
    });

    elements.navAllItems.addEventListener('click', () => {
        closeCart();
        elements.searchInput.value = '';
        showProductView('all');
    });
    
    elements.navSearch.addEventListener('click', () => {
        closeCart();
        if (!elements.body.classList.contains('product-view')) {
            showProductView('all', true);
        } else {
            elements.searchInput.focus();
            updateActiveNav(elements.navSearch);
        }
    });

    elements.navCart.addEventListener('click', () => {
        openCart();
        updateActiveNav(elements.navCart);
    });
}

// Initialize the app
function initializeApp() {
    setupShopStatus(elements);
    setupEventListeners();
    initLocation();
    
    showCategoryView();
    
    const popularSection = document.getElementById('popularItems')?.closest('.product-section');
    if(popularSection) popularSection.style.display = 'none';
    
    updateCartUI(); 
}

document.addEventListener('DOMContentLoaded', initializeApp);