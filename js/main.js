console.log('main.js loaded')

// Listen for both DOMContentLoaded and headerLoaded
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

    // Initialize other functionalities
    initSlider();
    initContactForm();
    initProjectFilters();
});

const initMobileMenu = () => {
    console.log('Mobile menu initialization started');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navLinks) {
        console.log('Mobile menu elements found');

        mobileMenuBtn.addEventListener('click', () => {
            console.log('Mobile menu clicked');
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    } else {
        console.error('Mobile menu elements not found');
    }
};
// Slider Functionality
const initSlider = () => {
    console.log('Slider initialized');
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach(slider => {
        const slides = slider.querySelector('.slider-slides');
        const dots = slider.querySelector('.slider-dots');
        let currentSlide = 0;
        const slideCount = slides.children.length;

        // Create dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }

        function updateSlider() {
            slides.style.transform = `translateX(-${currentSlide * 100}%)`;
            const allDots = dots.querySelectorAll('.slider-dot');
            allDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        }

        // Initialize slider
        updateSlider();
        setInterval(nextSlide, 5000);
    });
};

// Project Filters
const initProjectFilters = () => {
    console.log('Project filters initialized');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projects.forEach(project => {
                if (filter === 'all') {
                    project.style.display = 'block';
                } else {
                    const hasTag = project.classList.contains(filter);
                    project.style.display = hasTag ? 'block' : 'none';
                }
            });
        });
    });
};