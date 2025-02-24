document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showError = (input, message) => {
        const formGroup = input.closest('div');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.textContent = message;
        } else {
            const newError = document.createElement('span');
            newError.className = 'error-message text-red-500 text-sm mt-1';
            newError.textContent = message;
            formGroup.appendChild(newError);
        }
        input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    };

    const clearError = (input) => {
        const formGroup = input.closest('div');
        const error = formGroup.querySelector('.error-message');
        if (error) error.remove();
        input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        input.classList.add('focus:border-blue-500', 'focus:ring-blue-500');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        const email = form.querySelector('#email');
        const subject = form.querySelector('#subject');
        const message = form.querySelector('#message');

        [email, subject, message].forEach(clearError);

        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!subject.value.trim()) {
            showError(subject, 'Subject is required');
            isValid = false;
        }

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
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                    successMessage.textContent = 'Message sent successfully!';
                    form.parentNode.insertBefore(successMessage, form.nextSibling);
                    form.reset();
                    setTimeout(() => successMessage.remove(), 3000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                showError(email, 'Failed to send message. Please try again later.');
            }
        }
    });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });
});