// Initialize AOS
AOS.init({
    duration: 800,
    offset: 50,
    once: true
});

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchToggle = document.querySelector('.search-toggle');
const cartToggle = document.querySelector('.cart-toggle');
const wishlistToggle = document.querySelector('.wishlist-toggle');
const cartModal = document.querySelector('.cart-modal');
const notification = document.querySelector('.notification');

// Product Data
const products = [
    {
        id: 1,
        name: "Floral Summer Dress",
        price: 59.99,
        category: "dresses",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
        description: "Beautiful floral print summer dress perfect for any occasion.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Pink", "Blue", "White"],
        inStock: true,
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Elegant Evening Gown",
        price: 129.99,
        category: "dresses",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
        description: "Stunning evening gown for special occasions.",
        sizes: ["S", "M", "L"],
        colors: ["Black", "Red", "Navy"],
        inStock: true,
        rating: 4.8,
        reviews: 89
    },
    {
        id: 3,
        name: "Casual Denim Jacket",
        price: 79.99,
        category: "outerwear",
        image: "https://images.unsplash.com/photo-1527718641255-324f8e2d0421?w=500",
        description: "Classic denim jacket, perfect for layering.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blue", "Light Blue"],
        inStock: true,
        rating: 4.3,
        reviews: 156
    },
    {
        id: 4,
        name: "Bohemian Maxi Skirt",
        price: 49.99,
        category: "bottoms",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
        description: "Flowing maxi skirt with bohemian print.",
        sizes: ["S", "M", "L"],
        colors: ["Multi"],
        inStock: true,
        rating: 4.6,
        reviews: 94
    }
];

// State Management
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let currentSort = 'featured';
let selectedSize = 'all';
let selectedColor = 'all';

// Load cart from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
    loadProducts();
});

// Cart Toggle
cartToggle.addEventListener('click', () => {
    cartModal.classList.add('active');
    updateCart();
});

// Close Cart
function closeCart() {
    cartModal.classList.remove('active');
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
    showNotification('Added to cart successfully!');
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update Cart Display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalAmount.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;

    // Enable/disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        updateCartCount();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    window.location.href = 'checkout.html';
}

// Show Notification
function showNotification(message) {
    const notification = document.querySelector('.notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load Products
function loadProducts(productsToShow = products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button onclick="quickView(${product.id})" class="quick-view-btn">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="toggleWishlist(${product.id})" class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="rating">
                    ${generateRatingStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="cta-button" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            const filtered = category === 'all' ? products : products.filter(p => p.category === category);
            loadProducts(filtered);
        });
    });

    // Initialize sort
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            let sorted = [...products];
            
            switch(value) {
                case 'price-low':
                    sorted.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    sorted.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    sorted.sort((a, b) => b.rating - a.rating);
                    break;
            }
            
            loadProducts(sorted);
        });
    }
});

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    } else {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist!');
    }
    updateWishlist();
    loadProducts();
}

function updateWishlist() {
    const wishlistCount = document.querySelector('.wishlist-count');
    wishlistCount.textContent = wishlist.length;
}

// Quick View Function
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal modal';
    
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal">&times;</button>
            <div class="quick-view-grid">
                <div class="product-images">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <div class="rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <div class="product-options">
                        <div class="size-selector">
                            <h4>Size:</h4>
                            <div class="options">
                                ${product.sizes.map(size => `
                                    <button class="size-option">${size}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="color-selector">
                            <h4>Color:</h4>
                            <div class="options">
                                ${product.colors.map(color => `
                                    <button class="color-option" style="background-color: ${color.toLowerCase()}">${color}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button onclick="addToCart(${product.id})" class="cta-button">Add to Cart</button>
                        <button onclick="toggleWishlist(${product.id})" class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// Generate Rating Stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}
