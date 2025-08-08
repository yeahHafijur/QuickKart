// profile.js (FINAL AND CORRECTED CODE)

import { db, auth, firebase } from './firebase-config.js'; // `firebase` ko yahan import karna zaroori hai

// DOM Elements
const authSection = document.getElementById('authSection');
const profileSection = document.getElementById('profileSection');
const userPhoneSpan = document.getElementById('userPhone');
const orderHistoryList = document.getElementById('orderHistoryList');
const logoutBtn = document.getElementById('logoutBtn');
const phoneForm = document.getElementById('phoneForm');
const otpForm = document.getElementById('otpForm');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const errorEl = document.getElementById('authError');
const recaptchaContainer = document.getElementById('recaptcha-container');

// Function to set up and render the reCAPTCHA verifier
function setupRecaptcha() {
    try {
        // IMPORTANT FIX: RecaptchaVerifier ko `firebase.auth` se call karna hai
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
            'size': 'invisible',
            'callback': (response) => {
                // This callback is called when reCAPTCHA is solved.
                console.log("reCAPTCHA verified.");
            }
        });

        // reCAPTCHA widget ko render karein
        window.recaptchaVerifier.render().catch(err => {
             console.error("reCAPTCHA render error:", err);
             errorEl.textContent = "Could not start login verification. Please refresh the page.";
        });
    } catch (err) {
        console.error("Error creating reCAPTCHA verifier:", err);
        errorEl.textContent = "Login service failed to load. Please check your connection and refresh.";
    }
}

// Handle Phone Form Submission (Send OTP)
// In profile.js, replace the handleSendOtp function with this:
async function handleSendOtp(e) {
    e.preventDefault();
    errorEl.textContent = '';
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = 'Sending...';

    const name = document.getElementById('loginName').value.trim();
    const phoneNumberInput = document.getElementById('phoneNumber').value;

    // Name aur Phone dono check karein
    if (!name || phoneNumberInput.length !== 10) {
        errorEl.textContent = "Please enter your full name and a valid 10-digit number.";
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
        return;
    }

    // Naam ko temporary save karein
    sessionStorage.setItem('userNameForSignup', name);

    const fullPhoneNumber = "+91" + phoneNumberInput;
    const appVerifier = window.recaptchaVerifier;

    try {
        const confirmationResult = await auth.signInWithPhoneNumber(fullPhoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        
        phoneForm.style.display = 'none';
        otpForm.style.display = 'block';
        alert('OTP has been sent to your number!');

    } catch (error) {
        console.error("Error sending OTP:", error);
        errorEl.textContent = "Failed to send OTP. Is the number correct?";
        grecaptcha.reset(window.recaptchaWidgetId);
    } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
    }
}

// And replace the handleVerifyOtp function with this:
async function handleVerifyOtp(e) {
    e.preventDefault();
    errorEl.textContent = '';
    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = 'Verifying...';

    const otp = document.getElementById('otpInput').value;

    try {
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;
        
        // Check karein ki kya user naya hai aur naam save karna hai
        const storedName = sessionStorage.getItem('userNameForSignup');
        if (storedName) {
            // User ke profile mein naam update karein
            await user.updateProfile({
                displayName: storedName
            });
            // Temporary naam ko storage se हटा dein
            sessionStorage.removeItem('userNameForSignup');
        }
        // Login safal hua! onAuthStateChanged UI update karega.

    } catch (error) {
        console.error("Error verifying OTP:", error);
        errorEl.textContent = "Invalid OTP. Please try again.";
    } finally {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify OTP';
    }
}

// Function to show User Profile and Orders
function showUserProfile(user) {
    authSection.style.display = 'none';
    profileSection.style.display = 'block';
    logoutBtn.style.display = 'block';
    userPhoneSpan.textContent = user.phoneNumber;
    fetchOrders(user.uid);
}

// Function to show the login form
function showLoginForm() {
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    
    phoneForm.style.display = 'block';
    otpForm.style.display = 'none';
}

// Fetch and display orders for the logged-in user
async function fetchOrders(userId) {
    orderHistoryList.innerHTML = '<p>Loading your orders...</p>';
    
    try {
        const ordersRef = db.ref('orders').orderByChild('userId').equalTo(userId);
        ordersRef.on('value', (snapshot) => {
            const ordersObject = snapshot.val();
            if (!ordersObject) {
                orderHistoryList.innerHTML = '<p>You have not placed any orders yet.</p>';
                return;
            }

            const allUserOrders = Object.values(ordersObject).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            orderHistoryList.innerHTML = '';
            allUserOrders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';
                const orderDate = new Date(order.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
                const itemsHtml = order.items.map(item => `<li>${item.name} (x${item.quantity})</li>`).join('');
                const statusClass = order.status ? order.status.toLowerCase() : 'pending';

                orderCard.innerHTML = `
                    <div class="order-card-header">
                        <span class="order-card-date">${orderDate}</span>
                        <span class="order-card-status status-${statusClass}">${order.status}</span>
                    </div>
                    <div class="order-card-body">
                        <ul>${itemsHtml}</ul>
                    </div>
                    <div class="order-card-footer">
                        <strong>Total: ₹${order.totalAmount}</strong>
                    </div>
                `;
                orderHistoryList.appendChild(orderCard);
            });
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        orderHistoryList.innerHTML = '<p>Could not load your orders. Please try again.</p>';
    }
}

// === MAIN LOGIC ===
// Page load hote hi reCAPTCHA set up karein
setupRecaptcha();

// User login hai ya nahi, check karein
auth.onAuthStateChanged(user => {
    if (user) {
        showUserProfile(user);
    } else {
        showLoginForm();
    }
});

// Event Listeners ko add karein
phoneForm.addEventListener('submit', handleSendOtp);
otpForm.addEventListener('submit', handleVerifyOtp);
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});