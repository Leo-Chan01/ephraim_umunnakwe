import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { Project } from '../types/portfolio';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            My Projects
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my work in mobile and web development. Each project represents 
            a unique challenge and solution, built with modern technologies and best practices.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
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
          <div className="text-gray-300 mb-8">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-gray-300">
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
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technologies I Use
            </h2>
            <p className="text-gray-300 text-lg">
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            I'm always excited to work on new challenges and bring innovative ideas to life.
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg inline-block"
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
          ? 'bg-blue-500 text-white'
          : 'bg-white/10 text-gray-300 hover:bg-white/20'
      }`}
    >
      {children} ({count})
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'planned': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-all group">
      {/* Project Image */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
        {project.preview_image ? (
          <img 
            src={project.preview_image} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">📱</span>
          </div>
        )}
        
        {/* Overlay with links */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex space-x-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title="View Project"
              >
                <span className="text-xl">🔗</span>
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
                <span className="text-xl">�</span>
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
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
            {project.name}
          </h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Role */}
        <div className="mb-4">
          <span className="text-purple-400 text-sm font-medium">
            Role: {project.role}
          </span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Dates */}
        {(project.start_date || project.end_date) && (
          <div className="text-gray-400 text-xs">
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
      className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all group"
    >
      <span className="font-medium">{name}</span>
      <span className="text-gray-400 text-sm ml-2">({count})</span>
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
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        projects: [],
      },
    };
  }
};