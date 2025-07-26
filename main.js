// main.js (REPLACE THIS ENTIRE FILE)

import { auth, setupShopStatus } from './firebase-config.js';
import { initStore, renderCategoryGrid } from './store.js';
import { initLocation } from './location.js';
import { updateCartUI, openCart, closeCart, setupCartElements } from './cart.js';
import { showNotification } from './utils.js';

// --- MAIN APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    
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
        searchSection: document.querySelector('.search-section'),
        categoriesScroll: document.querySelector('.categories-scroll'),
        sectionTitle: document.querySelector('.section-title'),
        logoBox: document.querySelector('.logo-box'),
        loginModal: document.getElementById('loginModal'),
        loginForm: document.getElementById('loginForm'),
        closeLoginBtn: document.getElementById('closeLogin'),
        loginError: document.getElementById('loginError'),
        logoutBtn: document.getElementById('logoutBtn'),
        adminPanelBtn: document.getElementById('adminPanelBtn'),
        navHome: document.getElementById('navHome'),
        navAllItems: document.getElementById('navAllItems'), 
        navSearch: document.getElementById('navSearch'),
        navCart: document.getElementById('navCart'),
        navCartCount: document.getElementById('navCartCount'),
    };
    
    const showProductView = (category, focusSearch = false) => {
        elements.body.classList.remove('category-view');
        elements.searchSection.classList.remove('hidden');
        elements.categoriesScroll.classList.remove('hidden');
        elements.logoBox.innerHTML = `<i class="fas fa-arrow-left"></i> Back`;
        elements.logoBox.style.cursor = 'pointer';
        elements.sectionTitle.textContent = category === 'all' ? 'All Products' : category;
        initStore(category, '', elements.storeDiv);
        elements.categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === category));
        if (category !== 'all') {
            const activeBtn = document.querySelector(`.category-btn.active`);
            activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
        if (focusSearch) elements.searchInput.focus();
        const activeNav = focusSearch ? elements.navSearch : (category === 'all' ? elements.navAllItems : elements.navHome);
        updateActiveNav(activeNav);
        window.scrollTo(0, 0);
    };

    const showCategoryView = () => {
        elements.body.classList.add('category-view');
        elements.searchSection.classList.add('hidden');
        elements.categoriesScroll.classList.add('hidden');
        elements.logoBox.innerHTML = `<span class="logo-text">Quick<span>Kart</span></span>`;
        elements.logoBox.style.cursor = 'default';
        elements.sectionTitle.textContent = 'Shop by Category';
        renderCategoryGrid(elements.storeDiv, showProductView);
        updateActiveNav(elements.navHome);
        window.scrollTo(0, 0);
    };
    
    const updateActiveNav = (activeButton) => {
        [elements.navHome, elements.navAllItems, elements.navSearch, elements.navCart].forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeButton) activeButton.classList.add('active');
    };
    
    function setupAllEventListeners() {
        const handleCloseCart = () => {
            closeCart();
            const lastActive = document.querySelector('.bottom-nav-bar .nav-btn.active');
            updateActiveNav(lastActive);
        };

        elements.closeCartBtn.addEventListener('click', handleCloseCart);
        elements.continueShoppingBtn.addEventListener('click', handleCloseCart);
        elements.cartOverlay.addEventListener('click', handleCloseCart);
        
        elements.logoBox.addEventListener('click', () => {
            if (!elements.body.classList.contains('category-view')) showCategoryView();
        });
        
        let searchTimer;
        elements.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                const searchTerm = elements.searchInput.value.trim().toLowerCase();
                initStore('all', searchTerm, elements.storeDiv);
                elements.categoryBtns.forEach(b => b.classList.remove('active'));
                elements.sectionTitle.textContent = searchTerm ? `Search results for "${searchTerm}"` : 'All Products';
            }, 300);
        });

        elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.searchInput.value = '';
                showProductView(btn.dataset.category);
            });
        });

        elements.navHome.addEventListener('click', () => { closeCart(); showCategoryView(); });
        elements.navAllItems.addEventListener('click', () => { closeCart(); showProductView('all'); });
        elements.navSearch.addEventListener('click', () => { closeCart(); showProductView('all', true); });
        elements.navCart.addEventListener('click', () => { openCart(); updateActiveNav(elements.navCart); });
        
        elements.logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => showNotification('You have been logged out.', 'info'));
        });
        elements.adminPanelBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Initialize the App
    setupShopStatus(elements); 
    setupAllEventListeners();
    setupCartElements(elements, { navCartCount: elements.navCartCount });
    initLocation();
    showCategoryView(); 
    updateCartUI(); 
});