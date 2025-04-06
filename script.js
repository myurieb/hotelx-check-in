// Initialize EmailJS
(function() {
    emailjs.init("Yp3zOP64B700kB6YT");
})();

// Form handling
const checkinForm = document.getElementById("checkin-form");
const formInputs = checkinForm.querySelectorAll('input, textarea');

checkinForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        emailjs.sendForm("service_wguu6vp", "template_7afvlgh", this)
            .then(function(response) {
                showNotification('Check-in form sent successfully!', 'success');
                checkinForm.reset();
            })
            .catch(function(error) {
                showNotification('Failed to send form. Please try again.', 'error');
            })
            .finally(function() {
                submitButton.textContent = 'Check-In';
                submitButton.disabled = false;
            });
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    
    formInputs.forEach(input => {
        if (input.required && !input.value) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
    }

    return isValid;
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add these styles to your CSS file
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        background-color: #4CAF50;
    }

    .notification.error {
        background-color: #f44336;
    }

    .error {
        border-color: #f44336 !important;
    }
`;
document.head.appendChild(style);