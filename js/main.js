console.log('main.js loaded')

document.addEventListener('DOMContentLoaded', () => {
    console.log('Main.js: DOM fully loaded');

    // Wait for header to be loaded
    if (document.querySelector('.mobile-menu-btn')) {
        initMobileMenu();
    } else {
        document.addEventListener('headerLoaded', () => {
            console.log('Main.js: Header loaded event received');
            initMobileMenu();
        });
    }
    initContactForm();
    initProjectFilters();
});

function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-16');
            navLinks.classList.toggle('right-0');
            navLinks.classList.toggle('bg-gray-900');
            navLinks.classList.toggle('w-full');
            navLinks.classList.toggle('text-center');
            navLinks.classList.toggle('py-4');
            navLinks.classList.toggle('transform');
            navLinks.classList.toggle('transition-all');
            navLinks.classList.toggle('duration-300');
            navLinks.classList.toggle('ease-in-out');
            navLinks.classList.toggle('opacity-0');
            navLinks.classList.toggle('opacity-100');
            navLinks.classList.toggle('translate-y-[-10px]');
            navLinks.classList.toggle('translate-y-0');
            menuButton.classList.toggle('active');
        });
    }
}

const initProjectFilters = () => {
    console.log('Project filters initialized');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
            button.classList.add('bg-blue-500', 'text-white');

            projects.forEach(project => {
                if (filter === 'all') {
                    project.classList.remove('hidden');
                } else {
                    project.classList.toggle('hidden', !project.classList.contains(filter));
                }
            });
        });
    });
};