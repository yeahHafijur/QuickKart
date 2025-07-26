// store.js (REPLACE THIS ENTIRE FILE)

import { isShopOpen, db } from './firebase-config.js'; 
import cart from './cart-data.js';
import { showNotification } from './utils.js';
import { updateCartUI } from './cart.js';

function animateToCart(itemElement) {
    const cartIcon = document.querySelector('#navCart');
    const itemImage = itemElement.querySelector('.item-img');
    if (!itemImage || !cartIcon) return;
    const startRect = itemImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    const flyingAnim = document.createElement('div');
    flyingAnim.className = 'cart-animation';
    flyingAnim.style.backgroundImage = `url('${itemImage.src}')`;
    flyingAnim.style.left = `${startRect.left}px`;
    flyingAnim.style.top = `${startRect.top}px`;
    flyingAnim.style.width = `${startRect.width}px`;
    flyingAnim.style.height = `${startRect.height}px`;
    document.body.appendChild(flyingAnim);
    flyingAnim.offsetWidth;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    flyingAnim.style.transform = `translate(${endX - startRect.left - startRect.width / 2}px, ${endY - startRect.top - startRect.height / 2}px) scale(0.1)`;
    flyingAnim.style.opacity = '0';
    setTimeout(() => flyingAnim.remove(), 800);
}

function addToCart(itemElement) {
    if (!isShopOpen) {
        showNotification('Shop is currently closed', 'error');
        return;
    }
    if (!itemElement || !itemElement.dataset.item) {
        console.error('Invalid item element for cart');
        return;
    }
    try {
        const itemData = JSON.parse(itemElement.dataset.item);
        const quantity = parseInt(itemElement.querySelector('.quantity-control span').textContent);
        let notificationMessage = '';
        let notificationType = 'success';
        const existingItem = cart.find(item => item.name === itemData.name);
        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + quantity, 100);
            notificationMessage = `${itemData.name} quantity updated to ${existingItem.quantity}`;
            notificationType = 'info';
        } else {
            cart.push({ ...itemData, quantity: Math.min(quantity, 100) });
            notificationMessage = `${quantity} × ${itemData.name} added to cart`;
            notificationType = 'success';
        }
        animateToCart(itemElement);
        itemElement.querySelector('.quantity-control span').textContent = '1';
        showNotification(notificationMessage, notificationType);
        updateCartUI();
    } catch (error) {
        console.error('Add to cart failed:', error);
        showNotification('Failed to add item. Please try again.', 'error');
    }
}

function updateQuantity(itemElement, change) {
    const quantitySpan = itemElement.querySelector('.quantity-control span');
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(1, Math.min(quantity + change, 10));
    quantitySpan.textContent = quantity;
}

function createSkeletonItem() {
    const div = document.createElement('div');
    div.className = 'skeleton-item';
    div.innerHTML = `<div class="skeleton sk-img"></div><div class="skeleton-details"><div class="skeleton sk-text"></div><div class="skeleton sk-text" style="width: 70%;"></div><div class="skeleton sk-price"></div><div class="skeleton sk-button"></div></div>`;
    return div;
}

function showSkeletons(storeDiv, count = 8) {
    storeDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        storeDiv.appendChild(createSkeletonItem());
    }
}

async function initStore(filterCategory = 'all', searchTerm = '', storeDiv) {
    if (!storeDiv) return;
    showSkeletons(storeDiv);
    try {
        const snapshot = await db.ref('products').once('value');
        const allItemsObject = snapshot.val();
        const items = allItemsObject ? Object.entries(allItemsObject).map(([key, value]) => ({...value, key})) : [];
        setTimeout(() => {
            storeDiv.innerHTML = '';
            const filteredItems = items.filter(item => {
                const searchStr = searchTerm.toLowerCase();
                const matchesCategory = filterCategory === 'all' || (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());
                const matchesSearch = searchTerm === '' || (item.name && item.name.toLowerCase().includes(searchStr)) || (item.category && item.category.toLowerCase().includes(searchStr));
                return matchesCategory && matchesSearch;
            });

            if (filteredItems.length === 0) {
                storeDiv.innerHTML = `<div class="empty-cart" style="grid-column: 1 / -1;"><img src="images/empty-search.png" alt="No items found" style="width: 150px;"><h3>No items found</h3><p>Try a different search term or category.</p></div>`;
                return;
            }

            filteredItems.forEach(item => {
                const div = document.createElement('div');
                const isInStock = item.inStock !== false;
                div.className = `item ${isInStock ? '' : 'item-out-of-stock'}`;
                div.dataset.item = JSON.stringify(item);

                const actionHtml = isInStock ? `
                    <div class="quantity-control">
                        <button class="qty-minus">-</button>
                        <span>1</span>
                        <button class="qty-plus">+</button>
                    </div>
                    <button class="add-to-cart-btn">Add</button>
                ` : `
                    <div class="out-of-stock-label">Out of Stock</div>
                `;

                div.innerHTML = `
                    <div class="item-image-container">
                        <img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.onerror=null;this.src='images/placeholder.png'">
                    </div>
                    <div class="item-details">
                        <div>
                          <h3 class="item-name">${item.name}</h3>
                          <div class="item-price">₹${item.price}</div>
                        </div>
                        <div class="item-actions">
                            ${actionHtml}
                        </div>
                    </div>
                `;

                if (isInStock) {
                    div.querySelector('.qty-minus').addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(div, -1); });
                    div.querySelector('.qty-plus').addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(div, 1); });
                    div.querySelector('.add-to-cart-btn').addEventListener('click', (e) => { e.stopPropagation(); addToCart(div); });
                }
                storeDiv.appendChild(div);
            });
        }, 150);
    } catch (error) {
        console.error("Error fetching products from Firebase: ", error);
        storeDiv.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">Could not load products. Please try again later.</p>`;
    }
}

async function renderCategoryGrid(storeDiv, onCategoryClick) {
    if (!storeDiv) return;
    showSkeletons(storeDiv);
    setTimeout(() => {
        storeDiv.innerHTML = '';
        const categoryButtons = document.querySelectorAll('.categories .category-btn');
        const uniqueCategories = Array.from(categoryButtons).map(btn => ({ name: btn.dataset.category, image: btn.querySelector('.category-image')?.src || 'images/placeholder.png' })).filter(Boolean);
        uniqueCategories.forEach(category => {
            if (!category.name) return;
            const div = document.createElement('div');
            div.className = 'item category-grid-item';
            div.dataset.category = category.name;
            div.innerHTML = `<div class="item-image-container"><img src="${category.image}" alt="${category.name}" class="item-img" onerror="this.onerror=null;this.src='images/placeholder.png'"></div><div class="item-details"><h3 class="item-name">${category.name}</h3></div>`;
            div.addEventListener('click', () => {
                if (typeof onCategoryClick === 'function') {
                    onCategoryClick(category.name);
                }
            });
            storeDiv.appendChild(div);
        });
    }, 150);
}

export { initStore, renderCategoryGrid };