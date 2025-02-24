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
            await this.displayCredits(this.projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects. Please try again later.');
        }
    }

    setupFilters() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'flex flex-wrap justify-center gap-3 mb-10';
        
        const filters = ['all', ...new Set(this.projects.flatMap(p => p.technologies))];
        
        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = `px-6 py-3 rounded-full text-base font-medium transition-colors duration-300 ease-in-out ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'}`;
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
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        this.projectsContainer.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out');
            observer.observe(card);
        });
    }

    filterProjects(filter) {
        this.currentFilter = filter;
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('bg-blue-600', btn.textContent.toLowerCase() === filter);
            btn.classList.toggle('text-white', btn.textContent.toLowerCase() === filter);
            btn.classList.toggle('bg-gray-200', btn.textContent.toLowerCase() !== filter);
            btn.classList.toggle('text-gray-700', btn.textContent.toLowerCase() !== filter);
        });

        const filteredProjects = filter === 'all' 
            ? this.projects 
            : this.projects.filter(p => p.technologies.includes(filter));

        this.displayProjects(filteredProjects);
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card bg-gray-700 text-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl';
        card.style.margin = '0 1rem'; // Add margin to prevent touching the edges

        if (project.featured) {
            card.classList.add('border-2', 'border-blue-500');
        }

        const thumbnailPath = `/assets/projects/${project.id}/${project.thumbnail}`;
        const fallbackImage = '/assets/images/project-placeholder.jpg';

        card.innerHTML = `
            <div class="relative">
                <img src="${thumbnailPath}" alt="${project.title}" class="w-full h-48 object-contain" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}'">
                ${project.featured ? '<span class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>' : ''}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold mb-2">${project.title}</h3>
                <p class="text-gray-400 mb-3 text-sm">${project.shortDescription}</p>
                <div class="flex flex-wrap gap-2 mb-3">
                    ${project.technologies.map(tech => `
                        <span class="tech-item text-xs font-medium px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors duration-300" data-tech="${tech}">${tech}</span>
                    `).join('')}
                </div>
                <div class="flex gap-2">
                    <a href="./project-details.html?id=${project.id}" class="btn-primary text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300">
                        <i class="fas fa-info-circle mr-1"></i> Details
                    </a>
                    ${project.demoUrl ? `
                        <a href="${project.demoUrl}" class="btn-outline text-sm px-4 py-1.5 bg-transparent border border-gray-500 text-gray-300 rounded hover:bg-gray-700 hover:border-gray-700 transition-colors duration-300" target="_blank">
                            <i class="fas fa-external-link-alt mr-1"></i> Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        card.querySelectorAll('.tech-item').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterProjects(tag.dataset.tech);
            });
        });

        return card;
    }

    async displayProjects(projectsToDisplay = this.projects) {
        if (!this.projectsContainer) return;

        const projects = this.currentFilter === 'all' 
            ? this.projects 
            : this.projects.filter(p => p.technologies.includes(this.currentFilter));

        const featuredProjects = projects.filter(p => p.featured);
        const regularProjects = projects.filter(p => !p.featured);

        const projectGrid = document.createElement('div');
        projectGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';

        if (projects.length === 1) {
            projectGrid.className = 'flex justify-center';
        }

        [...featuredProjects, ...regularProjects].forEach(project => {
            const card = this.createProjectCard(project);
            projectGrid.appendChild(card);
        });

        this.projectsContainer.innerHTML = '';
        this.projectsContainer.appendChild(projectGrid);
        this.setupAnimations();
    }

    async displayCredits(projects) {
        const creditsContainer = document.getElementById('credits-list');
        const creditsMap = new Map();
    
        projects.forEach(project => {
            if (project.credits) {
                project.credits.forEach(credit => {
                    if (!creditsMap.has(credit.url)) {
                        creditsMap.set(credit.url, credit);
                    }
                });
            }
        });
    
    
        creditsContainer.innerHTML = '<h3 class="text-lg font-bold mb-2 text-blue-400">Image Credits</h3>';
        creditsContainer.innerHTML += Array.from(creditsMap.values()).map(credit => `
            <div class="credit-item">
                <div>
                    ${credit.url}
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        if (!this.projectsContainer) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-md';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle mr-2"></i>
            <p>${message}</p>
        `;
        
        this.projectsContainer.innerHTML = '';
        this.projectsContainer.appendChild(errorDiv);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});
