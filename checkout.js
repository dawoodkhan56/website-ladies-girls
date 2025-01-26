// Initialize AOS
AOS.init({
    duration: 800,
    offset: 50,
    once: true
});

// Get cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let shippingMethod = 'standard';
let promoCode = '';

// Load order summary
function loadOrderSummary() {
    const summaryItems = document.querySelector('.summary-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const shippingAmount = document.querySelector('.shipping-amount');
    const totalAmount = document.querySelector('.total-amount');

    // Display cart items
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
                <span class="item-quantity">${item.quantity}</span>
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>Size: ${item.size || 'N/A'}</p>
                <p>Color: ${item.color || 'N/A'}</p>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'express' ? 15 : 0;
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;

    // Update summary
    subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    shippingAmount.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Calculate discount based on promo code
function calculateDiscount(subtotal) {
    switch(promoCode.toUpperCase()) {
        case 'FREESHIP':
            return 0; // Free shipping is handled separately
        case 'SAVE10':
            return subtotal * 0.1;
        case 'SAVE20':
            return subtotal * 0.2;
        default:
            return 0;
    }
}

// Handle shipping method change
document.querySelectorAll('input[name="shipping"]').forEach(input => {
    input.addEventListener('change', (e) => {
        shippingMethod = e.target.value;
        loadOrderSummary();
    });
});

// Handle promo code
document.querySelector('.apply-btn').addEventListener('click', () => {
    const promoInput = document.querySelector('.promo-code input');
    const code = promoInput.value.trim().toUpperCase();
    const validCodes = ['FREESHIP', 'SAVE10', 'SAVE20'];

    if (validCodes.includes(code)) {
        promoCode = code;
        loadOrderSummary();
        showNotification('Promo code applied successfully!');
    } else {
        showNotification('Invalid promo code');
    }
});

// Form validation
function validateForm() {
    const required = [
        'email',
        'phone',
        'firstName',
        'lastName',
        'address',
        'city',
        'country',
        'zipCode'
    ];

    let isValid = true;
    required.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Proceed to payment
function proceedToPayment() {
    if (!validateForm()) {
        showNotification('Please fill in all required fields');
        return;
    }

    // Collect form data
    const formData = {
        contact: {
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        },
        shipping: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            apartment: document.getElementById('apartment').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            zipCode: document.getElementById('zipCode').value
        },
        order: {
            items: cart,
            shipping: shippingMethod,
            promoCode: promoCode
        }
    };

    // Save order data
    localStorage.setItem('orderData', JSON.stringify(formData));

    // Redirect to payment page (you would need to create this)
    window.location.href = 'payment.html';
}

// Show notification
function showNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
});
