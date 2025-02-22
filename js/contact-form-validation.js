document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message text-red-500 text-sm mt-1';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        input.classList.add('border-red-500');
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
        input.classList.remove('border-red-500');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate name
        const name = document.getElementById('name');
        if (name.value.trim() === '') {
            showError(name, 'Name is required');
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email');
        if (!emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }

        // Validate subject
        const subject = document.getElementById('subject');
        if (subject.value.trim() === '') {
            showError(subject, 'Subject is required');
            isValid = false;
        }

        // Validate message
        const message = document.getElementById('message');
        if (message.value.trim().length < 20) {
            showError(message, 'Message must be at least 20 characters');
            isValid = false;
        }

        if (isValid) {
            form.reset();
            alert('Message sent successfully!');
        }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
});
