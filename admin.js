// admin.js (FINAL CODE WITH ADMIN VERIFICATION)
import { showNotification } from './utils.js';
import { db, auth, storage } from './firebase-config.js';

// Function to check if a user is an admin
const isAdmin = async (user) => {
    if (!user) return false;
    try {
        const adminRef = db.ref(`admins/${user.uid}`);
        const snapshot = await adminRef.once('value');
        return snapshot.exists();
    } catch (error) {
        console.error("Admin check failed:", error);
        return false;
    }
};


// === AUTHENTICATION & INITIALIZATION - UPDATED ===
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const adminStatus = await isAdmin(user);
        if (adminStatus) {
            // Load admin panel
            document.body.style.display = 'block';
            Promise.all([
                fetchAndRenderProducts(),
                fetchAndRenderOrders(),
                fetchAllUsers()
            ]).then(() => {
                setupNewOrderNotifications();
                showSection('dashboardSection');
            });
        } else {
            // Redirect non-admins
            console.log("Access Denied: User is not an admin.");
            window.location.href = 'index.html';
        }
    } else {
        // Redirect unauthenticated users
        window.location.href = 'index.html';
    }
});


let allProducts = [];
let allOrders = [];
let allUsers = [];

// === DOM ELEMENTS ===
const navButtons = {
    dashboard: document.getElementById('navDashboard'),
    viewProducts: document.getElementById('navViewProducts'),
    addProduct: document.getElementById('navAddProduct'),
    orderHistory: document.getElementById('navOrderHistory'),
    coupons: document.getElementById('navCoupons'),
    enableNotifications: document.getElementById('enableNotificationsBtn'),
};
const sections = {
    dashboardSection: document.getElementById('dashboardSection'),
    productListSection: document.getElementById('productListSection'),
    addProductSection: document.getElementById('addProductSection'),
    orderHistorySection: document.getElementById('orderHistorySection'),
    couponSection: document.getElementById('couponSection'),
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
const filterButtons = document.querySelectorAll('.filter-btn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const applyDateRangeBtn = document.getElementById('applyDateRange');
const userSearchInput = document.getElementById('userSearchInput');
const userListDiv = document.getElementById('userList');


// === NAVIGATION LOGIC ===
function showSection(sectionId) {
    Object.values(sections).forEach(section => section.style.display = 'none');
    Object.values(navButtons).forEach(button => button.classList.remove('active'));
    if (sections[sectionId]) {
        sections[sectionId].style.display = 'block';
        const navBtnKey = Object.keys(navButtons).find(key => sectionId.toLowerCase().startsWith(key.toLowerCase()));
        if(navBtnKey) navButtons[navBtnKey].classList.add('active');
    }
}
navButtons.dashboard.addEventListener('click', () => showSection('dashboardSection'));
navButtons.viewProducts.addEventListener('click', () => showSection('productListSection'));
navButtons.addProduct.addEventListener('click', () => { resetForm(); showSection('addProductSection'); });
navButtons.orderHistory.addEventListener('click', () => showSection('orderHistorySection'));
navButtons.coupons.addEventListener('click', () => showSection('couponSection'));
navButtons.enableNotifications.addEventListener('click', () => askForNotificationPermission());


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
        if (order.location?.lat && order.location?.lng) {
            const mapsLink = `https://maps.google.com/?q=${order.location.lat},${order.location.lng}`;
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
                <strong>Items:</strong>
                <ul>${itemsHtml}</ul>
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
    db.ref('orders').on('value', snapshot => {
        allOrders = snapshot.exists() ? Object.entries(snapshot.val()).map(([key, value]) => ({ ...value, key })) : [];
        renderOrders(allOrders);
        generateDashboardData();
    }, err => { console.error("Order fetch error:", err); orderListDiv.innerHTML = '<p>Could not load orders.</p>'; });
}

orderListDiv.addEventListener('click', e => {
    const target = e.target;
    
    if (target.matches('.status-btn')) {
        const status = target.dataset.status;
        const orderId = target.closest('.order-status-buttons').dataset.id;
        if (orderId && status) {
            db.ref(`orders/${orderId}/status`).set(status)
                .catch(err => console.error("Status update failed:", err));
        }
    }

    const deleteButton = target.closest('.admin-btn-delete-order');
    if (deleteButton) {
        const orderId = deleteButton.dataset.id;
        if (orderId && confirm('Are you sure you want to delete this order?')) {
            db.ref(`orders/${orderId}`).remove()
                .catch(err => console.error("Order deletion failed:", err));
        }
    }
});


// === NEW ORDER NOTIFICATION (FIXED TO PREVENT LOOP) ===
const notificationSound = new Audio('notification.mp3');
async function setupNewOrderNotifications() {
    const lastOrderQuery = db.ref('orders').orderByChild('timestamp').limitToLast(1);
    const snapshot = await lastOrderQuery.once('value');
    
    let lastKnownTimestamp = new Date().toISOString();
    if (snapshot.exists()) {
        const lastOrder = Object.values(snapshot.val())[0];
        lastKnownTimestamp = lastOrder.timestamp;
    }

    db.ref('orders').orderByChild('timestamp').startAt(lastKnownTimestamp).on('child_added', (childSnapshot) => {
        const newOrder = childSnapshot.val();
        
        if (newOrder.timestamp > lastKnownTimestamp) {
            console.log("New order detected, playing sound.");
            notificationSound.play().catch(() => alert('🔔 New Order Received!'));
            lastKnownTimestamp = newOrder.timestamp;
        }
    });
}

// === PRODUCT MANAGEMENT FUNCTIONS (NO CHANGE) ===
function resetForm(){addProductForm.reset();editingIdInput.value="";formTitle.textContent="Add New Product";submitProductBtn.textContent="Add Product";cancelEditBtn.style.display="none"}
function populateCategoryDropdown(){const e=["Atta Rice & Daal","Masala & Oil","Bakery & Biscuits","Cold Drinks & Juices","Pan Corner","Personal Care","Cleaning Care","Dry Fruits","Baby Care","Maxo Killer & candle","Gass","Electronics","Stationary","Colgate & Brush","Fish & Chicken","Sweet & Snacks","Dawat-e-Biriyani","Bakery & Cake"];categoryList.innerHTML="";e.forEach(e=>{categoryList.innerHTML+=`<option value="${e}">`})}
function renderProducts(e=""){const t=e.toLowerCase(),o=allProducts.filter(e=>e.name&&e.name.toLowerCase().includes(t));productListDiv.innerHTML="";if(0===o.length)return void(productListDiv.innerHTML="<p>No products found.</p>");o.forEach(e=>{const t=document.createElement("div");t.className="product-list-item";const o=e.inStock!==!1;t.innerHTML=`<img src="${e.image}" alt="${e.name}" class="product-list-img"><div class="product-list-details"><p class="product-list-name">${e.name}</p><p class="product-list-price">₹${e.price}</p><p class="product-list-category">Category: ${e.category||"N/A"}</p></div><div class="product-list-actions"><div class="stock-toggle"><label class="switch-small"><input type="checkbox" class="stock-status-checkbox" data-id="${e.key}" ${o?"checked":""}><span class="slider-small round"></span></label><span class="stock-label">${o?"In Stock":"Out of Stock"}</span></div><div class="product-buttons"><button class="admin-btn-edit" data-id="${e.key}">Edit</button><button class="admin-btn-delete" data-id="${e.key}">Delete</button></div></div>`;productListDiv.appendChild(t)})}
async function fetchAndRenderProducts(){productListDiv.innerHTML="<p>Loading products...</p>";try{const e=await db.ref("products").once("value"),t=e.val();allProducts=t?Object.entries(t).map(([e,t])=>({...t,key:e})):[];renderProducts(adminSearchInput.value);populateCategoryDropdown()}catch(e){console.error("Error loading products:",e);productListDiv.innerHTML="<p>Could not load products.</p>"}}
// Yeh function aapke addProductForm event listener ko replace karega

addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        // alert ko isse badal dein
        showNotification("Please login first.", "error");
        return;
    }

    const isUserAdmin = await isAdmin(user);
    if (!isUserAdmin) {
        // alert ko isse badal dein
        showNotification("You don't have admin privileges.", "error");
        return;
    }

    submitProductBtn.textContent = "Saving...";
    submitProductBtn.disabled = true;

    const productName = document.getElementById("productName").value.trim();
    const productPrice = Number(document.getElementById("productPrice").value);
    const productCategory = document.getElementById("productCategory").value.trim();
    const productImageFile = document.getElementById("productImageFile").files[0];
    const editingId = editingIdInput.value;

    if (!productName || !productPrice || !productCategory) {
        // alert ko isse badal dein
        showNotification("Please fill all required fields.", "error");
        submitProductBtn.disabled = false;
        submitProductBtn.textContent = editingId ? "Update Product" : "Add Product";
        return;
    }

    try {
        let imageUrl = "";
        
        if (!editingId && !productImageFile) {
            throw new Error("Please select an image for new products");
        }

        if (productImageFile) {
            imageUrl = await uploadImageAndGetURL(productImageFile);
        }

        const productData = {
            name: productName,
            price: productPrice,
            category: productCategory,
            inStock: true
        };

        if (imageUrl) {
            productData.image = imageUrl;
        }

        if (editingId) {
            await db.ref(`products/${editingId}`).update(productData);
            showNotification("Product updated successfully!", "success");
        } else {
            await db.ref("products").push(productData);
            showNotification("Product added successfully!", "success");
        }

        await fetchAndRenderProducts();
        showSection("productListSection");
        resetForm();
    } catch (error) {
        console.error("Error saving product:", error);
        // alert ko isse badal dein
        showNotification(`Failed to save product: ${error.message}`, 'error');
    } finally {
        submitProductBtn.disabled = false;
        submitProductBtn.textContent = editingId ? "Update Product" : "Add Product";
    }
});

async function uploadImageAndGetURL(e){const t=document.getElementById("uploadProgress"),o=t.querySelector("span");return t.style.display="block",new Promise((n,d)=>{const i=`product_images/product_${Date.now()}_${e.name}`,l=storage.ref(i).put(e);l.on("state_changed",e=>{const t=(e.bytesTransferred/e.totalBytes)*100;o.textContent=Math.round(t)},e=>{console.error("Upload failed:",e);t.style.display="none";d(e)},async()=>{try{const e=await l.snapshot.ref.getDownloadURL();t.style.display="none";n(e)}catch(e){d(e)}})})}
cancelEditBtn.addEventListener("click",()=>{resetForm();showSection("productListSection")});
productListDiv.addEventListener("click",e=>{const t=e.target.closest("button");if(t){const o=t.dataset.id;if(t.matches(".admin-btn-delete")){confirm("Are you sure you want to delete this product?")&&db.ref(`products/${o}`).remove().then(()=>fetchAndRenderProducts())}else if(t.matches(".admin-btn-edit")){const e=allProducts.find(e=>e.key===o);e&&(document.getElementById("productName").value=e.name,document.getElementById("productPrice").value=e.price,document.getElementById("productCategory").value=e.category,editingIdInput.value=o,formTitle.textContent="Edit Product",submitProductBtn.textContent="Update Product",cancelEditBtn.style.display="block",showSection("addProductSection"),window.scrollTo(0,0))}}});
productListDiv.addEventListener("change",e=>{if(e.target.matches(".stock-status-checkbox")){const t=e.target.dataset.id,o=e.target.checked;db.ref(`products/${t}/inStock`).set(o).then(()=>{const t=e.target.closest(".stock-toggle").querySelector(".stock-label");t.textContent=o?"In Stock":"Out of Stock";const n=allProducts.find(e=>e.key===t);n&&(n.inStock=o)}).catch(t=>{console.error("Stock update failed:",t),e.target.checked=!o})}});
adminSearchInput.addEventListener("input",e=>renderProducts(e.target.value));

// === DASHBOARD & PUSH NOTIFICATIONS (NO CHANGE) ===
async function askForNotificationPermission(){try{if("granted"===Notification.permission)return void alert("Notifications are already enabled.");const e=await Notification.requestPermission();if("granted"!==e)throw new Error("Permission not granted.");const t=await navigator.serviceWorker.ready,o=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:"BD7ekfMaxKz0kUHWYFlGc1H4HJh_vVLlHVNA-AWhBbKgAakjBkpEXG8x9hWSnra5g8rxBH5dOd65L_oBukyBHfQ"});auth.currentUser&&await db.ref(`admin_tokens/${auth.currentUser.uid}`).set(JSON.stringify(o)),alert("Notifications enabled!")}catch(e){alert("Could not enable notifications."),console.error(e)}}
async function generateDashboardData(e=null,t=null){const[o,n,d,i,l]=[document.getElementById("itemTotalSales"),document.getElementById("totalDeliveryFees"),document.getElementById("totalSales"),document.getElementById("totalOrders"),document.getElementById("topSellingItems")],a=allOrders.filter(e=>"Completed"===e.status);if(0===a.length)return o.textContent="₹0.00",n.textContent="₹0.00",d.textContent="₹0.00",i.textContent="0",void(l.innerHTML="<p>No completed sales data yet.</p>");const r=a.filter(o=>!e||new Date(o.timestamp)>=e&&new Date(o.timestamp)<=t),s=r.reduce((e,t)=>e+(t.totalAmount||0),0),c=r.reduce((e,t)=>e+(t.deliveryFee||0),0);o.textContent=`₹${(s-c).toFixed(2)}`,n.textContent=`₹${c.toFixed(2)}`,d.textContent=`₹${s.toFixed(2)}`,i.textContent=r.length;const u={};r.forEach(e=>e.items?.forEach(t=>{u[t.name]=(u[t.name]||0)+t.quantity}));const p=Object.entries(u).sort(([,e],[,t])=>t-e).slice(0,10);l.innerHTML=p.length?p.map(([e,t])=>`<div class="top-item"><span class="top-item-name">${e}</span><span class="top-item-qty">${t} sold</span></div>`).join(""):"<p>No items sold in this period.</p>";try{await db.ref("topSellers").set(p.map(([e])=>e))}catch(e){console.error("Could not save top sellers:",e)}}
filterButtons.forEach(e => {
    e.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        e.classList.add("active");
        const range = e.dataset.range;
        
        let startDate = new Date(); 
        let endDate = new Date(); 

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        if (range === 'today') {
        } else if (range === 'week') {
            startDate.setDate(startDate.getDate() - startDate.getDay());
        } else if (range === 'month') {
            startDate.setDate(1);
        } else {
            startDate = null;
            endDate = null;
        }

        startDateInput.value = "";
        endDateInput.value = "";
        generateDashboardData(startDate, endDate);
    });
});
applyDateRangeBtn.addEventListener("click",()=>{if(!startDateInput.value||!endDateInput.value)return alert("Please select both start and end dates.");filterButtons.forEach(e=>e.classList.remove("active"));const e=new Date(startDateInput.value);e.setHours(0,0,0,0);const t=new Date(endDateInput.value);t.setHours(23,59,59,999),generateDashboardData(e,t)});


// === COUPON MANAGEMENT (FIXED & IMPROVED) ===
async function fetchAllUsers() {
    try {
        const snapshot = await db.ref('users').once('value');
        allUsers = snapshot.exists() ? Object.entries(snapshot.val()).map(([key, value]) => ({ ...value, uid: key })) : [];
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
function renderUsers(searchTerm = '') {
    if (!searchTerm) {
        userListDiv.innerHTML = '<p>Search by name or phone to manage coupons.</p>';
        return;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filteredUsers = allUsers.filter(user =>
        (user.displayName?.toLowerCase().includes(lowerCaseSearch)) ||
        (user.phoneNumber?.includes(searchTerm))
    );
    userListDiv.innerHTML = filteredUsers.length === 0 ? '<p>No user found.</p>' : '';
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'product-list-item';
        userCard.innerHTML = `
            <div class="product-list-details">
                <p class="product-list-name">${user.displayName || 'N/A'}</p>
                <p class="product-list-price">Phone: ${user.phoneNumber}</p>
                <p class="product-list-category">Coupons: <strong>${user.couponBalance || 0}</strong></p>
            </div>
            <div class="product-buttons">
                <button class="admin-btn-edit redeem-coupon-btn" data-uid="${user.uid}">Redeem</button>
            </div>`;
        userListDiv.appendChild(userCard);
    });
}
userSearchInput.addEventListener('input', () => {
    renderUsers(userSearchInput.value.trim());
});
userListDiv.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('redeem-coupon-btn')) return;

    const uid = e.target.dataset.uid;
    const user = allUsers.find(u => u.uid === uid);
    const currentBalance = user.couponBalance || 0;

    const amountToRedeem = prompt(`Redeem coupons for ${user.displayName}? (Available: ${currentBalance})`);
    if (!amountToRedeem) return;

    const redeemValue = parseInt(amountToRedeem, 10);
    if (isNaN(redeemValue) || redeemValue <= 0 || redeemValue > currentBalance) {
        return alert('Invalid amount entered.');
    }

    try {
        const newBalance = currentBalance - redeemValue;
        await db.ref(`users/${uid}/couponBalance`).set(newBalance);
        alert(`Redeemed ${redeemValue} coupons. New balance: ${newBalance}.`);
        user.couponBalance = newBalance;
        renderUsers(userSearchInput.value.trim());
    } catch (error) {
        alert('Failed to redeem coupons: ' + error.message);
    }
});