import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { portfolioService } from '../lib/supabase';
import { Project, Testimonial, PersonalInfo } from '../types/portfolio';

interface HomeProps {
  projects: Project[];
  testimonials: Testimonial[];
  personalInfo: PersonalInfo | null;
}

export default function Home({ projects: initialProjects, testimonials: initialTestimonials, personalInfo: initialPersonalInfo }: HomeProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Function to refresh data from Supabase
  const refreshData = async () => {
    console.log('🔄 Refreshing portfolio data...');
    setIsRefreshing(true);
    try {
      const [projectsData, testimonialsData, personalInfoData] = await Promise.all([
        portfolioService.getProjects(),
        portfolioService.getTestimonials(),
        portfolioService.getPersonalInfo(),
      ]);

      console.log('✅ Data refreshed:', {
        projects: projectsData.length,
        testimonials: testimonialsData.length,
        personalInfo: personalInfoData?.name
      });

      setProjects(projectsData);
      setTestimonials(testimonialsData);
      setPersonalInfo(personalInfoData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh data every 10 seconds for immediate testing
  useEffect(() => {
    console.log('🚀 Setting up auto-refresh every 10 seconds');
    const interval = setInterval(refreshData, 10 * 1000); // 10 seconds for testing
    return () => clearInterval(interval);
  }, []);

  // Also refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page visible - refreshing data');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Refresh on component mount to get latest data immediately
  useEffect(() => {
    console.log('🎯 Component mounted - getting fresh data');
    refreshData();
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <Layout>
      {/* Refresh Button and Status */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-3 py-2 rounded-lg shadow-lg transition-all disabled:opacity-50 backdrop-blur-sm border border-white/20 text-sm"
          title="Refresh content"
        >
          {isRefreshing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            '↻'
          )}
        </button>
        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
          Last: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white">
              {personalInfo?.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'EU'}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {personalInfo?.name || 'Ephraim Umunnakwe'}
            </span>
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-300 mb-8 space-y-2">
            <p>{personalInfo?.title || 'Software Engineer • Mobile & Web Developer'}</p>
            <p className="text-lg text-gray-400">
              {personalInfo?.bio || 'Building innovative solutions with Flutter, React, and modern technologies'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all font-semibold"
            >
              Get In Touch
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Technical Expertise
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              I specialize in mobile and web development with a focus on creating 
              scalable, user-friendly applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkillCard
              icon="📱"
              title="Mobile Development"
              description="Flutter & Dart for cross-platform mobile applications"
              skills={['Flutter', 'Dart', 'Firebase', 'State Management']}
            />
            <SkillCard
              icon="🌐"
              title="Web Development"
              description="Modern web applications with React and Next.js"
              skills={['React', 'Next.js', 'TypeScript', 'Tailwind CSS']}
            />
            <SkillCard
              icon="⚡"
              title="Backend & Cloud"
              description="Scalable backend services and cloud infrastructure"
              skills={['Node.js', 'Supabase', 'REST APIs', 'Cloud Functions']}
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-300 text-lg">
              Some of my recent work and personal projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Projects
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Clients Say
              </h2>
              <p className="text-gray-300 text-lg">
                Feedback from satisfied clients and collaborators
              </p>
            </div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Let's work together to bring your ideas to life with cutting-edge technology
          </p>
          <Link
            href="/contact"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function SkillCard({ icon, title, description, skills }: {
  icon: string;
  title: string;
  description: string;
  skills: string[];
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div 
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-all group ${
        project.project_url ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (project.project_url) {
          window.open(project.project_url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
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
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex space-x-4">
            {project.project_url && (
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span>🔗</span>
              </div>
            )}
            {project.github_url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.github_url, '_blank', 'noopener,noreferrer');
                }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span>�</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          {project.name}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [projects, testimonials, personalInfo] = await Promise.all([
      portfolioService.getProjects(),
      portfolioService.getTestimonials(),
      portfolioService.getPersonalInfo(),
    ]);

    return {
      props: {
        projects,
        testimonials,
        personalInfo,
      },
    };
  } catch (error) {
    return {
      props: {
        projects: [],
        testimonials: [],
        personalInfo: null,
      },
    };
  }
};