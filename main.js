// main.js (REPLACE THIS ENTIRE FILE)

import { auth, setupShopStatus } from './firebase-config.js';
import { initStore, renderCategoryGrid, fetchTopSellers } from './store.js';
import { initLocation } from './location.js';
import { updateCartUI, openCart, closeCart, setupCartElements } from './cart.js';
import { showNotification } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- SPLASH SCREEN LOGIC ---
    const splashScreen = document.getElementById('splash-screen');
    const logoAnimated = document.querySelector('.logo-text-animated');

    if (splashScreen && logoAnimated) {
        const textQuick = 'Quick';
        const textKart = 'Kart';
        let html = '';
        let i = 0;

        for (const char of textQuick) {
            i++;
            html += `<span class="logo-char-animated" style="--i:${i};">${char}</span>`;
        }
        for (const char of textKart) {
            i++;
            html += `<span class="logo-char-animated kart" style="--i:${i};">${char}</span>`;
        }
        
        logoAnimated.innerHTML = html;

        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }, 2000);
    }
    
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
        mainSectionTitle: document.getElementById('mainSectionTitle'), // <-- UPDATED
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
        topSellersSection: document.querySelector('.top-sellers-section'),
    };
    
    const showProductView = (category, focusSearch = false) => {
        elements.body.classList.remove('category-view');

        if (elements.topSellersSection) elements.topSellersSection.style.display = 'none';

        elements.searchSection.classList.remove('hidden');
        elements.categoriesScroll.classList.remove('hidden');
        
        elements.logoBox.innerHTML = `<i class="fas fa-arrow-left"></i> Back`;
        elements.logoBox.style.cursor = 'pointer';
        elements.mainSectionTitle.textContent = category === 'all' ? 'All Products' : category; // <-- UPDATED
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

        renderTopSellers(); 
        
        elements.logoBox.innerHTML = `<span class="logo-text">Quick<span>Kart</span></span>`;
        elements.logoBox.style.cursor = 'default';
        elements.mainSectionTitle.textContent = 'Shop by Category'; // <-- UPDATED
        renderCategoryGrid(elements.storeDiv, showProductView);
        updateActiveNav(elements.navHome);
        window.scrollTo(0, 0);
    };
    
    const updateActiveNav = (activeButton) => {
        [elements.navHome, elements.navAllItems, elements.navSearch, elements.navCart].forEach(btn => btn.classList.remove('active'));
        if (activeButton) activeButton.classList.add('active');
    };

    async function renderTopSellers() {
        if (!elements.topSellersSection) return;

        const container = document.getElementById('topSellersContainer');
        const topSellers = await fetchTopSellers();

        if (topSellers.length === 0) {
            elements.topSellersSection.style.display = 'none';
            return;
        }
        
        elements.topSellersSection.style.display = 'block';
        container.innerHTML = ''; 

        topSellers.forEach(item => {
            const div = document.createElement('div');
            div.className = 'top-seller-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="top-seller-image" onerror="this.onerror=null;this.src='images/placeholder.png'">
                <span class="top-seller-name">${item.name}</span>
            `;
            div.addEventListener('click', () => {
                showProductView('all');
                elements.searchInput.value = item.name;
                elements.searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            });
            container.appendChild(div);
        });
    }
    
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
                elements.mainSectionTitle.textContent = searchTerm ? `Search results for "${searchTerm}"` : 'All Products'; // <-- UPDATED
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
    setupShopStatus(elements, closeCart); 
    setupAllEventListeners();
    setupCartElements(elements, { navCartCount: elements.navCartCount });
    initLocation();
    showCategoryView(); 
    updateCartUI(); 
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('ServiceWorker Registered with scope:', registration.scope))
                .catch(err => console.log('ServiceWorker Registration Failed:', err));
        });
    }
});