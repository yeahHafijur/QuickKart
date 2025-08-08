// admin.js (UPDATED AND CORRECTED CODE)

import { db, auth, storage } from './firebase-config.js';

let allProducts = [];
let allOrders = [];

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
    orders.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-list-item';
        const itemsHtml = order.items.map(item => `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}</li>`).join('');
        const orderDate = new Date(order.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        
        // Location link banane ka code
        let locationLinkHtml = '';
        if (order.location && order.location.lat && order.location.lng) {
            const mapsLink = `https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`;locationLinkHtml = `<a href="${mapsLink}" target="_blank" class="location-link"><i class="fas fa-map-marker-alt"></i> View on Map</a>`;
        }
        
        let completeButtonHtml = '';
        if (order.status !== 'Completed') {
            completeButtonHtml = `<button class="admin-btn-complete" data-id="${order.key}">Mark Completed</button>`;
        }
        const statusClass = order.status ? order.status.toLowerCase() : 'pending';
        
        // innerHTML me address ke aage locationLinkHtml add kiya gaya hai
        orderCard.innerHTML = `<div class="order-header"><span class="order-customer">${order.customerName}</span><span class="order-date">${orderDate}</span></div><div class="order-details"><p><strong>Phone:</strong> ${order.customerPhone}</p><p><strong>Address:</strong> ${order.address} ${locationLinkHtml}</p><p><strong>Total:</strong> ₹${order.totalAmount} (Delivery: ₹${order.deliveryFee})</p><strong>Items:</strong><ul>${itemsHtml}</ul></div><div class="order-footer"><span>Status: <strong id="status-${order.key}" class="status-badge ${statusClass}">${order.status}</strong></span><div class="order-buttons">${completeButtonHtml}<button class="admin-btn-delete-order" data-id="${order.key}">Delete</button></div></div>`;
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
            const activeFilter = document.querySelector('.filter-btn.active');
            if (activeFilter) activeFilter.click();
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

// +++ YAHAN BADLAV KIYA GAYA HAI +++
// This function now reads categories from the buttons in index.html, not from existing products.
function populateCategoryDropdown() {
    // This is a placeholder since we can't directly access index.html's DOM from admin.js
    // We will list the categories manually. For a better solution, categories should be stored in the database.
    const categories = [
        "Atta Rice & Daal", "Masala & Oil", "Bakery & Biscuits", 
        "Cold Drinks & Juices", "Pan Corner", "Personal Care", 
        "Cleaning Care", "Dry Fruits", "Baby Care", 
        "Maxo Killer & candle", "Gass", "Electronics", "Stationary", 
        "Colgate & Brush", "Fish & Chicken", "Sweet & Snacks", 
        "Dawat-e-Biriyani", "Bakery & Cake"
    ];
    
    categoryList.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        categoryList.appendChild(option);
    });
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
        populateCategoryDropdown(); // Yeh function ab sahi categories laayega
    } catch (error) { console.error("Error loading products:", error); productListDiv.innerHTML = '<p>Could not load products.</p>'; }
}


// --- YEH POORA FUNCTION FILE UPLOAD AUR EDIT FIX KE LIYE UPDATE KIYA GAYA HAI ---
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
        // CASE 1: Editing an existing product
        if (editingId) {
            const productToEdit = allProducts.find(p => p.key === editingId);
            imageUrl = productToEdit.image; // Default to the old image URL

            if (file) {
                imageUrl = await uploadImageAndGetURL(file);
            }

            await db.ref(`products/${editingId}`).update({ name, price, category, image: imageUrl });
            alert('Product updated successfully!');

        // CASE 2: Adding a new product
        } else {
            if (!file) {
                alert('Please select an image file to upload.');
                submitProductBtn.disabled = false;
                submitProductBtn.textContent = 'Add Product';
                return;
            }

            imageUrl = await uploadImageAndGetURL(file);

            await db.ref('products').push({ name: name, price, category, image: imageUrl, inStock: true });
            alert('Product added successfully!');
        }

        await fetchAndRenderProducts();
        showSection('productList');

    } catch (error) {
        console.error("Error saving product:", error);
        alert(`Failed to save product: ${error.message}`);
    } finally {
        submitProductBtn.disabled = false;
        resetForm();
    }
});

// --- YEH NAYA HELPER FUNCTION HAI FILE UPLOAD KARNE KE LIYE ---
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


cancelEditBtn.addEventListener('click', () => { resetForm(); showSection('productList'); });

productListDiv.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('admin-btn-delete')) {
        const productId = target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this product?')) {
            db.ref(`products/${productId}`).remove().then(() => { alert('Product deleted successfully.'); fetchAndRenderProducts(); }).catch(() => alert('Failed to delete product.'));
        }
    }
    // --- YAHAN EDIT BUTTON KA FIX HAI ---
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
            if (productInArray) productInArray.inStock = newStatus;
        } catch (error) { console.error('Error updating stock status:', error); target.checked = !newStatus; }
    }
});
adminSearchInput.addEventListener('input', (e) => renderProducts(e.target.value));

// --- NOTIFICATION AUR DASHBOARD CODE (NO CHANGES) ---
enableNotificationsBtn.addEventListener('click', () => { askForNotificationPermission(); });
async function askForNotificationPermission() {
    try {
        const permissionResult = await Notification.requestPermission();
        if (permissionResult !== 'granted') {
            throw new Error('Notification permission not granted.');
        }

        const swRegistration = await navigator.serviceWorker.ready;
        
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BD7ekfMaxKz0kUHWYFlGc1H4HJh_vVLlHVNA-AWhBbKgAakjBkpEXG8x9hWSnra5g8rxBH5dOd65L_oBukyBHfQ')
        });

        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = JSON.stringify(subscription);
            await db.ref(`admin_tokens/${currentUser.uid}`).set(token);
            alert('Notifications have been enabled successfully!');
        } else {
            alert('Could not identify user. Please login again to enable notifications.');
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
    const itemTotalEl = document.getElementById('itemTotalSales');
    const deliveryFeeEl = document.getElementById('totalDeliveryFees');
    const totalSalesEl = document.getElementById('totalSales');
    const totalOrdersEl = document.getElementById('totalOrders');
    const topItemsList = document.getElementById('topSellingItems');
    const completedOrders = allOrders.filter(order => order.status === 'Completed');

    if (completedOrders.length === 0) {
        itemTotalEl.textContent = '₹0.00';
        deliveryFeeEl.textContent = '₹0.00';
        totalSalesEl.textContent = '₹0.00';
        totalOrdersEl.textContent = '0';
        topItemsList.innerHTML = '<p>No completed sales data yet.</p>';
        return;
    }

    const filteredOrders = completedOrders.filter(order => {
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
    } else {
        sortedItems.forEach(([name, quantity]) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'top-item';
            itemDiv.innerHTML = `<span class="top-item-name">${name}</span><span class="top-item-qty">${quantity} units sold</span>`;
            topItemsList.appendChild(itemDiv);
        });
    }

    const topSellerNames = sortedItems.slice(0, 10).map(([name, quantity]) => name);
    try {
        await db.ref('topSellers').set(topSellerNames);
    } catch (error) {
        console.error("Could not save top sellers:", error);
    }
}

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