const storeLocation = { lat: 26.6468571, lng: 92.0754806 };

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

function setupLocation() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationDisplay = document.getElementById('locationDisplay');
    const customerAddressInput = document.getElementById('customerAddress');
    const userLatInput = document.getElementById('userLat');
    const userLngInput = document.getElementById('userLng');
    const orderBtn = document.getElementById('orderBtn');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const cartTotalElement = document.getElementById('cartTotal');

    getLocationBtn.addEventListener('click', () => {
        locationDisplay.textContent = 'Fetching location...';
        orderBtn.disabled = true;

        if (!navigator.geolocation) {
            locationDisplay.textContent = 'Geolocation not supported by your browser';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

                if (distance > 5) {
                    locationDisplay.textContent = `Sorry, delivery not available beyond 5 km (You are ${distance.toFixed(2)} km away)`;
                    deliveryFeeElement.textContent = 'Not Available';
                    customerAddressInput.value = '';
                    userLatInput.value = '';
                    userLngInput.value = '';
                    orderBtn.disabled = true;
                } else {
                    const deliveryFee = Math.round(distance * 5);
                    deliveryFeeElement.textContent = `₹${deliveryFee}`;
                    
                    // Calculate cart total (you'll need to access your cart data here)
                    const cartTotal = 0; // Replace with actual cart total calculation
                    cartTotalElement.textContent = `₹${cartTotal + deliveryFee}`;
                    
                    userLatInput.value = lat;
                    userLngInput.value = lng;

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
                        const data = await response.json();
                        
                        if (data?.address) {
                            const addr = data.address;
                            const parts = [
                                addr.house_number, addr.road, addr.suburb,
                                addr.city || addr.town || addr.village,
                                addr.state, addr.postcode, addr.country
                            ].filter(Boolean);
                            customerAddressInput.value = parts.join(', ');
                            locationDisplay.textContent = 'Location fetched! Delivery fee calculated.';
                            orderBtn.disabled = false;
                        } else {
                            locationDisplay.textContent = 'Could not determine address';
                        }
                    } catch (error) {
                        console.error('Geocoding error:', error);
                        locationDisplay.textContent = 'Failed to fetch address details. Please try again later.';
                        // Fallback - at least store the coordinates
                        customerAddressInput.value = `Near coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        orderBtn.disabled = false;
                    }
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        locationDisplay.textContent = 'Permission denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationDisplay.textContent = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        locationDisplay.textContent = 'The request to get location timed out.';
                        break;
                    default:
                        locationDisplay.textContent = 'An unknown error occurred.';
                }
                orderBtn.disabled = true;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // 10 seconds
                maximumAge: 0 // Don't use cached position
            }
        );
    });
}

export { storeLocation, setupLocation };