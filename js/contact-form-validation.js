document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return; // Guard clause if form doesn't exist

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        input.classList.add('error');
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
        input.classList.remove('error');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Get form elements
        const email = form.querySelector('#email');
        const subject = form.querySelector('#subject');
        const message = form.querySelector('#message');

        // Clear previous errors
        [email, subject, message].forEach(clearError);

        // Validate email
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate subject
        if (!subject.value.trim()) {
            showError(subject, 'Subject is required');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim() || message.value.trim().length < 20) {
            showError(message, 'Message must be at least 20 characters');
            isValid = false;
        }

        if (isValid) {
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const successMessage = document.getElementById('success-message');
                    successMessage.classList.add('show');
                    form.reset();
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 3000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                showError(email, 'Failed to send message. Please try again later.');
            }
        }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
});