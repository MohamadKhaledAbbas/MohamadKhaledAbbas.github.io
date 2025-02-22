class ProjectDetails {
    constructor() {
        this.projectId = new URLSearchParams(window.location.search).get('id');
        this.init();
    }

    async init() {
        try {
            const projectData = await this.loadProjectData();
            this.displayProjectDetails(projectData);
        } catch (error) {
            console.error('Error loading project details:', error);
            this.showError('Failed to load project details. Please try again later.');
        }
    }

    async loadProjectData() {
        const response = await fetch(`../assets/projects/${this.projectId}/metadata.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    displayProjectDetails(project) {
        document.title = `${project.title} - MK Abbas`;
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-description').textContent = project.shortDescription;
        
        if (project.releaseDate) {
            document.getElementById('project-date').innerHTML = `<i class="far fa-calendar"></i> ${project.releaseDate}`;
        }
        
        if (project.version) {
            document.getElementById('project-version').innerHTML = `<i class="fas fa-code-branch"></i> v${project.version}`;
        }

        this.displayScreenshots(project.screenshots);

        if (project.fullDescription) {
            document.getElementById('project-full-description').innerHTML = project.fullDescription;
        }

        if (project.features && project.features.length > 0) {
            const featuresContainer = document.getElementById('features-list');
            featuresContainer.innerHTML = project.features.map(feature => `
                <div class="feature-card">
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }

        if (project.downloads && project.downloads.length > 0) {
            const downloadContainer = document.getElementById('download-options');
            downloadContainer.innerHTML = project.downloads.map(download => `
                <a href="${download.url}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-download"></i>
                    Download ${download.platform}
                </a>
            `).join('');
        }
    }

    displayScreenshots(screenshots) {
        if (!screenshots || screenshots.length === 0) return;

        const container = document.getElementById('screenshots-container');
        container.innerHTML = screenshots.map((screenshot) => `
            <div class="screenshot-item">
                <img src="../assets/projects/${this.projectId}/${screenshot.path}" 
                     alt="${screenshot.description || ''}"
                     loading="lazy">
                ${screenshot.description ? `
                    <div class="screenshot-caption">
                        ${screenshot.description}
                    </div>
                ` : ''}
            </div>
        `).join('');

        // Create slider navigation
        const sliderContainer = container.closest('.screenshot-slider');
        
        // Add navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        sliderContainer.appendChild(prevBtn);
        sliderContainer.appendChild(nextBtn);

        // Add dot indicators
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        screenshots.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-index', index);
            dotsContainer.appendChild(dot);
        });
        sliderContainer.appendChild(dotsContainer);

        // Initialize slider functionality
        let currentIndex = 0;
        const totalSlides = screenshots.length;
        const slideItems = container.querySelectorAll('.screenshot-item');
        const dots = dotsContainer.querySelectorAll('.slider-dot');

        const showSlide = (index) => {
            // Handle circular navigation
            if (index >= totalSlides) index = 0;
            if (index < 0) index = totalSlides - 1;

            // Update current index
            currentIndex = index;

            // Update transform
            container.style.transform = `translateX(-${index * 100}%)`;

            // Update active classes
            slideItems.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Add event listeners
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Add touch support
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    showSlide(currentIndex + 1);
                } else {
                    showSlide(currentIndex - 1);
                }
            }
        });

        // Auto advance slides
        let autoplayInterval = setInterval(() => showSlide(currentIndex + 1), 5000);

        // Pause on hover
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        sliderContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
        });
    }

    showError(message) {
        const container = document.querySelector('.project-details-page .container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

// Initialize project details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetails();
});
