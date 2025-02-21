class ScreenshotSlider {
    constructor(container) {
        this.container = container;
        this.slideContainer = container.querySelector('.screenshot-container');
        this.slides = container.querySelectorAll('.screenshot-item');
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.slidesPerView = this.getSlidesPerView();

        this.init();
    }

    init() {
        // Create navigation buttons
        this.createNavigation();
        
        // Create dots
        this.createDots();
        
        // Add event listeners
        window.addEventListener('resize', () => {
            this.slidesPerView = this.getSlidesPerView();
            this.updateSlidePosition();
        });

        // Initial position
        this.updateSlidePosition();
    }

    getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }

    createNavigation() {
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => this.slide('prev'));

        const nextButton = document.createElement('button');
        nextButton.className = 'slider-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', () => this.slide('next'));

        this.container.appendChild(prevButton);
        this.container.appendChild(nextButton);
    }

    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        const totalDots = Math.ceil(this.slideCount / this.slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goToSlide(i * this.slidesPerView));
            dotsContainer.appendChild(dot);
        }

        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }

    updateDots() {
        const activeDotIndex = Math.floor(this.currentIndex / this.slidesPerView);
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    slide(direction) {
        if (direction === 'next') {
            if (this.currentIndex < this.slideCount - this.slidesPerView) {
                this.currentIndex++;
            }
        } else {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        }

        this.updateSlidePosition();
    }

    goToSlide(index) {
        this.currentIndex = Math.min(Math.max(index, 0), this.slideCount - this.slidesPerView);
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        const slideWidth = 100 / this.slidesPerView;
        const offset = -this.currentIndex * slideWidth;
        this.slideContainer.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.screenshot-slider');
    sliders.forEach(slider => new ScreenshotSlider(slider));
});
