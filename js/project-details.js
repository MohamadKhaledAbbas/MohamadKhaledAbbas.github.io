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
            document.getElementById('project-date').innerHTML = `<i class="far fa-calendar mr-2"></i>${project.releaseDate}`;
        }
        
        if (project.version) {
            document.getElementById('project-version').innerHTML = `<i class="fas fa-code-branch mr-2"></i>v${project.version}`;
        }

        this.displayScreenshots(project.screenshots);

        if (project.fullDescription) {
            document.getElementById('project-full-description').innerHTML = project.fullDescription;
        }

        if (project.features && project.features.length > 0) {
            const featuresContainer = document.getElementById('features-list');
            featuresContainer.innerHTML = project.features.map(feature => `
                <div class="bg-gray-700 rounded-lg p-6 shadow-lg border border-blue-400 hover:border-blue-300 transition-colors duration-300">
                    <h3 class="text-2xl font-bold mb-3 text-blue-300">${feature.title}</h3>
                    <p class="text-gray-200">${feature.description}</p>
                </div>
            `).join('');
        }

        if (project.downloads && project.downloads.length > 0) {
            // Download section
            const downloadContainer = document.getElementById('download-options');
            downloadContainer.innerHTML = '<h2 class="text-3xl font-bold mb-4 text-blue-400">Download</h2>';
            downloadContainer.innerHTML += project.downloads.map(download => `
                <a href="${download.url}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300" target="_blank">
                    <i class="fas fa-download mr-2"></i>
                    Download ${download.platform}
                </a>
            `).join('');
        }
    }

    displayScreenshots(screenshots) {
        if (!screenshots || screenshots.length === 0) return;

        const container = document.getElementById('screenshots-container');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            // Show swipeable carousel for mobile
            container.innerHTML = `
                <div class="swipe-container relative overflow-hidden  w-full" style="height: 80vh">
                    ${screenshots.map((screenshot, index) => `
                        <div class="swipe-item absolute top-0 left-0 w-full h-full transition-transform duration-500" style="transform: translateX(${index * 100}%)">
                            <img src="../assets/projects/${this.projectId}/${screenshot.path}"
                                 alt="${screenshot.description || ''}"
                                 class="w-full h-full object-contain"
                                 loading="lazy">
                            ${screenshot.description ? `
                                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 text-white text-center">
                                    ${screenshot.description}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    <div class="swipe-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div class="text-white text-center">
                            <i class="fas fa-arrows-alt-h text-4xl mb-2"></i>
                            <p class="text-lg">Swipe to view more</p>
                        </div>
                    </div>
                </div>
            `;

            // Add swipe functionality
            this.setupSwipe(container, screenshots.length);
        } else {
            // Show all screenshots for desktop
            container.innerHTML = screenshots.map((screenshot) => `
                <div class="screenshot-item w-full cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <img src="../assets/projects/${this.projectId}/${screenshot.path}"
                         alt="${screenshot.description || ''}"
                         class="w-full h-auto object-cover rounded-lg shadow-md"
                         loading="lazy">
                    ${screenshot.description ? `
                        <div class="mt-2 text-sm text-gray-300">
                            ${screenshot.description}
                        </div>
                    ` : ''}
                </div>
            `).join('');

            // Create modal for desktop
            this.createModal(screenshots);
        }
    }

    setupSwipe(container, totalScreenshots) {
        let touchStartX = 0;
        let touchEndX = 0;
        let currentIndex = 0;
        let hasSwiped = false;

        const swipeItems = container.querySelectorAll('.swipe-item');
        const indicators = container.querySelectorAll('.swipe-indicator > div');
        const overlay = container.querySelector('.swipe-overlay');

        const updateSwipe = (isAutoSwipe = false) => {
            swipeItems.forEach((item, index) => {
                item.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
            });
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('bg-white', index === currentIndex);
            });

            // Hide overlay after first user swipe
            if (!hasSwiped && currentIndex !== 0 && !isAutoSwipe) {
                hasSwiped = true;
                overlay.style.display = 'none';
            }
        };

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', () => {
            const threshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < totalScreenshots - 1) {
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateSwipe();
            }
        });

        // Add auto-swipe animation for initial indication
        setTimeout(() => {
            if (currentIndex === 0 && totalScreenshots > 1) {
                currentIndex = 1;
                updateSwipe(true);
                setTimeout(() => {
                    currentIndex = 0;
                    updateSwipe(true);
                }, 1000);
            }
        }, 1000);
    }

    createModal(screenshots) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 hidden z-50 p-4';
        modal.innerHTML = `
            <div class="fixed top-4 right-4">
                <button class="close-modal text-white text-3xl hover:text-gray-300 cursor-pointer">&times;</button>
            </div>
            <div class="flex items-center justify-center h-full">
                <button class="fixed left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 left-arrow">
                    <i class="fas fa-chevron-left text-2xl"></i>
                </button>
                <img class="max-w-full max-h-full p-4" src="" alt="">
                <button class="fixed right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 right-arrow">
                    <i class="fas fa-chevron-right text-2xl"></i>
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = index;
            const imgSrc = screenshots[index].path;
            const imgAlt = screenshots[index].description || '';
            modal.querySelector('img').src = `../assets/projects/${this.projectId}/${imgSrc}`;
            modal.querySelector('img').alt = imgAlt;
        };

        // Add click handlers for screenshots
        const container = document.getElementById('screenshots-container');
        container.querySelectorAll('.screenshot-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                showImage(index);
                modal.classList.remove('hidden');
            });
        });

        // Add close handler for modal
        modal.querySelector('.close-modal').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modal.classList.add('hidden');
        });

        // Add navigation handlers
        modal.querySelector('.left-arrow').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
            showImage(currentIndex);
        });

        modal.querySelector('.right-arrow').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % screenshots.length;
            showImage(currentIndex);
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                modal.classList.add('hidden');
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
                showImage(currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % screenshots.length;
                showImage(currentIndex);
            }
        });

        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    showError(message) {
        const container = document.querySelector('.project-details-page .container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle mr-3 text-2xl"></i>
            <p class="text-lg">${message}</p>
        `;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetails();
});
