import cart from './cart-data.js';
import { showNotification, debugCart } from './utils.js';

let elements;
let navElements = {}; 

export function setupCartElements(el, navEl = {}) {
    elements = el;
    navElements = navEl;
}

// Function to update an item's quantity from within the cart
function updateCartItemQuantity(index, change) {
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        // If quantity is 0 or less, remove the item
        cart.splice(index, 1);
    }
    
    updateCartUI();
}

export function updateCartUI() {
    if (!elements) {
        console.error('Cart elements not initialized');
        return;
    }

    try {
        const validCart = cart.filter(item => 
            item && 
            typeof item.quantity === 'number' && 
            item.quantity > 0 &&
            typeof item.price === 'number'
        );

        cart.length = 0;
        cart.push(...validCart);

        elements.cartList.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            elements.cartEmpty.style.display = 'flex';
            elements.cartFull.style.display = 'none';
        } else {
            elements.cartEmpty.style.display = 'none';
            elements.cartFull.style.display = 'block';

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                const li = document.createElement('li');
                li.className = 'cart-item'; // Add class for styling
                
                const imageSrc = item.image || 'images/placeholder.png';

                li.innerHTML = `
                    <img src="${imageSrc}" alt="${item.name}" class="cart-item-image" onerror="this.onerror=null;this.src='images/placeholder.png'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="qty-minus">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-plus">+</button>
                            </div>
                            <div class="cart-item-total">₹${itemTotal}</div>
                        </div>
                    </div>
                    <button class="remove-btn">🗑️</button>
                `;
                
                // Event listeners for new controls
                li.querySelector('.qty-minus').addEventListener('click', () => updateCartItemQuantity(index, -1));
                li.querySelector('.qty-plus').addEventListener('click', () => updateCartItemQuantity(index, 1));
                li.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(index));

                elements.cartList.appendChild(li);
            });
        }

        // Yeh "Item Total" ko update karta hai
        elements.itemTotal.textContent = `₹${total}`;
        
        // ==========================================================
        // YEH LINE ADD KI GAYI HAI FINAL TOTAL KO UPDATE KARNE KE LIYE
        // ==========================================================
        elements.cartTotal.textContent = `₹${total}`;
        
        // Yeh neeche navigation bar ke cart count ko update karta hai
        if (navElements.navCartCount) {
            navElements.navCartCount.textContent = totalItems;
            navElements.navCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        localStorage.setItem('quickKartCart', JSON.stringify(cart));
        debugCart();
    } catch (error) {
        console.error('Cart update failed:', error);
    }
}

export function removeFromCart(index) {
    try {
        const removedItem = cart.splice(index, 1)[0];
        showNotification(`${removedItem.name} cart se hata diya gaya`);
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

window.cart = cart;