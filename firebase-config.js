// firebase-config.js

import { showNotification } from './utils.js';

const firebaseConfig = {
  apiKey: "AIzaSyBieX9ymlSZH_nGc17YukhmrIvNOpBzF_M",
  authDomain: "quickkart-shop-status.firebaseapp.com",
  databaseURL: "https://quickkart-shop-status-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quickkart-shop-status",
  storageBucket: "quickkart-shop-status.appspot.com",
  messagingSenderId: "603872368115",
  appId: "1:603872368115:web:3ed732f3c7afe934ee2e86"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const shopStatusRef = db.ref('shopStatus');

let isShopOpen = true;

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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('ownerEmail').value;
        const password = document.getElementById('ownerPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                loginModal.style.display = 'none';
                loginError.textContent = '';
                loginForm.reset();
                showNotification('Login Successful! You can now manage the shop.');
            })
            .catch(() => {
                loginError.textContent = "Wrong email or password.";
            });
    });

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

export { db, auth, storage, shopStatusRef, isShopOpen, setupShopStatus, updateShopStatus };