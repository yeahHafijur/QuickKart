// location.js (Updated with new store location)

import cart from './cart-data.js';
import { isShopOpen, db } from './firebase-config.js';
import { showNotification } from './utils.js';

// === YAHAN BADLAV KIYA GAYA HAI (STORE LOCATION UPDATED) ===
const storeLocation = { lat: 26.646883, lng: 92.075486 };

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
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
        // 1. Save order to Firebase
        const orderData = {
            customerName,
            customerPhone,
            address,
            location: { lat, lng },
            deliveryFee,
            totalAmount: cartTotal,
            items: cartItems,
            status: 'Pending', // Default status
            timestamp: new Date().toISOString()
        };
        await db.ref('orders').push(orderData);

        // 2. Prepare and send WhatsApp message
        const cartItemsText = cartItems.map(item =>
            ` ➤ ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}`
        ).join('\n');

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

📝 *Special Instructions (if any):*
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
    const btn = document.getElementById('placeOrderBtn');
    const spinner = document.getElementById('locationSpinner');
    const btnText = document.getElementById('btnText');
    const statusEl = document.getElementById('locationStatus');
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (cart.length === 0) {
        showNotification('Your cart is empty! Please add items to order.', 'error');
        return;
    }

    if (!isShopOpen) {
        statusEl.textContent = 'Shop is closed. Cannot place order.';
        return;
    }

    if (!customerName || !customerPhone || customerPhone.length !== 10) {
        statusEl.textContent = 'Please enter valid name and 10-digit mobile number';
        return;
    }

    btn.disabled = true;
    spinner.style.display = 'inline-block';
    btnText.style.display = 'none';
    statusEl.textContent = 'Detecting your location...';

    try {
        const position = await getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

        if (distance > 5) {
            statusEl.innerHTML = `Delivery not available (${distance.toFixed(1)} km away)<br>We deliver within 5km only`;
            document.getElementById('deliveryFee').textContent = 'Not Available';
            btn.disabled = false; // Re-enable button
            spinner.style.display = 'none';
            btnText.style.display = 'inline-block';
            return;
        }

        statusEl.textContent = 'Getting your address...';
        // YEH ASLI CODE HAI JO CUSTOMER KA ADDRESS NIKALEGA
        const address = await getAddressFromCoords(lat, lng);
        
        document.getElementById('autoAddress').value = address;
        document.getElementById('userLat').value = lat;
        document.getElementById('userLng').value = lng;

        let deliveryFee = 0;
        if (distance > 0 && distance <= 1) {
            deliveryFee = 10;
        } else if (distance > 1) {
            const extraDistance = distance - 1;
            deliveryFee = Math.round(10 + (extraDistance * 5));
        }
        document.getElementById('deliveryFee').textContent = `₹${deliveryFee}`;

        const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = itemTotal + deliveryFee;
        document.getElementById('cartTotal').textContent = `₹${total}`;

        const cartItemsCopy = JSON.parse(JSON.stringify(cart));
        const success = await sendWhatsAppOrder(customerName, customerPhone, address, lat, lng, deliveryFee, total, cartItemsCopy);

        if (success) {
            cart.length = 0;
            localStorage.setItem('quickKartCart', JSON.stringify(cart));
            // 'updateCartUI' ko dynamically import karke call karna, taaki circular dependency se bacha ja sake
            import('./cart.js').then(cartModule => {
                if (typeof cartModule.updateCartUI === 'function') {
                    cartModule.updateCartUI();
                }
            });
            statusEl.textContent = 'Order sent successfully!';
        } else {
            throw new Error('Failed to send or save the order.');
        }
    } catch (error) {
        console.error('Order error:', error);
        let errorMessage = 'Order processing failed';
        if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Please enable location permissions';
        }
        statusEl.innerHTML = `${errorMessage}<br>Contact us at 9716940448`;
        document.getElementById('deliveryFee').textContent = '--';
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