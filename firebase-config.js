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

function setupShopStatus(elements) {
    shopStatusRef.on('value', (snapshot) => {
        const statusData = snapshot.val();
        if (statusData) {
            isShopOpen = statusData.isOpen;
            elements.shopStatusToggle.checked = isShopOpen;
            updateShopStatus(isShopOpen, elements);
        }
    });

    elements.shopStatusToggle.addEventListener('change', async function() {
        const password = prompt("Owner Access Required\nEnter password:");
        
        if (password === "bismillah") {
            try {
                const newStatus = this.checked;
                await shopStatusRef.set({
                    isOpen: newStatus,
                    lastUpdated: firebase.database.ServerValue.TIMESTAMP
                });
                showNotification(`Shop is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
            } catch (error) {
                console.error("Status update failed:", error);
                this.checked = !this.checked;
                showNotification("Failed to update status", 'error');
            }
        } else {
            this.checked = !this.checked;
            if (password !== null) {
                showNotification("Wrong password!", 'error');
            }
        }
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
        closeCart();
    }
    localStorage.setItem('quickKartShopStatus', isOpen ? 'open' : 'closed');
}

export { db, auth, shopStatusRef, isShopOpen, setupShopStatus, updateShopStatus };