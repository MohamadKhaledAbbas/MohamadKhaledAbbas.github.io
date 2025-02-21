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
        // Set title and meta information
        document.title = `${project.title} - MK Abbas`;
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-description').textContent = project.shortDescription;
        
        if (project.releaseDate) {
            document.getElementById('project-date').innerHTML = `<i class="far fa-calendar"></i> ${project.releaseDate}`;
        }
        
        if (project.version) {
            document.getElementById('project-version').innerHTML = `<i class="fas fa-code-branch"></i> v${project.version}`;
        }

        // Display screenshots in the slider
        this.displayScreenshots(project.screenshots);

        // Display full description
        if (project.fullDescription) {
            document.getElementById('project-full-description').innerHTML = project.fullDescription;
        }

        // Display features
        if (project.features && project.features.length > 0) {
            const featuresContainer = document.getElementById('features-list');
            featuresContainer.innerHTML = project.features.map(feature => `
                <div class="feature-card">
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }

        // Display download options
        if (project.downloads && project.downloads.length > 0) {
            const downloadContainer = document.getElementById('download-options');
            downloadContainer.innerHTML = project.downloads.map(download => `
                <a href="${download.url}" class="download-btn" target="_blank">
                    <i class="fas fa-download"></i>
                    Download ${download.platform}
                </a>
            `).join('');
        }
    }

    displayScreenshots(screenshots) {
        if (!screenshots || screenshots.length === 0) return;

        const container = document.getElementById('screenshots-container');
        container.innerHTML = screenshots.map(screenshot => `
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

        // Initialize the slider
        new ScreenshotSlider(container.closest('.screenshot-slider'));
    }

    showError(message) {
        const container = document.querySelector('.project-details-page .container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
        `;
        container.innerHTML = '';
        container.appendChild(errorDiv);
    }
}

// Initialize project details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetails();
});
