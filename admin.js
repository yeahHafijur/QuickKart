// admin.js (COMPLETE AND UPDATED CODE WITH COUPON FEATURE)

import { db, auth, storage } from './firebase-config.js';

let allProducts = [];
let allOrders = [];
let allUsers = []; // All users ko store karne ke liye

// === DOM ELEMENTS ===
const navButtons = {
    viewProducts: document.getElementById('navViewProducts'),
    addProduct: document.getElementById('navAddProduct'),
    orderHistory: document.getElementById('navOrderHistory'),
    dashboard: document.getElementById('navDashboard'),
    coupons: document.getElementById('navCoupons'), // Coupon button
};
const sections = {
    productListSection: document.getElementById('productListSection'),
    addProductSection: document.getElementById('addProductSection'),
    orderHistorySection: document.getElementById('orderHistorySection'),
    dashboardSection: document.getElementById('dashboardSection'),
    couponSection: document.getElementById('couponSection'), // Coupon section
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
const filterButtons = document.querySelectorAll('.filter-btn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const applyDateRangeBtn = document.getElementById('applyDateRange');
// Coupon section elements
const userSearchInput = document.getElementById('userSearchInput');
const userListDiv = document.getElementById('userList');


// === AUTHENTICATION & INITIALIZATION ===
document.body.style.display = 'none';
auth.onAuthStateChanged(user => {
    if (user) {
        document.body.style.display = 'block';
        fetchAndRenderProducts();
        fetchAndRenderOrders();
        fetchAllUsers(); // Users ko fetch karein
        setupNewOrderNotifications();
        showSection('dashboardSection'); // Default dashboard dikhayein
    } else {
        window.location.href = 'index.html';
    }
});

// === NAVIGATION LOGIC ===
function showSection(sectionId) {
    Object.values(sections).forEach(section => section.classList.remove('active'));
    Object.values(navButtons).forEach(button => button.classList.remove('active'));
    
    if (sections[sectionId]) {
        sections[sectionId].classList.add('active');
    }

    if (sectionId === 'productListSection') navButtons.viewProducts.classList.add('active');
    else if (sectionId === 'addProductSection') navButtons.addProduct.classList.add('active');
    else if (sectionId === 'orderHistorySection') navButtons.orderHistory.classList.add('active');
    else if (sectionId === 'dashboardSection') navButtons.dashboard.classList.add('active');
    else if (sectionId === 'couponSection') navButtons.coupons.classList.add('active'); // Coupon nav
}
navButtons.viewProducts.addEventListener('click', () => showSection('productListSection'));
navButtons.addProduct.addEventListener('click', () => { resetForm(); showSection('addProductSection'); });
navButtons.orderHistory.addEventListener('click', () => showSection('orderHistorySection'));
navButtons.dashboard.addEventListener('click', () => showSection('dashboardSection'));
navButtons.coupons.addEventListener('click', () => showSection('couponSection')); // Coupon nav listener


// === ORDER HISTORY & DATA FETCHING ===
function renderOrders(orders) {
    if (!orderListDiv) return;
    orderListDiv.innerHTML = '';
    if (orders.length === 0) {
        orderListDiv.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    orders.sort((a, b) => {
        const statusOrder = { 'Pending': 1, 'Confirmed': 2, 'Completed': 3 };
        return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4) || new Date(b.timestamp) - new Date(a.timestamp);
    });

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        const statusClass = (order.status || 'pending').toLowerCase();
        orderCard.className = `order-list-item status-border-${statusClass}`;
        const itemsHtml = order.items.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}</li>`).join('');
        const orderDate = new Date(order.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        
        let locationLinkHtml = '';
        if (order.location && order.location.lat && order.location.lng) {
            const mapsLink = `https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`;
            locationLinkHtml = `<a href="${mapsLink}" target="_blank" class="location-link"><i class="fas fa-map-marker-alt"></i> View on Map</a>`;
        }
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-customer">${order.customerName}</span>
                <span class="order-date">${orderDate}</span>
            </div>
            <div class="order-details">
                <p><strong>Phone:</strong> ${order.customerPhone}</p>
                <p><strong>Address:</strong> ${order.address} ${locationLinkHtml}</p>
                <p><strong>Total:</strong> ₹${order.totalAmount} (Delivery: ₹${order.deliveryFee})</p>
                <strong>Items:</strong><ul>${itemsHtml}</ul>
            </div>
            <div class="order-footer">
                <div class="order-status-buttons" data-id="${order.key}">
                    <button class="status-btn pending ${order.status === 'Pending' ? 'active' : ''}" data-status="Pending">Pending</button>
                    <button class="status-btn confirmed ${order.status === 'Confirmed' ? 'active' : ''}" data-status="Confirmed">Confirmed</button>
                    <button class="status-btn completed ${order.status === 'Completed' ? 'active' : ''}" data-status="Completed">Completed</button>
                </div>
                <button class="admin-btn-delete-order" data-id="${order.key}"><i class="fas fa-trash"></i></button>
            </div>`;
        orderListDiv.appendChild(orderCard);
    });
}

async function fetchAndRenderOrders() {
    if (!orderListDiv) return;
    orderListDiv.innerHTML = '<p>Loading orders...</p>';
    try {
        db.ref('orders').on('value', (snapshot) => {
            const ordersObject = snapshot.val();
            allOrders = ordersObject ? Object.entries(ordersObject).map(([key, value]) => ({ ...value, key })) : [];
            renderOrders(allOrders);
            generateDashboardData();
            isInitialOrdersLoaded = true;
        });
    } catch (error) { console.error("Error loading orders:", error); orderListDiv.innerHTML = '<p>Could not load orders.</p>'; }
}

orderListDiv.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('admin-btn-delete-order') || target.parentElement.classList.contains('admin-btn-delete-order')) {
        const button = target.closest('.admin-btn-delete-order');
        const orderId = button.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this order?')) {
            db.ref(`orders/${orderId}`).remove().catch(error => alert(`Failed to delete order: ${error.message}`));
        }
    }
    if (target.classList.contains('status-btn')) {
        const orderId = target.parentElement.getAttribute('data-id');
        const newStatus = target.getAttribute('data-status');
        db.ref(`orders/${orderId}`).update({ status: newStatus })
            .catch(error => alert(`Failed to update status: ${error.message}`));
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
    const categories = ["Atta Rice & Daal", "Masala & Oil", "Bakery & Biscuits", "Cold Drinks & Juices", "Pan Corner", "Personal Care", "Cleaning Care", "Dry Fruits", "Baby Care", "Maxo Killer & candle", "Gass", "Electronics", "Stationary", "Colgate & Brush", "Fish & Chicken", "Sweet & Snacks", "Dawat-e-Biriyani", "Bakery & Cake"];
    categoryList.innerHTML = '';
    categories.forEach(cat => categoryList.innerHTML += `<option value="${cat}">`);
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
        allProducts = productsObject ? Object.entries(productsObject).map(([key, value]) => ({ ...value, key })) : [];
        renderProducts(adminSearchInput.value);
        populateCategoryDropdown();
    } catch (error) { console.error("Error loading products:", error); productListDiv.innerHTML = '<p>Could not load products.</p>'; }
}

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitProductBtn.textContent = 'Saving...';
    submitProductBtn.disabled = true;
    const name = document.getElementById('productName').value.trim();
    const price = Number(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const file = document.getElementById('productImageFile').files[0];
    const editingId = editingIdInput.value;
    let imageUrl = '';
    if (!name || !price || !category) {
        alert('Please fill all text fields.');
        submitProductBtn.disabled = false;
        submitProductBtn.textContent = editingId ? 'Update Product' : 'Add Product';
        return;
    }
    try {
        if (editingId) {
            const productToEdit = allProducts.find(p => p.key === editingId);
            imageUrl = productToEdit.image;
            if (file) {
                imageUrl = await uploadImageAndGetURL(file);
            }
            await db.ref(`products/${editingId}`).update({ name, price, category, image: imageUrl });
            alert('Product updated successfully!');
        } else {
            if (!file) {
                alert('Please select an image file to upload.');
                submitProductBtn.disabled = false;
                submitProductBtn.textContent = 'Add Product';
                return;
            }
            imageUrl = await uploadImageAndGetURL(file);
            await db.ref('products').push({ name, price, category, image: imageUrl, inStock: true });
            alert('Product added successfully!');
        }
        await fetchAndRenderProducts();
        showSection('productListSection');
    } catch (error) {
        console.error("Error saving product:", error);
        alert(`Failed to save product: ${error.message}`);
    } finally {
        submitProductBtn.disabled = false;
        resetForm();
    }
});

async function uploadImageAndGetURL(file) {
    const progressDiv = document.getElementById('uploadProgress');
    const progressSpan = progressDiv.querySelector('span');
    progressDiv.style.display = 'block';
    return new Promise((resolve, reject) => {
        const fileName = `product_images/product_${Date.now()}_${file.name}`;
        const storageRef = storage.ref(fileName);
        const uploadTask = storageRef.put(file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressSpan.textContent = Math.round(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                progressDiv.style.display = 'none';
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    progressDiv.style.display = 'none';
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

cancelEditBtn.addEventListener('click', () => { resetForm(); showSection('productListSection'); });

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
            editingIdInput.value = productId;
            formTitle.textContent = 'Edit Product';
            submitProductBtn.textContent = 'Update Product';
            cancelEditBtn.style.display = 'block';
            showSection('addProductSection');
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
            if (productInArray) productInArray.inStock = newStatus;
        } catch (error) { console.error('Error updating stock status:', error); target.checked = !newStatus; }
    }
});
adminSearchInput.addEventListener('input', (e) => renderProducts(e.target.value));

// --- NOTIFICATION & DASHBOARD CODE ---
enableNotificationsBtn.addEventListener('click', () => { askForNotificationPermission(); });
async function askForNotificationPermission() {
    try {
        const permissionResult = await Notification.requestPermission();
        if (permissionResult !== 'granted') throw new Error('Notification permission not granted.');
        const swRegistration = await navigator.serviceWorker.ready;
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BD7ekfMaxKz0kUHWYFlGc1H4HJh_vVLlHVNA-AWhBbKgAakjBkpEXG8x9hWSnra5g8rxBH5dOd65L_oBukyBHfQ')
        });
        const currentUser = auth.currentUser;
        if (currentUser) {
            await db.ref(`admin_tokens/${currentUser.uid}`).set(JSON.stringify(subscription));
            alert('Notifications enabled successfully!');
        }
    } catch (error) {
        console.error('Failed to enable notifications:', error);
        alert('Could not enable notifications. Check console for errors.');
    }
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) { outputArray[i] = rawData.charCodeAt(i); }
    return outputArray;
}

async function generateDashboardData(startDate = null, endDate = null) {
    const [itemTotalEl, deliveryFeeEl, totalSalesEl, totalOrdersEl, topItemsList] = [
        document.getElementById('itemTotalSales'), document.getElementById('totalDeliveryFees'),
        document.getElementById('totalSales'), document.getElementById('totalOrders'), document.getElementById('topSellingItems')
    ];
    const completedOrders = allOrders.filter(order => order.status === 'Completed');
    if (completedOrders.length === 0) {
        itemTotalEl.textContent = '₹0.00'; deliveryFeeEl.textContent = '₹0.00';
        totalSalesEl.textContent = '₹0.00'; totalOrdersEl.textContent = '0';
        topItemsList.innerHTML = '<p>No completed sales data yet.</p>'; return;
    }
    const filteredOrders = completedOrders.filter(order => !startDate || (new Date(order.timestamp) >= startDate && new Date(order.timestamp) <= endDate));
    const totalSales = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalDeliveryFees = filteredOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);
    itemTotalEl.textContent = `₹${(totalSales - totalDeliveryFees).toFixed(2)}`;
    deliveryFeeEl.textContent = `₹${totalDeliveryFees.toFixed(2)}`;
    totalSalesEl.textContent = `₹${totalSales.toFixed(2)}`;
    totalOrdersEl.textContent = filteredOrders.length;
    const itemCounts = {};
    filteredOrders.forEach(order => {
        if (order.items) order.items.forEach(item => {
            const cleanName = item.name.replace(/\(P\d+\)\s/, '');
            itemCounts[cleanName] = (itemCounts[cleanName] || 0) + item.quantity;
        });
    });
    const sortedItems = Object.entries(itemCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
    topItemsList.innerHTML = sortedItems.length === 0 ? '<p>No items sold in this period.</p>' :
        sortedItems.map(([name, quantity]) => `<div class="top-item"><span class="top-item-name">${name}</span><span class="top-item-qty">${quantity} units sold</span></div>`).join('');
    try {
        await db.ref('topSellers').set(sortedItems.map(([name]) => name));
    } catch (error) { console.error("Could not save top sellers:", error); }
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const range = button.dataset.range;
        const now = new Date();
        let startDate, endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        if (range === 'today') startDate = new Date(now);
        else if (range === 'week') startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        else if (range === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        else { startDate = null; endDate = null; }
        if(startDate) startDate.setHours(0, 0, 0, 0);
        startDateInput.value = ''; endDateInput.value = '';
        generateDashboardData(startDate, endDate);
    });
});

applyDateRangeBtn.addEventListener('click', () => {
    if (!startDateInput.value || !endDateInput.value) return alert('Please select both a start and end date.');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const startDate = new Date(startDateInput.value); startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateInput.value); endDate.setHours(23, 59, 59, 999);
    generateDashboardData(startDate, endDate);
});


// === COUPON MANAGEMENT FUNCTIONS ===
async function fetchAllUsers() {
    try {
        const snapshot = await db.ref('users').once('value');
        const usersObject = snapshot.val();
        allUsers = usersObject ? Object.entries(usersObject).map(([key, value]) => ({ ...value, uid: key })) : [];
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function renderUsers(searchTerm = '') {
    if (!searchTerm) {
        userListDiv.innerHTML = '<p>Search for a user to see their coupon balance.</p>';
        return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        (user.displayName && user.displayName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
    );

    if (filteredUsers.length === 0) {
        userListDiv.innerHTML = '<p>No user found.</p>';
        return;
    }

    userListDiv.innerHTML = '';
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'product-list-item'; // Reusing style
        userCard.innerHTML = `
            <div class="product-list-details">
                <p class="product-list-name">${user.displayName || 'No Name'}</p>
                <p class="product-list-price">Phone: ${user.phoneNumber}</p>
                <p class="product-list-category">Coupons: <strong>${user.couponBalance || 0}</strong></p>
            </div>
            <div class="product-buttons">
                <button class="admin-btn-edit redeem-coupon-btn" data-uid="${user.uid}">Redeem</button>
            </div>
        `;
        userListDiv.appendChild(userCard);
    });
}

userSearchInput.addEventListener('input', () => {
    renderUsers(userSearchInput.value.trim());
});

userListDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('redeem-coupon-btn')) {
        const uid = e.target.dataset.uid;
        const user = allUsers.find(u => u.uid === uid);
        const currentBalance = user.couponBalance || 0;

        const amountToRedeem = prompt(`How many coupons to redeem for ${user.displayName}? (Available: ${currentBalance})`);
        
        if (amountToRedeem === null || amountToRedeem.trim() === '') return; // User cancelled

        const redeemValue = parseInt(amountToRedeem, 10);
        if (isNaN(redeemValue) || redeemValue <= 0 || redeemValue > currentBalance) {
            alert('Invalid amount. Please enter a number less than or equal to the available balance.');
            return;
        }

        try {
            const newBalance = currentBalance - redeemValue;
            await db.ref(`users/${uid}/couponBalance`).set(newBalance);
            alert(`Successfully redeemed ${redeemValue} coupons. New balance is ${newBalance}.`);
            await fetchAllUsers(); // Refresh user data
            renderUsers(userSearchInput.value.trim()); // Re-render the list
        } catch (error) {
            alert('Failed to redeem coupons. Error: ' + error.message);
        }
    }
});