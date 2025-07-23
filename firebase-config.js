// yeh poora code firebase-config.js mein daal dein

// Firebase Initialization
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
const shopStatusRef = db.ref('shopStatus');

let isShopOpen = true;

// NAYA CODE: Login Modal ke elements ko access karna
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeLoginBtn = document.getElementById('closeLogin');
const loginError = document.getElementById('loginError');

function setupShopStatus(elements) {
    shopStatusRef.on('value', (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
            isShopOpen = statusData.isOpen;
            elements.shopStatusToggle.checked = isShopOpen;
            updateShopStatus(isShopOpen, elements);
        }
    });

    // PURANA PROMPT WALA CODE HATA KAR YEH NAYA LOGIC DAALA GAYA HAI
    elements.shopStatusToggle.addEventListener('change', async function(e) {
        // Toggle ko foran change hone se rokein
        e.preventDefault();
        
        const currentUser = auth.currentUser;
        
        // Agar user (owner) logged in hai, to status change karne dein
        if (currentUser) {
            try {
                const newStatus = this.checked;
                await shopStatusRef.set({
                    isOpen: newStatus,
                    lastUpdated: firebase.database.ServerValue.TIMESTAMP
                });
                showNotification(`Shop is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
            } catch (error) {
                console.error("Status update failed:", error);
                showNotification("Failed to update status", 'error');
            }
        } else {
            // Agar logged in nahi hai, to login form dikhayein
            loginModal.style.display = 'flex';
            // Toggle ko wapas purani state mein le aayein
            this.checked = isShopOpen; 
        }
    });

    // NAYA CODE: Login form ka logic
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('ownerEmail').value;
        const password = document.getElementById('ownerPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login successful
                loginModal.style.display = 'none';
                loginError.textContent = '';
                document.getElementById('ownerEmail').value = '';
                document.getElementById('ownerPassword').value = '';
                showNotification('Login Successful! You can now change the status.');
            })
            .catch((error) => {
                // Login failed
                loginError.textContent = "Wrong email or password.";
            });
    });

    // NAYA CODE: Login form ko band karne ka logic
    closeLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}

function updateShopStatus(isOpen, elements) {
    if (isOpen) {
        document.body.classList.remove('shop-closed');
        elements.shopStatusText.textContent = "Open";
        elements.shopStatusText.style.color = "var(--primary)";
    } else {
        document.body.classList.add('shop-closed');
        elements.shopStatusText.textContent = "Closed";
        elements.shopStatusText.style.color = "#ff4444";
        if (window.closeCart) {
            window.closeCart();
        }
    }
    localStorage.setItem('quickKartShopStatus', isOpen ? 'open' : 'closed');
}

export { db, auth, shopStatusRef, isShopOpen, setupShopStatus, updateShopStatus };
// firebase-config.js mein sabse neeche yeh code add karein

const logoutBtn = document.getElementById('logoutBtn');

// Yeh function check karega ki user logged in hai ya nahi
auth.onAuthStateChanged((user) => {
  if (user) {
    // User logged in hai, to Logout button dikhao
    logoutBtn.style.display = 'block';
  } else {
    // User logged out hai, to Logout button chhipao
    logoutBtn.style.display = 'none';
  }
});

// Logout button par click ka logic
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    showNotification('You have been logged out.');
  }).catch((error) => {
    console.error('Logout failed:', error);
  });
});