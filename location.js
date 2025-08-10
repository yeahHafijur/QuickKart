// location.js (UPDATED AND CORRECTED CODE)

import cart from './cart-data.js';
import { isShopOpen, db, auth } from './firebase-config.js'; // auth ko import karein
import { showNotification } from './utils.js';

const storeLocation = { lat: 26.646883, lng: 92.075486 };

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    });
}

async function getAddressFromCoords(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'User-Agent': 'QuickKart/1.0' }
        });
        if (!response.ok) throw new Error('Geocoding failed');
        const data = await response.json();
        if (data?.address) {
            const addr = data.address;
            const parts = [
                addr.house_number, addr.road, addr.suburb,
                addr.city || addr.town || addr.village,
                addr.state, addr.postcode, addr.country
            ].filter(Boolean);
            return parts.join(', ');
        }
        return `Near coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
        console.error('Geocoding error:', error);
        return `Near coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

async function sendWhatsAppOrder(customerName, customerPhone, address, lat, lng, deliveryFee, cartTotal, cartItems) {
    try {
        const user = auth.currentUser;
        if (!user) {
            showNotification('Please login to place an order.', 'error');
            return false;
        }
        
        const orderData = {
            userId: user.uid,
            customerName,
            customerPhone,
            address,
            location: { lat, lng },
            deliveryFee,
            totalAmount: cartTotal,
            items: cartItems,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };
        await db.ref('orders').push(orderData);

        const cartItemsText = cartItems.map(item =>
            ` ➤ ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}`
        ).join('\n');

        // === YAHAN BHI LINK THEEK KIYA GAYA HAI ===
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;

        const message = `✨ *New QuickKart Order!* ✨
====================

*CUSTOMER DETAILS*
👤 *Name:* ${customerName}
📞 *Phone:* +91${customerPhone}
📍 *Address:*
${address}

🗺️ *Open Location on Map:*
${mapsLink}

----------------------------------------

*ORDER SUMMARY*
🛒 *Items:*
${cartItemsText}

----------------------------------------

*BILL DETAILS*
  Subtotal: ₹${cartTotal - deliveryFee}
  Delivery Fee: ₹${deliveryFee}
  *Total Amount: ₹${cartTotal}*

====================
`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919716940448?text=${encodedMessage}`, '_blank');
        return true;
    } catch (error) {
        console.error('Order processing error:', error);
        showNotification('Could not save or send the order.', 'error');
        return false;
    }
}

async function handleOrderWithLocation() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        showNotification('Something went wrong. Please login again.', 'error');
        return;
    }

    if (cart.length === 0) return showNotification('Your cart is empty!', 'error');
    if (!isShopOpen) return showNotification('Shop is currently closed.', 'error');
    
    const customerName = currentUser.displayName || 'Guest';
    const customerPhone = currentUser.phoneNumber.replace('+91', '');

    const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (itemTotal < 50) return showNotification('Minimum order value is ₹50.', 'error');

    const btn = document.getElementById('placeOrderBtn');
    const spinner = document.getElementById('locationSpinner');
    const btnText = document.getElementById('btnText');
    const statusEl = document.getElementById('locationStatus');
    
    btn.disabled = true;
    spinner.style.display = 'inline-block';
    btnText.style.display = 'none';
    statusEl.textContent = 'Detecting your location...';

    try {
        const position = await getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

        if (distance > 5) {
            statusEl.innerHTML = `Delivery not available (${distance.toFixed(1)} km away)`;
            return;
        }

        const address = await getAddressFromCoords(lat, lng);
        let deliveryFee = 0;
        if (distance > 0 && distance <= 1) deliveryFee = 10;
        else if (distance > 1) deliveryFee = Math.round(10 + ((distance - 1) * 5));
        
        const total = itemTotal + deliveryFee;
        const cartItemsCopy = JSON.parse(JSON.stringify(cart));
        
        const success = await sendWhatsAppOrder(customerName, customerPhone, address, lat, lng, deliveryFee, total, cartItemsCopy);

        if (success) {
            cart.length = 0;
            localStorage.setItem('quickKartCart', JSON.stringify(cart));
            import('./cart.js').then(cartModule => cartModule.updateCartUI());
            statusEl.textContent = 'Order sent successfully!';
        }
    } catch (error) {
        console.error('Order error:', error);
        statusEl.innerHTML = `Order processing failed. Please try again.`;
    } finally {
        spinner.style.display = 'none';
        btnText.style.display = 'inline-block';
        btn.disabled = false;
    }
}

function initLocation() {
    const orderBtn = document.getElementById('placeOrderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', handleOrderWithLocation);
    }
}

export { initLocation };