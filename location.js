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

function setupLocation(elements) {
    elements.getLocationBtn.addEventListener('click', () => {
        elements.locationDisplay.textContent = 'Fetching location...';
        elements.orderBtn.disabled = true;

        if (!navigator.geolocation) {
            elements.locationDisplay.textContent = 'Geolocation not supported by your browser';
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const distance = getDistanceFromLatLonInKm(storeLocation.lat, storeLocation.lng, lat, lng);

                if (distance > 5) {
                    elements.locationDisplay.textContent = `Sorry, delivery not available beyond 5 km (You are ${distance.toFixed(2)} km away)`;
                    document.getElementById('deliveryFee').textContent = 'Not Available';
                    elements.customerAddressInput.value = '';
                    elements.userLatInput.value = '';
                    elements.userLngInput.value = '';
                    elements.orderBtn.disabled = true;
                } else {
                    const deliveryFee = Math.round(distance * 5);
                    document.getElementById('deliveryFee').textContent = `₹${deliveryFee}`;
                    
                    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    elements.cartTotal.textContent = `₹${cartTotal + deliveryFee}`;
                    
                    elements.userLatInput.value = lat;
                    elements.userLngInput.value = lng;

                    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data?.address) {
                                const addr = data.address;
                                const parts = [
                                    addr.house_number, addr.road, addr.suburb,
                                    addr.city || addr.town || addr.village,
                                    addr.state, addr.postcode, addr.country
                                ].filter(Boolean);
                                elements.customerAddressInput.value = parts.join(', ');
                                elements.locationDisplay.textContent = 'Location fetched! Delivery fee calculated.';
                                elements.orderBtn.disabled = false;
                            } else {
                                elements.locationDisplay.textContent = 'Could not determine address';
                            }
                        })
                        .catch(() => {
                            elements.locationDisplay.textContent = 'Failed to fetch address details';
                        });
                }
            },
            error => {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        elements.locationDisplay.textContent = 'Permission denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        elements.locationDisplay.textContent = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        elements.locationDisplay.textContent = 'The request to get location timed out.';
                        break;
                    default:
                        elements.locationDisplay.textContent = 'An unknown error occurred.';
                }
                elements.orderBtn.disabled = true;
            }
        );
    });
}

export { storeLocation, setupLocation };