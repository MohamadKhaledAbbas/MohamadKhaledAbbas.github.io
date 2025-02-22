class ScreenshotSlider {
    constructor(container) {
        this.container = container;
        this.slideContainer = container.querySelector('.screenshot-container');
        this.slides = container.querySelectorAll('.screenshot-item');
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Create navigation buttons
        this.createNavigation();
        
        // Create dots
        this.createDots();
        
        // Add event listeners
        window.addEventListener('resize', () => {
            this.updateSlidePosition();
        });

        // Initial position
        this.updateSlidePosition();
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
        
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    slide(direction) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        if (direction === 'next') {
            this.currentIndex++;
            if (this.currentIndex >= this.slideCount) {
                this.currentIndex = 0;
            }
        } else {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.slideCount - 1;
            }
        }

        this.updateSlidePosition();
        this.isAnimating = false;
    }

    goToSlide(index) {
        if (this.isAnimating) return;

        this.currentIndex = index % this.slideCount;
        this.updateSlidePosition();
    }

    updateSlidePosition(skipAnimation = false) {
        const slideWidth = 100;
        const offset = -this.currentIndex * slideWidth;
        this.slideContainer.style.transition = skipAnimation ? 'none' : 'transform 0.3s';
        this.slideContainer.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.screenshot-slider');
    sliders.forEach(slider => new ScreenshotSlider(slider));
});
