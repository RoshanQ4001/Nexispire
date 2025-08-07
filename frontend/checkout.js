document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Get package details from URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageType = urlParams.get('package') || 'basic';
    
    // Set package details
    const packages = {
        basic: {
            name: 'Basic Package',
            price: 29999,
            features: [
                '5 GB Storage',
                'Single Domain',
                'Email Support',
                'SSL Certificate',
                'Daily Backups'
            ]
        },
        standard: {
            name: 'Standard Package',
            price: 49999,
            features: [
                '20 GB Storage',
                'Up to 5 Domains',
                '24/7 Support',
                'Free Domain',
                'Advanced Analytics'
            ]
        },
        premium: {
            name: 'Premium Package',
            price: 99999,
            features: [
                'Unlimited Storage',
                'Unlimited Domains',
                'Priority Support',
                'Dedicated Manager',
                'E-commerce Ready'
            ]
        }
    };
    
    const selectedPackage = packages[packageType];
    
    document.getElementById('package-name').textContent = selectedPackage.name;
    document.getElementById('package-price').textContent = `₹${selectedPackage.price.toLocaleString()}`;
    
    const featuresList = document.getElementById('package-features');
    featuresList.innerHTML = selectedPackage.features.map(feature => 
        `<li><i data-lucide="check"></i> ${feature}</li>`
    ).join('');
    
    // Handle form submission
    const paymentForm = document.getElementById('paymentForm');
    const rzpContainer = document.getElementById('razorpay-container');
    const rzpButton = document.getElementById('rzp-button');
    
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Show loading state
        const submitButton = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
        submitButton.disabled = true;
        
        try {
            // Create order on your server
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    package: packageType,
                    amount: selectedPackage.price,
                    name,
                    email,
                    phone
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }
            
            // Initialize Razorpay
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
                amount: data.order.amount,
                currency: "INR",
                name: "NEXispire",
                description: selectedPackage.name,
                image: "/images/logo.jpg",
                order_id: data.order.id,
                handler: async function(response) {
                    // Verify payment on your server
                    const verificationResponse = await fetch('/api/payment/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }),
                    });
                    
                    const verificationData = await verificationResponse.json();
                    
                    if (verificationResponse.ok) {
                        // Payment successful
                        window.location.href = `/thank-you.html?order_id=${verificationData.order._id}`;
                    } else {
                        alert('Payment verification failed: ' + (verificationData.message || 'Unknown error'));
                    }
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: phone
                },
                theme: {
                    color: "#3b82f6"
                }
            };
            
            const rzp = new Razorpay(options);
            
            // Hide form and show Razorpay button
            paymentForm.style.display = 'none';
            rzpContainer.style.display = 'block';
            
            rzpButton.addEventListener('click', function() {
                rzp.open();
            });
            
            // Auto-open Razorpay (optional)
            rzp.open();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Payment processing failed: ' + error.message);
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            lucide.createIcons();
        }
    });
});