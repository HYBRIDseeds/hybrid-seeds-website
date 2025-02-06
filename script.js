// Mobile Menu Toggle
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuIcon.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Stripe Integration (Replace with your publishable key)
const stripe = Stripe('pk_test_your_stripe_key_here'); 

// Simple Cart Logic
let cartItems = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = e.target.closest('.product-card');
        const productName = product.querySelector('h3').textContent;
        const price = parseFloat(product.querySelector('p').textContent.replace('$', ''));
        
        cartItems.push({ name: productName, price: price });
        alert(`${productName} added to cart!`);
    });
});

// Checkout Handler
document.getElementById('checkout-button').addEventListener('click', async () => {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    try {
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cartItems,
            }),
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        
        if (result.error) {
            alert(result.error.message);
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Payment failed. Please try again.');
    }
});