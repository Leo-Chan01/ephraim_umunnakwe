import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { portfolioService } from '../lib/supabase';
import { Project, Testimonial, PersonalInfo } from '../types/portfolio';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, testimonialsData, personalInfoData] = await Promise.all([
          portfolioService.getProjects(),
          portfolioService.getTestimonials(),
          portfolioService.getPersonalInfo(),
        ]);

        setProjects(projectsData);
        setTestimonials(testimonialsData);
        setPersonalInfo(personalInfoData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const featuredProjects = projects.slice(0, 3);

  // ... rest of your existing JSX
  return (
    <Layout>
      {/* Your existing JSX here - same as before */}
    </Layout>
  );
}
