class ProjectManager {
    constructor() {
        this.projects = [];
        this.projectsContainer = document.getElementById('projects-container');
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupFilters();
        this.setupAnimations();
    }

    async loadProjects() {
        try {
            const response = await fetch('./assets/projects/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects;
            await this.displayProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects. Please try again later.');
        }
    }

    setupFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        
        const filters = ['all', ...new Set(this.projects.flatMap(p => p.technologies))];
        
        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = 'filter-btn' + (filter === 'all' ? ' active' : '');
            button.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);
            button.addEventListener('click', () => this.filterProjects(filter));
            filterContainer.appendChild(button);
        });

        this.projectsContainer.parentElement.insertBefore(filterContainer, this.projectsContainer);
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        this.projectsContainer.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

    filterProjects(filter) {
        this.currentFilter = filter;
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.toggle('active', btn.textContent.toLowerCase() === filter));

        const filteredProjects = filter === 'all' 
            ? this.projects 
            : this.projects.filter(p => p.technologies.includes(filter));

        this.displayProjects(filteredProjects);
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (project.featured) {
            card.classList.add('featured');
        }

        const thumbnailPath = `/assets/projects/${project.id}/${project.thumbnail}`;
        const fallbackImage = '/assets/images/project-placeholder.jpg';

        card.innerHTML = `
            <div class="project-thumbnail">
                <img src="${thumbnailPath}" alt="${project.title}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${fallbackImage}'">
                ${project.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag" data-tech="${tech}">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-actions">
                    <a href="./project-details.html?id=${project.id}" class="btn btn-primary">
                        <i class="fas fa-info-circle"></i> Details
                    </a>
                    ${project.demoUrl ? `
                        <a href="${project.demoUrl}" class="btn btn-outline" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        // Add hover effect for tech tags
        card.querySelectorAll('.tech-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterProjects(tag.dataset.tech);
            });
        });

        return card;
    }

    async displayProjects(projectsToDisplay = this.projects) {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = '';
        
        if (projectsToDisplay.length === 0) {
            this.showError('No projects found.');
            return;
        }

        const featuredProjects = projectsToDisplay.filter(p => p.featured);
        const regularProjects = projectsToDisplay.filter(p => !p.featured);
        
        [...featuredProjects, ...regularProjects].forEach(project => {
            const card = this.createProjectCard(project);
            this.projectsContainer.appendChild(card);
        });

        this.setupAnimations();
    }

    showError(message) {
        if (!this.projectsContainer) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        
        this.projectsContainer.innerHTML = '';
        this.projectsContainer.appendChild(errorDiv);
    }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});
