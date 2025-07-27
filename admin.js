




// admin.js (Dashboard with Filters and Breakdown Added)

import { db, auth, storage } from './firebase-config.js';

let allProducts = [];
let allOrders = []; // Saare orders ko store karne ke liye

// === DOM ELEMENTS ===
const navButtons = {
    viewProducts: document.getElementById('navViewProducts'),
    addProduct: document.getElementById('navAddProduct'),
    orderHistory: document.getElementById('navOrderHistory'),
    dashboard: document.getElementById('navDashboard'),
};
const sections = {
    productList: document.getElementById('productListSection'),
    addProduct: document.getElementById('addProductSection'),
    orderHistory: document.getElementById('orderHistorySection'),
    dashboard: document.getElementById('dashboardSection'),
};
const addProductForm = document.getElementById('addProductForm');
const productListDiv = document.getElementById('productList');
const submitProductBtn = document.getElementById('submitProductBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const editingIdInput = document.getElementById('editingId');
const categoryList = document.getElementById('categoryList');
const adminSearchInput = document.getElementById('adminSearchInput');
const orderListDiv = document.getElementById('orderList');
const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');

// Dashboard Filter Elements
const filterButtons = document.querySelectorAll('.filter-btn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const applyDateRangeBtn = document.getElementById('applyDateRange');

// === AUTHENTICATION & INITIALIZATION ===
document.body.style.display = 'none';
auth.onAuthStateChanged(user => {
    if (user) {
        document.body.style.display = 'block';
        fetchAndRenderProducts(); 
        fetchAndRenderOrders(); 
        setupNewOrderNotifications();
        showSection('dashboard');
    } else {
        window.location.href = 'index.html';
    }
});

// === NAVIGATION LOGIC ===
function showSection(sectionToShow) {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    Object.values(navButtons).forEach(button => button.classList.remove('active'));
    if (sectionToShow === 'addProduct') { sections.addProduct.classList.add('active'); navButtons.addProduct.classList.add('active'); } 
    else if (sectionToShow === 'orderHistory') { sections.orderHistory.classList.add('active'); navButtons.orderHistory.classList.add('active'); } 
    else if (sectionToShow === 'dashboard') { sections.dashboard.classList.add('active'); navButtons.dashboard.classList.add('active'); } 
    else { sections.productList.classList.add('active'); navButtons.viewProducts.classList.add('active'); }
}
navButtons.viewProducts.addEventListener('click', () => showSection('productList'));
navButtons.addProduct.addEventListener('click', () => { resetForm(); showSection('addProduct'); });
navButtons.orderHistory.addEventListener('click', () => showSection('orderHistory'));
navButtons.dashboard.addEventListener('click', () => showSection('dashboard'));

// === ORDER HISTORY & DATA FETCHING ===
function renderOrders(orders) {
    if (!orderListDiv) return;
    orderListDiv.innerHTML = '';
    if (orders.length === 0) {
        orderListDiv.innerHTML = '<p>No orders found.</p>';
        return;
    }
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-list-item';
        const itemsHtml = order.items.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}</li>`).join('');
        const orderDate = new Date(order.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        let completeButtonHtml = '';
        if (order.status !== 'Completed') {
            completeButtonHtml = `<button class="admin-btn-complete" data-id="${order.key}">Mark Completed</button>`;
        }
        const statusClass = order.status ? order.status.toLowerCase() : 'pending';
        orderCard.innerHTML = `<div class="order-header"><span class="order-customer">${order.customerName}</span><span class="order-date">${orderDate}</span></div><div class="order-details"><p><strong>Phone:</strong> ${order.customerPhone}</p><p><strong>Address:</strong> ${order.address}</p><p><strong>Total:</strong> ₹${order.totalAmount} (Delivery: ₹${order.deliveryFee})</p><strong>Items:</strong><ul>${itemsHtml}</ul></div><div class="order-footer"><span>Status: <strong id="status-${order.key}" class="status-badge ${statusClass}">${order.status}</strong></span><div class="order-buttons">${completeButtonHtml}<button class="admin-btn-delete-order" data-id="${order.key}">Delete</button></div></div>`;
        orderListDiv.appendChild(orderCard);
    });
}
async function fetchAndRenderOrders() {
    if (!orderListDiv) return;
    orderListDiv.innerHTML = '<p>Loading orders...</p>';
    try {
        db.ref('orders').on('value', (snapshot) => {
            const ordersObject = snapshot.val();
            allOrders = ordersObject ? Object.entries(ordersObject).map(([key, value]) => ({...value, key})) : [];
            renderOrders(allOrders);
            generateDashboardData();
            isInitialOrdersLoaded = true;
        });
    } catch (error) { console.error("Error loading orders:", error); orderListDiv.innerHTML = '<p>Could not load orders.</p>'; }
}
orderListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('admin-btn-delete-order')) {
        const orderId = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this order history?')) {
            db.ref(`orders/${orderId}`).remove().then(() => alert('Order deleted successfully.')).catch(error => alert(`Failed to delete order: ${error.message}`));
        }
    }
    if (e.target.classList.contains('admin-btn-complete')) {
        const orderId = e.target.getAttribute('data-id');
        db.ref(`orders/${orderId}`).update({ status: 'Completed' }).then(() => {
            alert('Order marked as Completed!');
        }).catch(error => alert(`Failed to update status: ${error.message}`));
    }
});

// === NEW ORDER NOTIFICATION ===
let isInitialOrdersLoaded = false;
const notificationSound = new Audio('notification.mp3');
function setupNewOrderNotifications() {
    db.ref('orders').on('child_added', () => { if (isInitialOrdersLoaded) { notificationSound.play().catch(() => alert('🔔 New Order Received!')); } });
}

// === PRODUCT MANAGEMENT FUNCTIONS ===
function resetForm() {
    addProductForm.reset();
    editingIdInput.value = '';
    formTitle.textContent = 'Add New Product';
    submitProductBtn.textContent = 'Add Product';
    cancelEditBtn.style.display = 'none';
}
function populateCategoryDropdown() {
    const categories = new Set(allProducts.map(p => p.category).filter(Boolean));
    categoryList.innerHTML = '';
    categories.forEach(cat => { const option = document.createElement('option'); option.value = cat; categoryList.appendChild(option); });
}
function renderProducts(searchTerm = '') {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredProducts = allProducts.filter(product => product.name && product.name.toLowerCase().includes(lowerCaseSearchTerm));
    productListDiv.innerHTML = '';
    if (filteredProducts.length === 0) { productListDiv.innerHTML = '<p>No products found.</p>'; return; }
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-list-item';
        const isInStock = product.inStock !== false;
        productCard.innerHTML = `<img src="${product.image}" alt="${product.name}" class="product-list-img"><div class="product-list-details"><p class="product-list-name">${product.name}</p><p class="product-list-price">₹${product.price}</p><p class="product-list-category">Category: ${product.category || 'N/A'}</p></div><div class="product-list-actions"><div class="stock-toggle"><label class="switch-small"><input type="checkbox" class="stock-status-checkbox" data-id="${product.key}" ${isInStock ? 'checked' : ''}><span class="slider-small round"></span></label><span class="stock-label">${isInStock ? 'In Stock' : 'Out of Stock'}</span></div><div class="product-buttons"><button class="admin-btn-edit" data-id="${product.key}">Edit</button><button class="admin-btn-delete" data-id="${product.key}">Delete</button></div></div>`;
        productListDiv.appendChild(productCard);
    });
}
async function fetchAndRenderProducts() {
    productListDiv.innerHTML = '<p>Loading products...</p>';
    try {
        const snapshot = await db.ref('products').once('value');
        const productsObject = snapshot.val();
        allProducts = productsObject ? Object.entries(productsObject).map(([key, value]) => ({...value, key})) : [];
        renderProducts(adminSearchInput.value);
        populateCategoryDropdown();
    } catch (error) { console.error("Error loading products:", error); productListDiv.innerHTML = '<p>Could not load products.</p>'; }
}

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = Number(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const imageUrl = document.getElementById('productImageUrl').value.trim();
    const editingId = editingIdInput.value;
    if (!name || !price || !category) { alert('Please fill all text fields.'); return; }
    submitProductBtn.textContent = 'Saving...'; submitProductBtn.disabled = true;
    try {
        if (editingId) {
            await db.ref(`products/${editingId}`).update({ name, price, category, image: imageUrl });
            alert('Product updated successfully!');
        } else {
            if (!imageUrl) { alert('Please paste an image URL.'); submitProductBtn.disabled = false; submitProductBtn.textContent = 'Add Product'; return; }
            const productsSnapshot = await db.ref('products').orderByKey().limitToLast(1).once('value');
            let lastProductNumber = 100;
            if (productsSnapshot.exists()) {
                const lastProductKey = Object.keys(productsSnapshot.val())[0];
                const numberPart = lastProductKey.replace('product', '');
                if (!isNaN(parseInt(numberPart))) { lastProductNumber = parseInt(numberPart); }
            }
            const newProductNumber = lastProductNumber + 1;
            const newProductKey = `product${newProductNumber}`;
            await db.ref(`products/${newProductKey}`).set({ name: name, price, category, image: imageUrl, inStock: true });
            alert('Product added successfully!');
        }
        await fetchAndRenderProducts();
        showSection('productList');
    } catch (error) {
        console.error("Error saving product:", error);
        alert('Failed to save product. Check console for details.');
    } finally {
        submitProductBtn.disabled = false;
        resetForm();
    }
});

cancelEditBtn.addEventListener('click', () => { resetForm(); showSection('productList'); });

productListDiv.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('admin-btn-delete')) {
        const productId = target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this product?')) {
            db.ref(`products/${productId}`).remove().then(() => { alert('Product deleted successfully.'); fetchAndRenderProducts(); }).catch(() => alert('Failed to delete product.'));
        }
    }
    if (target.classList.contains('admin-btn-edit')) {
        const productId = target.getAttribute('data-id');
        const productToEdit = allProducts.find(p => p.key === productId);
        if (productToEdit) {
            document.getElementById('productName').value = productToEdit.name;
            document.getElementById('productPrice').value = productToEdit.price;
            document.getElementById('productCategory').value = productToEdit.category;
            document.getElementById('productImageUrl').value = productToEdit.image;
            editingIdInput.value = productId;
            formTitle.textContent = 'Edit Product';
            submitProductBtn.textContent = 'Update Product';
            cancelEditBtn.style.display = 'block';
            showSection('addProduct');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
productListDiv.addEventListener('change', async (e) => {
    const target = e.target;
    if (target.classList.contains('stock-status-checkbox')) {
        const productId = target.getAttribute('data-id');
        const newStatus = target.checked;
        try {
            await db.ref(`products/${productId}`).update({ inStock: newStatus });
            const label = target.closest('.stock-toggle').querySelector('.stock-label');
            label.textContent = newStatus ? 'In Stock' : 'Out of Stock';
            const productInArray = allProducts.find(p => p.key === productId);
            if(productInArray) productInArray.inStock = newStatus;
        } catch (error) { console.error('Error updating stock status:', error); target.checked = !newStatus; }
    }
});
adminSearchInput.addEventListener('input', (e) => renderProducts(e.target.value));

enableNotificationsBtn.addEventListener('click', () => { askForNotificationPermission(); });
async function askForNotificationPermission() {
    try {
        const permissionResult = await Notification.requestPermission();
        if (permissionResult !== 'granted') { throw new Error('Notification permission not granted.'); }
        const swRegistration = await navigator.serviceWorker.ready;
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BFHMLoX5Cda3QW4O1-J6zZc4n4x8S-63i-m2A3R-l_C6A4S-d5v3v6Z8A6B8D-g2E-h5j7k9L1m3N5')
        });
        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = JSON.stringify(subscription);
            db.ref(`admin_tokens/${currentUser.uid}`).set(token);
            alert('Notifications have been enabled successfully!');
        } else { alert('Please login to enable notifications.'); }
    } catch (error) { console.error('Failed to enable notifications:', error); alert('Could not enable notifications. Check console for errors.'); }
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
    return outputArray;
}
// === DASHBOARD DATA GENERATION (UPDATED WITH FILTERS) ===
function generateDashboardData(startDate = null, endDate = null) {
    const itemTotalEl = document.getElementById('itemTotalSales');
    const deliveryFeeEl = document.getElementById('totalDeliveryFees');
    const totalSalesEl = document.getElementById('totalSales');
    const totalOrdersEl = document.getElementById('totalOrders');
    const topItemsList = document.getElementById('topSellingItems');
    
    if (!allOrders.length) {
        itemTotalEl.textContent = '₹0';
        deliveryFeeEl.textContent = '₹0';
        totalSalesEl.textContent = '₹0';
        totalOrdersEl.textContent = '0';
        topItemsList.innerHTML = '<p>No sales data yet.</p>';
        return;
    }

    const filteredOrders = allOrders.filter(order => {
        if (!startDate || !endDate) return true;
        const orderDate = new Date(order.timestamp);
        return orderDate >= startDate && orderDate <= endDate;
    });

    const totalSales = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalDeliveryFees = filteredOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);
    const itemTotalSales = totalSales - totalDeliveryFees;
    const totalOrders = filteredOrders.length;
    
    itemTotalEl.textContent = `₹${itemTotalSales.toFixed(2)}`;
    deliveryFeeEl.textContent = `₹${totalDeliveryFees.toFixed(2)}`;
    totalSalesEl.textContent = `₹${totalSales.toFixed(2)}`;
    totalOrdersEl.textContent = totalOrders;
    
    const itemCounts = {};
    filteredOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const cleanName = item.name.replace(/\(P\d+\)\s/, '');
                itemCounts[cleanName] = (itemCounts[cleanName] || 0) + item.quantity;
            });
        }
    });
    const sortedItems = Object.entries(itemCounts).sort(([, qtyA], [, qtyB]) => qtyB - qtyA).slice(0, 10);
    
    topItemsList.innerHTML = '';
    if (sortedItems.length === 0) {
        topItemsList.innerHTML = '<p>No items sold in this period.</p>';
        return;
    }
    sortedItems.forEach(([name, quantity]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'top-item';
        itemDiv.innerHTML = `<span class="top-item-name">${name}</span><span class="top-item-qty">${quantity} units sold</span>`;
        topItemsList.appendChild(itemDiv);
    });
}

// === DASHBOARD FILTER EVENT LISTENERS ===
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const range = button.dataset.range;
        const now = new Date();
        let startDate, endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);

        if (range === 'today') {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
        } else if (range === 'week') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            startDate.setHours(0, 0, 0, 0);
        } else if (range === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
        } else {
            startDate = null;
            endDate = null;
        }
        
        startDateInput.value = '';
        endDateInput.value = '';
        generateDashboardData(startDate, endDate);
    });
});

applyDateRangeBtn.addEventListener('click', () => {
    const start = startDateInput.value;
    const end = endDateInput.value;
    if (!start || !end) {
        alert('Please select both a start and end date.');
        return;
    }
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    generateDashboardData(startDate, endDate);
});