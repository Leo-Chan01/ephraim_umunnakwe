import { createClient } from '@supabase/supabase-js';
import { Project, Testimonial, SocialLink, PersonalInfo } from '../types/portfolio';

const supabaseUrl = 'https://cecsvrwibdvncrxbbctr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlY3N2cndpYmR2bmNyeGJiY3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA3ODEsImV4cCI6MjA3MDA5Njc4MX0.dqSqaL37yCozA39pb61rnVzHmU0Jo_RH8vfisACAqS4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const portfolioService = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true);
    
    if (error) throw error;
    return data || [];
  },

  async getPersonalInfo(): Promise<PersonalInfo | null> {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  }
};