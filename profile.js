// profile.js (REPLACE ENTIRE FILE WITH THIS)

import { db, auth, firebase } from './firebase-config.js';

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
// New Referral Elements
const couponBalanceEl = document.getElementById('couponBalance');
const referralCodeEl = document.getElementById('referralCode');
const shareReferralBtn = document.getElementById('shareReferralBtn');


// Function to set up and render the reCAPTCHA verifier
function setupRecaptcha() {
    try {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
            'size': 'invisible',
            'callback': (response) => console.log("reCAPTCHA verified."),
        });
        window.recaptchaVerifier.render().catch(err => {
             console.error("reCAPTCHA render error:", err);
             errorEl.textContent = "Could not start login verification. Please refresh.";
        });
    } catch (err) {
        console.error("Error creating reCAPTCHA verifier:", err);
        errorEl.textContent = "Login service failed to load. Refresh page.";
    }
}

// Generate a random referral code
function generateReferralCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}


// Handle Phone Form Submission (Send OTP)
async function handleSendOtp(e) {
    e.preventDefault();
    errorEl.textContent = '';
    sendOtpBtn.disabled = true;
    sendOtpBtn.textContent = 'Sending...';
    
    const name = document.getElementById('loginName').value.trim();
    const phoneNumberInput = document.getElementById('phoneNumber').value;
    const referredByCode = document.getElementById('referredByCode').value.trim().toUpperCase();

    if (!name || phoneNumberInput.length !== 10) {
        errorEl.textContent = "Please enter name and a valid 10-digit number.";
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
        return;
    }
    
    sessionStorage.setItem('userNameForSignup', name);
    if(referredByCode) {
        sessionStorage.setItem('referredByCode', referredByCode);
    }

    const fullPhoneNumber = "+91" + phoneNumberInput;
    const appVerifier = window.recaptchaVerifier;

    try {
        const confirmationResult = await auth.signInWithPhoneNumber(fullPhoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        phoneForm.style.display = 'none';
        otpForm.style.display = 'block';
        alert('OTP has been sent!');
    } catch (error) {
        console.error("Error sending OTP:", error);
        errorEl.textContent = "Failed to send OTP. Is the number correct?";
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId));
        }
    } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
    }
}


// Handle OTP Verification
// Handle OTP Verification
async function handleVerifyOtp(e) {
    e.preventDefault();
    errorEl.textContent = '';
    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = 'Verifying...';
    const otp = document.getElementById('otpInput').value;

    try {
        const result = await window.confirmationResult.confirm(otp);
        const user = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;
        const storedName = sessionStorage.getItem('userNameForSignup');
        
        if (isNewUser) {
            const newReferralCode = generateReferralCode();
            const userRef = db.ref(`users/${user.uid}`);
            
            const userData = {
                displayName: storedName,
                phoneNumber: user.phoneNumber,
                couponBalance: 0,
                referralCode: newReferralCode
            };
            
            const referredByCode = sessionStorage.getItem('referredByCode');
            if (referredByCode) {
                userData.referredBy = referredByCode;
            }

            await userRef.set(userData);
            await user.updateProfile({ displayName: storedName });

        } else if (storedName) {
             await user.updateProfile({ displayName: storedName });
             await db.ref(`users/${user.uid}/displayName`).set(storedName);
        }

        sessionStorage.removeItem('userNameForSignup');
        sessionStorage.removeItem('referredByCode');

        // YEH HAI ASLI LOGIC: Flag check karke redirect karna
        if (sessionStorage.getItem('loginRedirectToCart') === 'true') {
            sessionStorage.removeItem('loginRedirectToCart');
            window.location.href = 'index.html?openCart=true';
        } else {
            // Agar user normal profile page se login kar raha hai, to use yahin rakho
            showUserProfile(user); 
        }
        
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
    userPhoneSpan.textContent = user.displayName ? `${user.displayName} (${user.phoneNumber})` : user.phoneNumber;
    
    const userRef = db.ref(`users/${user.uid}`);
    userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            couponBalanceEl.textContent = userData.couponBalance || 0;
            referralCodeEl.textContent = userData.referralCode || 'Not generated';
        }
    });

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


// Helper function for progress bar
function getProgress(status) {
    if (status === 'Confirmed') return { width: '50%', text: 'Order Confirmed' };
    if (status === 'Completed') return { width: '100%', text: 'Order Delivered' };
    return { width: '10%', text: 'Order Placed' };
}

// Fetch and display orders for the logged-in user
async function fetchOrders(userId) {
    orderHistoryList.innerHTML = '<p>Loading orders...</p>';
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
                const progress = getProgress(order.status);
                
                const deliveryMessage = (order.status === 'Confirmed' || order.status === 'Out for Delivery')
                    ? `<div class="delivery-estimate"><i class="fas fa-shipping-fast"></i> Your order will be delivered within 25 min</div>` 
                    : '';

                orderCard.innerHTML = `
                    <div class="order-card-header">
                        <span class="order-card-date">${orderDate}</span>
                        <strong class="order-card-total">₹${order.totalAmount}</strong>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar" style="width: ${progress.width};"></div>
                        </div>
                        <div class="progress-text">${progress.text}</div>
                    </div>
                    ${deliveryMessage} 
                    <div class="order-card-body">
                        <strong>Items:</strong>
                        <ul>${itemsHtml}</ul>
                    </div>`;
                orderHistoryList.appendChild(orderCard);
            });
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        orderHistoryList.innerHTML = '<p>Could not load orders. Please try again.</p>';
    }
}

// === MAIN LOGIC & EVENT LISTENERS ===
setupRecaptcha();

auth.onAuthStateChanged(user => {
    // Check if user exists AND has a phone number (is not an admin)
    if (user && user.phoneNumber) {
        showUserProfile(user);
    } else {
        // If no user or user is an admin, show login form
        showLoginForm();
    }
});

phoneForm.addEventListener('submit', handleSendOtp);
otpForm.addEventListener('submit', handleVerifyOtp);
logoutBtn.addEventListener('click', () => auth.signOut());

shareReferralBtn.addEventListener('click', () => {
    const code = referralCodeEl.textContent;
    if (navigator.share) {
        navigator.share({
            title: 'Join me on QuickKart!',
            text: `Get your groceries delivered in minutes! Use my referral code *${code}* when you sign up.`,
            url: window.location.origin,
        });
    } else {
        navigator.clipboard.writeText(code);
        alert(`Referral code "${code}" copied to clipboard!`);
    }
});