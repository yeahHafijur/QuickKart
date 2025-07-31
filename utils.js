// utils.js
export function showNotification(msg, type = 'success') {
    try {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        const notificationIcon = notification.querySelector('i');

        if (!notification || !notificationText || !notificationIcon) {
            console.warn('Notification elements not found');
            return;
        }

        notificationText.textContent = msg;

        // Reset classes
        notification.className = 'quickkart-notification';
        notificationIcon.className = '';

        // Add new classes based on type
        setTimeout(() => {
            notification.classList.add('show', type);
            if (type === 'success') {
                notificationIcon.classList.add('fas', 'fa-check-circle');
            } else if (type === 'error') {
                notificationIcon.classList.add('fas', 'fa-times-circle');
            } else if (type === 'info') {
                notificationIcon.classList.add('fas', 'fa-info-circle');
            }
        }, 10); // Small delay to ensure transition triggers

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } catch (error) {
        console.error('Notification error:', error);
    }
}

// CORRECTED: 'cart' ko as a parameter receive karega
export function debugCart(cart) {
    if (cart) {
        console.log('Current Cart:', JSON.parse(JSON.stringify(cart)));
    }
}