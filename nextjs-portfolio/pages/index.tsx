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
      <RefreshButton onRefresh={refreshData} isRefreshing={isRefreshing} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 overflow-hidden bg-secondary dark:bg-primary">
        {/* Architectural grid background */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
          style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-16">
            <div className="w-32 h-32 bg-neutral-900 dark:bg-accent flex items-center justify-center text-4xl font-black text-white">
              {personalInfo?.name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'EU'}
            </div>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black tracking-tightest text-neutral-900 dark:text-secondary mb-12 uppercase leading-[0.85]">
            ENGINEERING<br />
            <span className="text-accent">EXCELLENCE</span>
          </h1>

          <div className="max-w-3xl text-2xl md:text-3xl text-neutral-600 dark:text-neutral-400 mb-16 font-medium leading-relaxed">
            <p className="mb-6">{personalInfo?.title || 'Architectural Software Engineer'}</p>
            <p className="text-xl opacity-70 max-w-2xl">
              {personalInfo?.bio || 'High-performance digital products engineered with Swiss precision and modern aesthetics.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <Link
              href="/projects"
              className="bg-neutral-900 dark:bg-accent text-white px-12 py-5 border-4 border-neutral-900 dark:border-accent hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all font-black text-xl uppercase tracking-widest"
            >
              The Archive
            </Link>
            <Link
              href="/contact"
              className="bg-transparent text-neutral-900 dark:text-white px-12 py-5 border-4 border-neutral-900 dark:border-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all font-black text-xl uppercase tracking-widest"
            >
              Direct Line
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-40 px-4 bg-neutral-50 dark:bg-primary border-y-4 border-neutral-900 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-secondary mb-8 uppercase leading-none">
                Core<br />Stack
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-2xl font-medium leading-relaxed">
                Merging technical engineering with high-end aesthetic form.
              </p>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.5em] text-neutral-400 rotate-90 origin-right translate-y-12">
              CAPABILITIES_01
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8">
              <SkillCard
                icon={<Smartphone size={40} />}
                title="Mobile Systems"
                description="Engineered cross-platform mobile environments using Industry-Standard tools and architectural design patterns."
                skills={['Flutter', 'React-Native', 'Swift', 'Kotlin', 'Firebase']}
              />
            </div>
            <div className="md:col-span-4">
              <SkillCard
                icon={<Zap size={40} />}
                title="Performance"
                description="Precision-tuned applications for sub-second latency and zero-waste resource usage."
                skills={['CI/CD', 'Optimization', 'Audits']}
              />
            </div>
            <div className="md:col-span-4">
              <SkillCard
                icon={<Globe size={40} />}
                title="Digital Form"
                description="Next.js and React architectures with a focus on Swiss-style visual systems."
                skills={['React', 'Next.js', 'TypeScript']}
              />
            </div>
            <div className="md:col-span-8">
              <SkillCard
                icon={<Zap size={40} />}
                title="Cloud Infrastructure"
                description="Distributed backend systems and real-time database architectures at global scale."
                skills={['Node.js', 'PostgreSQL', 'Supabase', 'AWS']}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-40 px-4 bg-secondary dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 gap-8">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-neutral-900 dark:text-secondary uppercase">
              Portfolio
            </h2>
            <Link
              href="/projects"
              className="text-2xl font-black uppercase tracking-widest text-accent underline underline-offset-8 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              View Full Archive
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-40 px-4 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">Network</h2>
              <div className="h-2 w-32 bg-accent"></div>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-40 px-4 bg-accent text-white border-t-4 border-neutral-900 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tightest mb-12 uppercase leading-[0.85]">
            INITIATE<br />PROJECT
          </h2>
          <p className="text-2xl md:text-3xl text-white/80 mb-16 font-medium max-w-3xl mx-auto leading-relaxed">
            Ready to implement high-performance architecture into your digital product?
          </p>
          <Link
            href="/contact"
            className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-16 py-6 border-4 border-neutral-900 dark:border-white font-black text-2xl uppercase tracking-widest hover:bg-white hover:text-accent dark:hover:bg-neutral-900 dark:hover:text-white transition-all inline-block"
          >
            Connect Now
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
    <div className="bg-secondary dark:bg-primary border-2 border-neutral-900 dark:border-neutral-800 p-8 hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group h-full flex flex-col">
      <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-secondary mb-6 group-hover:bg-white group-hover:text-primary dark:group-hover:bg-primary dark:group-hover:text-secondary transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-300 dark:group-hover:text-neutral-600 mb-8 font-medium flex-grow">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 group-hover:border-white/20 group-hover:text-white dark:group-hover:border-primary/20 dark:group-hover:text-primary transition-colors">
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
      className={`bg-secondary dark:bg-primary border-2 border-neutral-900 dark:border-neutral-800 overflow-hidden transition-all duration-300 group ${project.project_url ? 'cursor-pointer' : ''
        }`}
      onClick={() => {
        if (project.project_url) {
          window.open(project.project_url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      <div className="h-64 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
        {project.preview_image ? (
          <img
            src={project.preview_image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Smartphone size={64} className="text-neutral-300 dark:text-neutral-700" />
          </div>
        )}

        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/40 transition-colors duration-500 flex items-center justify-center">
          <div className="flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {project.project_url && (
              <div className="w-12 h-12 bg-white text-primary flex items-center justify-center border-2 border-white hover:bg-transparent hover:text-white transition-all">
                <Globe size={20} />
              </div>
            )}
            {project.github_url && (
              <div className="w-12 h-12 bg-white text-primary flex items-center justify-center border-2 border-white hover:bg-transparent hover:text-white transition-all">
                <span className="text-xl font-bold">G</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-8 border-t-2 border-neutral-900 dark:border-neutral-800 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-secondary dark:group-hover:text-primary transition-all duration-300">
        <h3 className="text-2xl font-black tracking-tight mb-3 uppercase">
          {project.name}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 text-sm mb-6 line-clamp-2 font-medium">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 text-[10px] font-black uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 group-hover:border-white/20 dark:group-hover:border-primary/20 transition-colors"
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