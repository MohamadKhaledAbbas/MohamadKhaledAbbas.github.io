document.addEventListener('DOMContentLoaded', () => {
    console.log('Components.js: DOM loaded');
    
    // Load header
    fetch('partials/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('afterbegin', data);
            console.log('Components.js: Header inserted into DOM');
            
            // Initialize mobile menu immediately after header is inserted
            const event = new CustomEvent('headerLoaded', { detail: { timestamp: Date.now() } });
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error('Components.js: Error loading header:', error);
        });

    // Load footer
    fetch('partials/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('beforeend', data);
            console.log('Components.js: Footer inserted into DOM');
        })
        .catch(error => {
            console.error('Components.js: Error loading footer:', error);
        });
});