document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("VZ0lPb_WctL7SQOcs");
    
    const checkInForm = document.getElementById('checkInForm');
    const errorMessage = document.getElementById('errorMessage');
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    function validateForm() {
        let isValid = true;
        const inputs = checkInForm.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('error');
            
            if (!input.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            }
        });

        // Validate dates
        const checkIn = new Date(document.getElementById('checkInDate').value);
        const checkOut = new Date(document.getElementById('checkOutDate').value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            showError('Check-in date cannot be in the past');
            return false;
        }

        if (checkOut <= checkIn) {
            showError('Check-out date must be after check-in date');
            return false;
        }

        return isValid;
    }
    
    checkInForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showError('Please fill in all required fields correctly');
            return;
        }

        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            showError('Please select a payment method');
            return;
        }

        try {
            const templateParams = {
                from_name: "Hotel X",
                to_name: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
                to_email: document.getElementById('email').value,
                reservation_number: document.getElementById('reservationNumber').value,
                phone_number: document.getElementById('phoneNumber').value,
                check_in_date: document.getElementById('checkInDate').value,
                check_out_date: document.getElementById('checkOutDate').value,
                arrival_time: document.getElementById('arrivalTime').value,
                special_requests: document.getElementById('specialRequests').value || 'None',
                payment_method: paymentMethod.value
            };

            const submitButton = document.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            const response = await emailjs.send('service_wguu6vp', 'template_7afvlgh', templateParams);
            
            if (response.status === 200) {
                alert('Check-in successful! A confirmation email has been sent to your email address.');
                checkInForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Failed:', error);
            showError('Error sending email. Please try again.');
        } finally {
            const submitButton = document.querySelector('.submit-btn');
            submitButton.disabled = false;
            submitButton.textContent = 'PROCEED WITH CHECK-IN';
        }
    });

    // Navigation active state
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set minimum date for check-in and check-out
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
});