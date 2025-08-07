/**
 * NEXispire Main JavaScript File
 * Handles:
 * - Mobile menu toggle
 * - Contact form submission
 * - Scroll effects
 * - Animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // Mobile Menu Functionality
  // ======================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  const body = document.body;

  if (mobileMenuToggle && navbarMenu) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      body.classList.toggle('no-scroll');
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.navbar-links a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbarMenu.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });
  }

  // ======================
  // Scroll Effects
  // ======================
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ======================
  // Contact Form Handling
  // ======================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Sending...';
      submitButton.disabled = true;
      
      try {
        const formData = {
          name: this.name.value,
          email: this.email.value,
          phone: this.phone.value,
          subject: this.subject.value,
          message: this.message.value
        };
        
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
          this.reset();
        } else {
          throw new Error(data.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
        showNotification('There was an error sending your message. Please try again later.', 'error');
      } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons();
      }
    });
  }

  // ======================
  // Notification System
  // ======================
  function showNotification(message, type) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const successIcon = document.querySelector('.notification-icon.success');
    const errorIcon = document.querySelector('.notification-icon.error');
    
    notificationMessage.textContent = message;
    
    if (type === 'success') {
      successIcon.style.display = 'block';
      errorIcon.style.display = 'none';
      notification.classList.add('notification-show');
      notification.classList.remove('notification-hidden');
    } else {
      successIcon.style.display = 'none';
      errorIcon.style.display = 'block';
      notification.classList.add('notification-show');
      notification.classList.remove('notification-hidden');
    }
    
    // Hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('notification-show');
      notification.classList.add('notification-hidden');
    }, 5000);
  }

  // ======================
  // Animation on Scroll
  // ======================
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initialize animated elements
  const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Run on load and scroll
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);

  // ======================
  // Utility Functions
  // ======================
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Initialize icons
  lucide.createIcons();

  // Add loading animation style
  const style = document.createElement('style');
  style.textContent = `
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
});