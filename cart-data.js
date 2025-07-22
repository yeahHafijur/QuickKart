let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem('quickKartCart')) || [];
    
    // Validate saved cart data
    cart = savedCart.filter(item => 
        item && 
        item.name &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
    
    // Fix any invalid quantities
    cart.forEach(item => {
        item.quantity = Math.min(Math.max(1, item.quantity), 100);
    });
    
    // Save validated cart back to storage
    localStorage.setItem('quickKartCart', JSON.stringify(cart));
} catch (e) {
    console.error('Cart initialization error:', e);
    cart = [];
    localStorage.removeItem('quickKartCart');
}

export default cart;