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
            const downloadContainer = document.getElementById('download-options');
            downloadContainer.innerHTML = project.downloads.map(download => `
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

        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 hidden z-50';
        modal.innerHTML = `
            <div class="absolute top-4 right-4">
                <button class="close-modal text-white text-3xl hover:text-gray-300 transition-colors duration-200">&times;</button>
            </div>
            <div class="flex items-center justify-center h-full relative">
                <button class="nav-arrow left-arrow absolute left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200" style="left: 2rem">
                    <i class="fas fa-chevron-left text-2xl"></i>
                </button>
                <img class="max-w-full max-h-full p-4" src="" alt="">
                <button class="nav-arrow right-arrow absolute right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200" style="right: 2rem">
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
        container.querySelectorAll('.screenshot-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                showImage(index);
                modal.classList.remove('hidden');
            });
        });

        // Add navigation handlers
        modal.querySelector('.left-arrow').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
            showImage(currentIndex);
        });

        modal.querySelector('.right-arrow').addEventListener('click', (e) => {
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

        // Add close handler for modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
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
