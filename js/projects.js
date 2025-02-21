class ProjectManager {
    constructor() {
        console.log('[ProjectManager] Initializing ProjectManager');
        this.projects = [];
        this.projectsContainer = document.getElementById('projects-container');
        console.log('[ProjectManager] Projects container:', this.projectsContainer);
        this.init();
    }

    async init() {
        console.log('[ProjectManager] Starting initialization');
        await this.loadProjects();
        console.log('[ProjectManager] Initialization complete');
    }

    async loadProjects() {
        console.log('[ProjectManager] Starting to load projects');
        try {
            const url = './assets/projects/projects.json';
            console.log('[ProjectManager] Fetching projects from:', url);
            const response = await fetch(url);
            console.log('[ProjectManager] Received response:', response);

            if (!response.ok) {
                const errorMsg = `HTTP error! status: ${response.status}`;
                console.error('[ProjectManager]', errorMsg);
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log('[ProjectManager] Successfully parsed JSON data:', data);
            this.projects = data.projects;
            console.log('[ProjectManager] Number of projects loaded:', this.projects.length);
            await this.displayProjects();
        } catch (error) {
            console.error('[ProjectManager] Error loading projects:', error);
            this.showError('Failed to load projects. Please try again later.');
        }
    }

    createProjectCard(project) {
        console.log('[ProjectManager] Creating card for project:', project.title);
        const card = document.createElement('div');
        card.className = 'project-card';
        if (project.featured) {
            console.log('[ProjectManager] Marking project as featured:', project.title);
            card.classList.add('featured');
        }

        const thumbnailPath = `/assets/projects/${project.id}/${project.thumbnail}`;
        const fallbackImage = '/assets/images/project-placeholder.jpg';
        console.log('[ProjectManager] Thumbnail path:', thumbnailPath);

        card.innerHTML = `
            <div class="project-thumbnail">
                <img src="${thumbnailPath}" alt="${project.title}" 
                     onerror="this.onerror=null; this.src='${fallbackImage}'">
                ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <a href="./projects/project-details.html?id=${project.id}" class="btn btn-primary">View Details</a>
                    ${project.demoUrl ? `
                        <a href="${project.demoUrl}" class="btn btn-outline" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        console.log('[ProjectManager] Card created successfully for:', project.title);
        return card;
    }

    async displayProjects() {
        console.log('[ProjectManager] Starting to display projects');
        if (!this.projectsContainer) {
            console.error('[ProjectManager] Projects container not found!');
            return;
        }
        
        console.log('[ProjectManager] Clearing projects container');
        this.projectsContainer.innerHTML = '';
        
        if (this.projects.length === 0) {
            console.warn('[ProjectManager] No projects found to display');
            this.showError('No projects found.');
            return;
        }

        console.log('[ProjectManager] Sorting featured projects');
        const featuredProjects = this.projects.filter(p => p.featured);
        const regularProjects = this.projects.filter(p => !p.featured);
        
        console.log('[ProjectManager] Found featured projects:', featuredProjects.length);
        console.log('[ProjectManager] Found regular projects:', regularProjects.length);

        [...featuredProjects, ...regularProjects].forEach(project => {
            console.log('[ProjectManager] Appending project:', project.title);
            this.projectsContainer.appendChild(this.createProjectCard(project));
        });

        console.log('[ProjectManager] Finished displaying all projects');
    }

    showError(message) {
        console.log('[ProjectManager] Displaying error message:', message);
        if (!this.projectsContainer) {
            console.error('[ProjectManager] Cannot show error - projects container not found');
            return;
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
        `;
        this.projectsContainer.appendChild(errorDiv);
        console.log('[ProjectManager] Error message displayed successfully');
    }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ProjectManager] DOM fully loaded and parsed');
    try {
        new ProjectManager();
        console.log('[ProjectManager] ProjectManager initialized successfully');
    } catch (error) {
        console.error('[ProjectManager] Error initializing ProjectManager:', error);
    }
});
