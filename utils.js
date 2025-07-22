// utils.js
export function showNotification(msg, type = 'success') {
    try {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.warn('Notification element not found');
            return;
        }
        
        notification.textContent = msg;
        notification.className = `quickkart-notification show ${type}`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } catch (error) {
        console.error('Notification error:', error);
    }
}

// New debug function
export function debugCart() {
    console.log('Current Cart:', JSON.parse(JSON.stringify(cart)));
}