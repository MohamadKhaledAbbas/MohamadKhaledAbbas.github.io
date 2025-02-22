console.log('main.js loaded')

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    // Mobile Menu Functionality
    const initMobileMenu = () => {
        console.log('Mobile menu initialized');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-link');

        console.log('Mobile menu button:', mobileMenuBtn); // Debug element selection
        console.log('Navigation links:', navLinks); // Debug element selection
        console.log('Navigation link items:', navLinksItems); // Debug element selection

        if (mobileMenuBtn && navLinks) {
            console.log('Mobile menu elements found'); // Confirm elements exist

            mobileMenuBtn.addEventListener('click', () => {
                console.log('Mobile menu clicked'); // Confirm event listener is firing
                mobileMenuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            navLinksItems.forEach((link, index) => {
                console.log(`Adding click listener to nav link ${index + 1}`); // Debug event listener attachment
                link.addEventListener('click', () => {
                    console.log(`Nav link ${index + 1} clicked`); // Debug link click
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        } else {
            console.error('Mobile menu elements not found'); // Debug missing elements
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

    // Contact Form
    const initContactForm = () => {
        const form = document.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                try {
                    // Add your form submission logic here
                    console.log('Form submitted:', data);
                    alert('Message sent successfully!');
                    form.reset();
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('Error sending message. Please try again.');
                }
            });
        }
    };

    // Initialize all functionality
    initMobileMenu();
    initSlider();
    initProjectFilters();
    initContactForm();
});