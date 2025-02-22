document.addEventListener('DOMContentLoaded', () => {
    // Load header
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('afterbegin', data);
        });

    // Load footer
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('beforeend', data);
        });
});
