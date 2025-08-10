// firebase-config.js (UPDATED AND CORRECTED)

import "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js";
import { showNotification } from './utils.js';

const firebaseConfig = {
  apiKey: "AIzaSyBieX9ymlSZH_nGc17YukhmrIvNOpBzF_M",
  authDomain: "quickkart-shop-status.firebaseapp.com",
  databaseURL: "https://quickkart-shop-status-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quickkart-shop-status",
  storageBucket: "quickkart-shop-status.appspot.com", // CORRECTED URL
  messagingSenderId: "603872368115",
  appId: "1:603872368115:web:3ed732f3c7afe934ee2e86"
};

// Check if Firebase is already initialized
if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
}

// Get the firebase object from the window
const firebaseApp = window.firebase;
const db = firebaseApp.database();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const shopStatusRef = db.ref('shopStatus');
let isShopOpen = true;

const getShopStatus = () => isShopOpen;

function setupShopStatus(elements, closeCartCallback) {
    const { shopStatusToggle, loginModal, loginForm, closeLoginBtn, loginError, logoutBtn, adminPanelBtn } = elements;
    shopStatusRef.on('value', (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
            isShopOpen = statusData.isOpen;
            shopStatusToggle.checked = isShopOpen;
            updateShopStatus(isShopOpen, elements, closeCartCallback);
        }
    });
    shopStatusToggle.addEventListener('change', async function(e) {
        e.preventDefault();
        if (auth.currentUser) {
            try {
                await shopStatusRef.set({ isOpen: this.checked });
                showNotification(`Shop is now ${this.checked ? 'OPEN' : 'CLOSED'}`);
            } catch (error) {
                showNotification("Failed to update status", 'error');
            }
        } else {
            loginModal.style.display = 'flex';
            this.checked = isShopOpen;
        }
    });
    // In firebase-config.js, update the login form handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('ownerEmail').value;
    const password = document.getElementById('ownerPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
            const isAdmin = await checkAdminStatus(userCredential.user.uid);
            if (isAdmin) {
                loginModal.style.display = 'none';
                loginError.textContent = '';
                loginForm.reset();
                showNotification('Admin login successful!');
            } else {
                auth.signOut();
                loginError.textContent = "Not an admin account.";
            }
        })
        .catch((error) => {
            loginError.textContent = "Wrong email or password.";
        });
});

async function checkAdminStatus(uid) {
    const snapshot = await db.ref(`admins/${uid}`).once('value');
    return snapshot.exists();
}
    closeLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    auth.onAuthStateChanged((user) => {
        if (user) {
            logoutBtn.style.display = 'block';
            adminPanelBtn.style.display = 'block';
        } else {
            logoutBtn.style.display = 'none';
            adminPanelBtn.style.display = 'none';
        }
    });
}
function updateShopStatus(isOpen, elements, closeCartCallback) {
    document.body.classList.toggle('shop-closed', !isOpen);
    elements.shopStatusText.textContent = isOpen ? "Open" : "Closed";
    elements.shopStatusText.style.color = isOpen ? "var(--primary)" : "var(--error)";
    if (!isOpen && typeof closeCartCallback === 'function') {
        closeCartCallback();
    }
}
export { db, auth, storage, shopStatusRef, isShopOpen, getShopStatus, setupShopStatus, updateShopStatus, firebaseApp as firebase };