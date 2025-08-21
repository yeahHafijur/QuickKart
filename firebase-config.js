// firebase-config.js (FINAL AND CORRECTED CODE)

import "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
import "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js";
import { showNotification } from './utils.js';
import { updateCartUI } from './cart.js';

const firebaseConfig = {
  apiKey: "AIzaSyBieX9ymlSZH_nGc17YukhmrIvNOpBzF_M",
  authDomain: "quickkart-shop-status.firebaseapp.com",
  databaseURL: "https://quickkart-shop-status-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quickkart-shop-status",
  storageBucket: "gs://quickkart-shop-status.firebasestorage.app",
  messagingSenderId: "603872368115",
  appId: "1:603872368115:web:3ed732f3c7afe934ee2e86"
};

if (!window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
}

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
        // Admin status check karne ke baad hi toggle kaam karega
        const isAdmin = auth.currentUser ? await checkAdminStatus(auth.currentUser.uid) : false;
        if (auth.currentUser && isAdmin) {
            try {
                await shopStatusRef.set({ isOpen: this.checked });
                showNotification(`Shop is now ${this.checked ? 'OPEN' : 'CLOSED'}`);
            } catch (error) {
                showNotification("Failed to update status", 'error');
            }
        } else {
            loginModal.style.display = 'flex';
            this.checked = isShopOpen; // Status ko purane state par reset karein
        }
    });
    
    async function checkAdminStatus(uid) {
        if (!uid) return false;
        const snapshot = await db.ref(`admins/${uid}`).once('value');
        return snapshot.exists();
    }

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

    closeLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // YAHAN BADLAV KIYA GAYA HAI
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User logged in hai, ab check karo ki admin hai ya nahi
            const isUserAdmin = await checkAdminStatus(user.uid);
            if (isUserAdmin) {
                // Agar admin hai, to dono button dikhao
                logoutBtn.style.display = 'block';
                adminPanelBtn.style.display = 'block';
            } else {
                // Agar normal user hai, to dono button chhupa do
                logoutBtn.style.display = 'none';
                adminPanelBtn.style.display = 'none';
            }
        } else {
            // User logged out hai, to dono button chhupa do
            logoutBtn.style.display = 'none';
            adminPanelBtn.style.display = 'none';
        }
        // Har baar auth state change hone par cart UI update karo
        updateCartUI();
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