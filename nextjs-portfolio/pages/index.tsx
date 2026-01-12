import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import RefreshButton from '../components/RefreshButton';
import { portfolioService } from '../lib/supabase';
import { Project, Testimonial, PersonalInfo } from '../types/portfolio';
import { Smartphone, Globe, Zap, RefreshCw } from 'lucide-react';

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
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Function to refresh data from Supabase
  const refreshData = async () => {
    console.log('Refreshing portfolio data...');
    setIsRefreshing(true);
    try {
      const [projectsData, testimonialsData, personalInfoData] = await Promise.all([
        portfolioService.getProjects(),
        portfolioService.getTestimonials(),
        portfolioService.getPersonalInfo(),
      ]);

      console.log('Data refreshed:', {
        projects: projectsData.length,
        testimonials: testimonialsData.length,
        personalInfo: personalInfoData?.name
      });

      setProjects(projectsData);
      setTestimonials(testimonialsData);
      setPersonalInfo(personalInfoData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set mounted state and refresh on component mount
  useEffect(() => {
    setIsMounted(true);
    console.log('Component mounted - getting fresh data');
    refreshData();
  }, []);

  // Auto-refresh data every 10 seconds for immediate testing
  useEffect(() => {
    console.log('Setting up auto-refresh every 10 seconds');
    const interval = setInterval(refreshData, 10 * 1000); // 10 seconds for testing
    return () => clearInterval(interval);
  }, []);

  // Also refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible - refreshing data');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const featuredProjects = projects.slice(0, 3);

  return (
    <Layout>
      {/* Refresh Button and Status */}
      <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="bg-accent hover:bg-accent/90 dark:bg-accent/90 dark:hover:bg-accent text-white px-4 py-2 rounded-lg shadow-md transition-all disabled:opacity-50 border border-accent/30 text-sm flex items-center gap-2"
          title="Refresh content"
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
        {isMounted && lastRefresh && (
          <div className="bg-secondary/80 px-2 py-1 rounded text-xs text-gray-200">
            Last: {lastRefresh.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-white dark:bg-primary" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-100 dark:bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-gray-900 dark:text-white border-2 border-gray-300 dark:border-accent">
              {personalInfo?.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'EU'}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hi, I'm{' '}
            <span className="text-gray-700 dark:text-gray-300">
              {personalInfo?.name || 'Ephraim Umunnakwe'}
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 space-y-2">
            <p>{personalInfo?.title || 'Software Engineer • Mobile & Web Developer'}</p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {personalInfo?.bio || 'Building innovative solutions with Flutter, React, and modern technologies'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all font-semibold"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
            >
              Get In Touch
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-accent rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-light dark:bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technical Expertise
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              I specialize in mobile and web development with a focus on creating
              scalable, user-friendly applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkillCard
              icon={<Smartphone size={24} />}
              title="Mobile Development"
              description="Flutter & Dart for cross-platform mobile applications"
              skills={['Flutter', 'Dart', 'Firebase', 'State Management']}
            />
            <SkillCard
              icon={<Globe size={24} />}
              title="Web Development"
              description="Modern web applications with React and Next.js"
              skills={['React', 'Next.js', 'TypeScript', 'Tailwind CSS']}
            />
            <SkillCard
              icon={<Zap size={24} />}
              title="Backend & Cloud"
              description="Scalable backend services and cloud infrastructure"
              skills={['Node.js', 'Supabase', 'REST APIs', 'Cloud Functions']}
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 bg-white dark:bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
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
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-semibold"
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
        <section className="py-20 px-4 bg-light dark:bg-secondary">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Clients Say
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Feedback from satisfied clients and collaborators
              </p>
            </div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white dark:bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Let's work together to bring your ideas to life with cutting-edge technology
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg inline-block"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function SkillCard({ icon, title, description, skills }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  skills: string[];
}) {
  return (
    <div className="bg-white dark:bg-secondary border border-gray-200 dark:border-accent rounded-lg p-6 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-blue-100 dark:bg-accent/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-accent text-xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 dark:bg-accent/20 text-blue-700 dark:text-accent text-sm rounded-full border border-blue-200 dark:border-accent">

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
      className={`bg-white dark:bg-secondary border border-gray-200 dark:border-accent rounded-lg overflow-hidden hover:shadow-lg transition-all group ${project.project_url ? 'cursor-pointer' : ''
        }`}
      onClick={() => {
        if (project.project_url) {
          window.open(project.project_url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      <div className="h-48 bg-gray-100 dark:bg-secondary relative overflow-hidden">
        {project.preview_image ? (
          <img
            src={project.preview_image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Smartphone size={48} className="text-gray-400 dark:text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3\">
          <div className="flex gap-3">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-colors"
              >
                <span><Globe size={16} /></span>
              </a>
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
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-accent/20 text-blue-700 dark:text-accent text-sm rounded-full border border-blue-200 dark:border-accent"
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