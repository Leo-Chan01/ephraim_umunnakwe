import { supabase } from './supabase';
import { Project, Testimonial, PersonalInfo, SocialLink } from '../types/portfolio';

export const adminService = {
  // Projects
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) {
        throw new Error('Authentication required to create projects - no user found');
      }

      console.log('Creating project with authenticated user:', user.id);

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message}${error.details ? ` (Details: ${error.details})` : ''}${error.hint ? ` (Hint: ${error.hint})` : ''}`);
      }
      
      console.log('Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('Full error object in createProject:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(errorMessage);
    }
  },

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    try {
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) {
        throw new Error('Authentication required to update projects - no user found');
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          ...project,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message}${error.details ? ` (Details: ${error.details})` : ''}${error.hint ? ` (Hint: ${error.hint})` : ''}`);
      }
      
      return data;
    } catch (error) {
      console.error('Full error object in updateProject:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(errorMessage);
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      if (!user) {
        throw new Error('Authentication required to delete projects - no user found');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message}${error.details ? ` (Details: ${error.details})` : ''}${error.hint ? ` (Hint: ${error.hint})` : ''}`);
      }
    } catch (error) {
      console.error('Full error object in deleteProject:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(errorMessage);
    }
  },

  // Testimonials
  async createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        author: testimonial.author,
        role: testimonial.role,
        message: testimonial.message,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        author: testimonial.author,
        role: testimonial.role,
        message: testimonial.message,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTestimonial(id: number): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Personal Info
  async updatePersonalInfo(info: PersonalInfo): Promise<PersonalInfo> {
    const { name, title, email, phone, location, bio, profile_image_url } = info;
    
    // Try to update existing record first
    const { data: existing } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1)
      .single();
    
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('personal_info')
        .update({
          name,
          title,
          email,
          phone,
          location,
          bio,
          profile_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('personal_info')
        .insert({
          name,
          title,
          email,
          phone,
          location,
          bio,
          profile_image_url,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Social Links
  async updateSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    try {
      // Delete all existing links (using platform field since that's the primary key)
      await supabase.from('social_links').delete().neq('platform', '');
      
      // Filter out empty URLs and ensure only valid fields
      const validLinks = links
        .filter(link => link.url.trim() !== '')
        .map(({ platform, url, is_visible }) => ({ platform, url, is_visible }));
      
      if (validLinks.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('social_links')
        .insert(validLinks)
        .select();
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error updating social links:', error);
      throw error;
    }
  },

  // Contact Messages
  async getContactMessages(): Promise<any[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markMessageAsRead(id: number): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteMessage(id: number): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },


};