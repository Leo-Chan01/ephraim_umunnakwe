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
    <Layout title="Projects - Ephraim Umunnakwe">
      {/* Refresh Button */}
      <div className="fixed top-24 right-6 z-40">
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-neutral-900 border-2 border-neutral-900 dark:border-accent text-white px-6 py-3 rounded-none hover:bg-transparent hover:text-neutral-900 dark:hover:text-accent transition-all disabled:opacity-50 font-black uppercase tracking-widest text-xs flex items-center gap-3"
          title="Refresh projects"
        >
          {isRefreshing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <RefreshCw size={16} />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
            Selected<br />Works
          </h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl font-medium leading-relaxed">
            A curated showcase of mobile and web architectures. Focused on scalability,
            performance, and technical excellence.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-20 px-4 bg-neutral-50 dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-end justify-between mb-12">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl w-full">
              <label className="block text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Search Case Studies</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="FILTER BY KEYWORD..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-primary border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 rounded-none px-6 py-5 pl-14 focus:outline-none focus:border-accent transition-all font-bold"
                />
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              </div>
            </div>

            {/* Technology Filter */}
            <div className="w-full lg:w-auto">
              <label className="block text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Filter by Stack</label>
              <div className="flex flex-wrap gap-3">
                <FilterButton
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  count={projects.length}
                >
                  All
                </FilterButton>
                {allTechnologies.slice(0, 5).map(tech => (
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
          </div>

          <div className="text-neutral-400 font-bold uppercase tracking-widest text-xs flex justify-between items-center bg-neutral-100 dark:bg-neutral-800/30 p-4 border-l-4 border-neutral-900 dark:border-accent">
            <span>Query Results</span>
            <span>{filteredProjects.length} / {projects.length} PROJECTS</span>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-neutral-200 dark:border-neutral-800">
              <Search className="w-16 h-16 text-neutral-200 dark:text-neutral-800 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-4 uppercase">No matches found</h3>
              <p className="text-neutral-500 font-medium">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Showcase */}
      <section className="py-32 px-4 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Core Stack
            </h2>
            <p className="text-neutral-400 text-xl font-medium max-w-md">
              A comprehensive toolkit for modern high-performance architectures.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
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
      <section className="py-40 px-4 bg-accent text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 uppercase">Ready to scale?</h2>
          <p className="text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Let's discuss how we can build your next high-performance solution.
          </p>
          <a
            href="/contact"
            className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-12 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-accent dark:hover:bg-neutral-900 dark:hover:text-white transition-all inline-block"
          >
            Start Conversation
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
      className={`px-5 py-2 border-2 transition-all font-black uppercase tracking-widest text-xs ${active
        ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-accent dark:border-accent'
        : 'bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:border-neutral-900 dark:hover:border-accent'
        }`}
    >
      {active && <span className="mr-2">/</span>}
      {children} <span className="ml-1 opacity-50">[{count}]</span>
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-neutral-900 text-white dark:bg-accent';
      case 'in-progress': return 'bg-accent text-white';
      default: return 'bg-neutral-200 text-neutral-700';
    }
  };

  return (
    <div className="border-2 border-neutral-900 dark:border-neutral-800 transition-all duration-300 group flex flex-col h-full hover:bg-neutral-900 dark:hover:bg-accent transition-colors">
      {/* Project Image */}
      <div className="h-64 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden border-b-2 border-neutral-900 dark:border-neutral-800 grayscale group-hover:grayscale-0 transition-all duration-500">
        {project.preview_image ? (
          <img
            src={project.preview_image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Smartphone size={64} className="text-neutral-300" />
          </div>
        )}

        {/* Overlay with links */}
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/60 transition-colors flex items-center justify-center">
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white text-primary flex items-center justify-center border-2 border-white hover:bg-transparent hover:text-white transition-all"
                title="View Project"
              >
                <LinkIcon size={24} />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white text-primary flex items-center justify-center border-2 border-white hover:bg-transparent hover:text-white transition-all"
                title="View Code"
              >
                <Github size={24} />
              </a>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-0 right-0 px-4 py-2 font-black uppercase tracking-widest text-[10px] ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </div>

      {/* Project Content */}
      <div className="p-8 flex flex-col flex-grow group-hover:text-white transition-colors duration-300">
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">
            {project.name}
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-neutral-900 dark:border-neutral-300 group-hover:border-white/50">
            {project.priority}
          </span>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-300 font-medium text-lg mb-8 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mt-auto pt-8 border-t border-neutral-200 dark:border-neutral-800 group-hover:border-white/20 transition-colors">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-black uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 group-hover:bg-white group-hover:text-primary transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
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
      className="px-6 py-3 border-2 border-neutral-700 text-neutral-300 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:border-white transition-all"
    >
      {name} <span className="ml-2 opacity-40">[{count}]</span>
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