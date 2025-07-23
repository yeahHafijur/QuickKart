import cart from './cart-data.js';
import { showNotification, debugCart } from './utils.js';

let elements;

export function setupCartElements(el) {
    elements = el;
}

export function updateCartUI() {
    if (!elements) {
        console.error('Cart elements not initialized');
        return;
    }

    try {
        // Validate cart items
        const validCart = cart.filter(item => 
            item && 
            typeof item.quantity === 'number' && 
            item.quantity > 0 &&
            typeof item.price === 'number'
        );

        // Update cart reference
        cart.length = 0;
        cart.push(...validCart);

        elements.cartList.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            elements.cartEmpty.style.display = 'block';
            elements.cartFull.style.display = 'none';
            document.querySelector('.cart-summary').style.display = 'none';
        } else {
            elements.cartEmpty.style.display = 'none';
            elements.cartFull.style.display = 'block';
            document.querySelector('.cart-summary').style.display = 'block';

            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                const li = document.createElement('li');
                li.innerHTML = `
                    <div>${item.name} × ${item.quantity}</div>
                    <div>₹${itemTotal}</div>
                    <button class="remove-btn">🗑️</button>
                `;
                li.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(index));
                elements.cartList.appendChild(li);
            });
        }

        elements.itemTotal.textContent = `₹${total}`;
        elements.cartCount.textContent = totalItems;
        localStorage.setItem('quickKartCart', JSON.stringify(cart));
        debugCart();
    } catch (error) {
        console.error('Cart update failed:', error);
    }
}

export function removeFromCart(index) {
    try {
        const removedItem = cart.splice(index, 1)[0];
        showNotification(`${removedItem.name} removed from cart`);
        updateCartUI();
    } catch (error) {
        console.error('Remove item failed:', error);
    }
}

export function openCart() {
    document.body.classList.add('cart-open');
    elements.cartElement.classList.add('open');
    elements.cartOverlay.classList.add('show');
    updateCartUI(); // Force refresh
}

export function closeCart() {
    document.body.classList.remove('cart-open');
    elements.cartElement.classList.remove('open');
    elements.cartOverlay.classList.remove('show');
}

window.cart = cart;