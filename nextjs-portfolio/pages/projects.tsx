import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { Project } from '../types/portfolio';
import { RefreshCw, Smartphone, Search, Link as LinkIcon, Github } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects: initialProjects }: ProjectsProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to refresh projects from Supabase
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const projectsData = await portfolioService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error refreshing projects:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh on component mount to get latest data immediately
  useEffect(() => {
    refreshData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Get unique technologies for filter options
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects based on search and technology filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.technologies.includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      {/* Refresh Button */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-accent hover:bg-accent/90 dark:bg-accent/90 dark:hover:bg-accent text-white px-4 py-2 rounded-lg shadow-md transition-all disabled:opacity-50 border border-accent/30 text-sm flex items-center gap-2"
          title="Refresh projects"
        >
          {isRefreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Please Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="mt-16 py-20 px-4 bg-white dark:bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A showcase of my work in mobile and web development. Each project represents 
            a unique challenge and solution, built with modern technologies and best practices.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 bg-light dark:bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-primary border border-gray-300 dark:border-accent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            </div>

            {/* Technology Filter */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                count={projects.length}
              >
                All
              </FilterButton>
              {allTechnologies.slice(0, 6).map(tech => (
                <FilterButton
                  key={tech}
                  active={filter === tech}
                  onClick={() => setFilter(tech)}
                  count={projects.filter(p => p.technologies.includes(tech)).length}
                >
                  {tech}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-700 dark:text-gray-300 mb-8">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 px-4 bg-white dark:bg-primary">
        <div className="max-w-6xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="py-16 px-4 bg-light dark:bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies I Use
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              The tools and frameworks that power my projects
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {allTechnologies.map(tech => (
              <TechBadge
                key={tech}
                name={tech}
                count={projects.filter(p => p.technologies.includes(tech)).length}
                onClick={() => setFilter(tech)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-white dark:bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            I'm always excited to work on new challenges and bring innovative ideas to life.
          </p>
          <a
            href="/contact"
            className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent/90 transition-all font-semibold text-lg inline-block"
          >
            Let's Discuss Your Project
          </a>
        </div>
      </section>
    </Layout>
  );
}

function FilterButton({ children, active, onClick, count }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-accent text-white'
          : 'bg-gray-200 dark:bg-primary text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-accent/20'
      }`}
    >
      {children} ({count})
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600';
      case 'in-progress': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600';
      case 'planned': return 'bg-accent/20 dark:bg-accent/30 text-accent dark:text-accent border-accent/30 dark:border-accent';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-accent rounded-lg overflow-hidden hover:shadow-lg transition-all group">
      {/* Project Image */}
      <div className="h-48 bg-gray-100 dark:bg-primary relative overflow-hidden">
        {project.preview_image ? (
          <img 
            src={project.preview_image} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Smartphone size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Overlay with links */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex space-x-3">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="View Project"
              >
                <LinkIcon className="text-white" size={20} />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="View Code"
              >
                <Github className="text-white" size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors">
            {project.name}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Role */}
        <div className="mb-4">
          <span className="text-accent dark:text-accent text-sm font-medium">
            Role: {project.role}
          </span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-accent/20 text-blue-700 dark:text-accent text-sm rounded-full border border-blue-200 dark:border-accent"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-200 dark:bg-primary text-gray-600 dark:text-gray-300 text-xs rounded-full">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Dates */}
        {(project.start_date || project.end_date) && (
          <div className="text-gray-600 dark:text-gray-400 text-xs">
            {project.start_date && (
              <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
            )}
            {project.start_date && project.end_date && <span> • </span>}
            {project.end_date && (
              <span>Completed: {new Date(project.end_date).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TechBadge({ name, count, onClick }: {
  name: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 bg-blue-50 dark:bg-accent/20 text-blue-700 dark:text-accent text-sm rounded-full border border-blue-200 dark:border-accent hover:bg-blue-100 dark:hover:bg-accent/30 transition-all"
    >
      <span className="font-medium">{name}</span>
      <span className="ml-2">({count})</span>
    </button>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const projects = await portfolioService.getProjects();

    return {
      props: {
        projects,
      },
    };
  } catch (error) {
    return {
      props: {
        projects: [],
      },
    };
  }
};