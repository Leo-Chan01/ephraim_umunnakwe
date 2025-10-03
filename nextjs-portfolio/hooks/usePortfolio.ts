import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../lib/supabase';
import { Project, Testimonial, SocialLink, PersonalInfo } from '../types/portfolio';

interface PortfolioState {
  projects: Project[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
  personalInfo: PersonalInfo | null;
  isLoading: boolean;
  isOnline: boolean;
  error: string | null;
}

interface UsePortfolioOptions {
  enableRealtime?: boolean;
  autoLoad?: boolean;
}

export function usePortfolio(options: UsePortfolioOptions = {}) {
  const { enableRealtime = true, autoLoad = true } = options;
  
  const [state, setState] = useState<PortfolioState>({
    projects: [],
    testimonials: [],
    socialLinks: [],
    personalInfo: null,
    isLoading: false,
    isOnline: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await portfolioService.loadAll();
      
      setState({
        projects: result.projects,
        testimonials: result.testimonials,
        socialLinks: result.socialLinks,
        personalInfo: result.personalInfo,
        isLoading: false,
        isOnline: result.isOnline,
        error: result.error || null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isOnline: false,
        error: errorMessage,
      }));
    }
  }, []);

  const retry = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load data on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [loadData, autoLoad]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!enableRealtime) return;

    const projectsSubscription = portfolioService.subscribeToProjects((projects) => {
      setState(prev => ({ ...prev, projects, isOnline: true }));
    });

    const testimonialsSubscription = portfolioService.subscribeToTestimonials((testimonials) => {
      setState(prev => ({ ...prev, testimonials, isOnline: true }));
    });

    return () => {
      projectsSubscription.unsubscribe();
      testimonialsSubscription.unsubscribe();
    };
  }, [enableRealtime]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      const { isOnline } = portfolioService.getConnectionStatus();
      setState(prev => ({ ...prev, isOnline }));
    };

    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    loadData,
    retry,
    clearError,
    // Individual loaders for specific data
    loadProjects: async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const projects = await portfolioService.getProjects();
        setState(prev => ({ ...prev, projects, isLoading: false }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load projects'
        }));
      }
    },
    loadTestimonials: async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const testimonials = await portfolioService.getTestimonials();
        setState(prev => ({ ...prev, testimonials, isLoading: false }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Failed to load testimonials'
        }));
      }
    },
  };
}

// Separate hook for individual data types when you don't need everything
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { projects, isLoading, error, reload: loadProjects };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await portfolioService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  return { testimonials, isLoading, error, reload: loadTestimonials };
}
