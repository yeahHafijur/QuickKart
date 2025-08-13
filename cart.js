// cart.js (REPLACE ENTIRE FILE WITH THIS CODE)

import cart from './cart-data.js';
import { showNotification, debugCart } from './utils.js';
import { auth } from './firebase-config.js';

let elements;
let navElements = {}; 

function setupClearCart() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Cart is already empty', 'info');
                return;
            }
            
            const confirmed = confirm('Are you sure you want to remove all items from the cart?');
            if (confirmed) {
                cart.length = 0;
                showNotification('Cart has been cleared', 'info');
                updateCartUI();
            }
        });
    }
}

export function setupCartElements(el, navEl = {}) {
    elements = el;
    navElements = navEl;
    setupClearCart();

    const loginBtn = document.getElementById('loginToOrderBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // YEH LINE ZAROORI HAI
            sessionStorage.setItem('loginRedirectToCart', 'true');
            window.location.href = 'profile.html';
        });
    }
}

function updateCartItemQuantity(index, change) {
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

export function updateCartUI() {
    if (!elements) {
        return;
    }
    try {
        const validCart = cart.filter(item => 
            item && typeof item.quantity === 'number' && item.quantity > 0 && typeof item.price === 'number'
        );
        cart.length = 0;
        cart.push(...validCart);
        elements.cartList.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        const clearCartBtn = document.getElementById('clearCartBtn');
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const loginToOrderBtn = document.getElementById('loginToOrderBtn');
        const locationStatus = document.getElementById('locationStatus');

        if (cart.length === 0) {
            elements.cartEmpty.style.display = 'flex';
            elements.cartFull.style.display = 'none';
            if(clearCartBtn) clearCartBtn.style.display = 'none';
        } else {
            elements.cartEmpty.style.display = 'none';
            elements.cartFull.style.display = 'block';
            if(clearCartBtn) clearCartBtn.style.display = 'flex';
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;
                const li = document.createElement('li');
                li.className = 'cart-item';
                const imageSrc = item.image || 'images/placeholder.png';
                li.innerHTML = `<img src="${imageSrc}" alt="${item.name}" class="cart-item-image" onerror="this.onerror=null;this.src='images/placeholder.png'"><div class="cart-item-details"><div class="cart-item-name">${item.name}</div><div class="cart-item-price">₹${item.price}</div><div class="cart-item-actions"><div class="quantity-control"><button class="qty-minus">-</button><span>${item.quantity}</span><button class="qty-plus">+</button></div><div class="cart-item-total">₹${itemTotal}</div></div></div><button class="remove-btn"><i class="fas fa-trash-alt"></i></button>`;
                li.querySelector('.qty-minus').addEventListener('click', () => updateCartItemQuantity(index, -1));
                li.querySelector('.qty-plus').addEventListener('click', () => updateCartItemQuantity(index, 1));
                li.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(index));
                elements.cartList.appendChild(li);
            });
        }

        elements.itemTotal.textContent = `₹${total}`;
        elements.cartTotal.textContent = `₹${total}`;

        const currentUser = auth.currentUser;
        if (currentUser) {
            loginToOrderBtn.style.display = 'none';
            placeOrderBtn.style.display = 'flex';
            placeOrderBtn.disabled = false;
        } else {
            loginToOrderBtn.style.display = 'flex';
            placeOrderBtn.style.display = 'none';
        }

        if (total < 50 && cart.length > 0) {
            placeOrderBtn.disabled = true;
            locationStatus.textContent = `Add ₹${50 - total} more to place order.`;
        } else if (currentUser) {
            locationStatus.textContent = '';
        } else {
            locationStatus.textContent = 'Please login to continue.';
        }
        
        if (navElements.navCartCount) {
            navElements.navCartCount.textContent = totalItems;
            navElements.navCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        localStorage.setItem('quickKartCart', JSON.stringify(cart));
        debugCart(cart);

    } catch (error) {
        console.error('Cart update failed:', error);
    }
}

export function removeFromCart(index) {
    try {
        const removedItem = cart.splice(index, 1)[0];
        showNotification(`${removedItem.name} removed from cart`, 'info');
        updateCartUI();
    } catch (error) {
        console.error('Remove item failed:', error);
    }
}

export function openCart() {
    document.body.classList.add('cart-open');
    elements.cartElement.classList.add('open');
    elements.cartOverlay.classList.add('show');
    updateCartUI();
}

export function closeCart() {
    document.body.classList.remove('cart-open');
    elements.cartElement.classList.remove('open');
    elements.cartOverlay.classList.remove('show');
}