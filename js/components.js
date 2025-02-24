document.addEventListener('DOMContentLoaded', async () => {
    console.log('Components.js: DOM loaded');
    
    try {
        // Load header
        const headerResponse = await fetch('partials/header.html');
        if (!headerResponse.ok) throw new Error(`HTTP error! status: ${headerResponse.status}`);
        const headerData = await headerResponse.text();
        document.body.insertAdjacentHTML('afterbegin', headerData);
        console.log('Components.js: Header inserted into DOM');
        
        // Dispatch headerLoaded event
        document.dispatchEvent(new CustomEvent('headerLoaded', { detail: { timestamp: Date.now() } }));

        // Load footer
        const footerResponse = await fetch('partials/footer.html');
        if (!footerResponse.ok) throw new Error(`HTTP error! status: ${footerResponse.status}`);
        const footerData = await footerResponse.text();
        document.body.insertAdjacentHTML('beforeend', footerData);
        console.log('Components.js: Footer inserted into DOM');

        // Apply Tailwind classes to dynamically loaded content
        document.querySelectorAll('header, footer').forEach(el => {
            el.classList.add('w-full', 'bg-gray-900', 'text-white', 'shadow-lg');
        });
    } catch (error) {
        console.error('Components.js: Error loading components:', error);
    }
});