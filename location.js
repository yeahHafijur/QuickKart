const storeLocation = { lat: 26.6468571, lng: 92.0754806 };//{ lat:24.757293, lng: 92.787320 }

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

async function getAddressFromCoords(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: {
                'User-Agent': 'QuickKart/1.0'
            }
        });
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

async function handleOrderWithLocation() {
    const btn = document.getElementById('placeOrderBtn');
    const spinner = document.getElementById('locationSpinner');
    const btnText = document.getElementById('btnText');
    const statusEl = document.getElementById('locationStatus');
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    // Basic validation
    if (!customerName || !customerPhone || customerPhone.length !== 10) {
        statusEl.textContent = 'Please enter your name and correct mobile number';
        return;
    }

    // Disable button during processing
    btn.disabled = true;
    spinner.style.display = 'inline-block';
    btnText.style.display = 'none';
    statusEl.textContent = 'Your location is being detected...';
    
    try {
        // Step 1: Get current location
        const position = await getCurrentPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        
        // Step 2: Check delivery area
        const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);
        
        if (distance > 5) {
            statusEl.innerHTML = `We do not deliver to your area (${distance.toFixed(1)} km away)<br>
                                 We deliver only in 5km from our store`;
            document.getElementById('deliveryFee').textContent = 'Not Available';
            return;
        }
        
        // Step 3: Get address from coordinates
        const address = await getAddressFromCoords(lat, lng);
        document.getElementById('autoAddress').value = address;
        document.getElementById('userLat').value = lat;
        document.getElementById('userLng').value = lng;
        
        // Step 4: Calculate delivery fee
        const deliveryFee = Math.round(distance * 5);
        document.getElementById('deliveryFee').textContent = `₹${deliveryFee}`;
        
        // Step 5: Submit order
        submitOrder();
        
    } catch (error) {
        console.error('Location/Order error:', error);
        if (error.code === error.PERMISSION_DENIED) {
            statusEl.innerHTML = `Location access permission denied<br>
                               Please send us your address on WhatsApp: 9716940448`;
        } else {
            statusEl.innerHTML = `location not detected<br>
                              Please send us your address on WhatsApp: 9716940448`;
        }
    } finally {
        spinner.style.display = 'none';
        btnText.style.display = 'inline-block';
        btn.disabled = false;
    }
}

function submitOrder() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('autoAddress').value;
    const lat = document.getElementById('userLat').value;
    const lng = document.getElementById('userLng').value;
    const deliveryFeeText = document.getElementById('deliveryFee').textContent;
    
    if (deliveryFeeText.includes('Not Available')) {
        showNotification("Delivery not available for your location", 'error');
        return;
    }

    const deliveryFee = deliveryFeeText === 'FREE' ? 0 : parseInt(deliveryFeeText.replace('₹', '')) || 0;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let message = `*New Order from QuickKart!*%0A%0A`;
    message += `*Customer Details:*%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A`;
    message += `Location: https://www.google.com/maps?q=${lat},${lng}%0A`;
    message += `%0A*Order Items:*%0A`;
    
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ₹${item.price}) = ₹${item.price * item.quantity}%0A`;
    });
    
    message += `%0A*Subtotal: ₹${subtotal}*%0A`;
    message += `*Delivery Fee: ₹${deliveryFee}*%0A`;
    message += `*Total: ₹${subtotal + deliveryFee}*%0A%0APlease confirm this order. Thank you!`;

    const whatsappNumber = "919716940448";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

    // Reset cart
    cart.length = 0;
    updateCartUI();
    closeCart();
}

// Initialize
document.getElementById('placeOrderBtn').addEventListener('click', handleOrderWithLocation);

export { storeLocation };