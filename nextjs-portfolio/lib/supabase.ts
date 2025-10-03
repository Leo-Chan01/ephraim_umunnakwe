import { createClient } from '@supabase/supabase-js';
import { Project, Testimonial, SocialLink, PersonalInfo } from '../types/portfolio';

const supabaseUrl = 'https://cecsvrwibdvncrxbbctr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlY3N2cndpYmR2bmNyeGJiY3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA3ODEsImV4cCI6MjA3MDA5Njc4MX0.dqSqaL37yCozA39pb61rnVzHmU0Jo_RH8vfisACAqS4';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Connection status and error handling
let isOnline = true;
let lastError: string | null = null;

// Test Supabase connection
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    isOnline = true;
    lastError = null;
    return true;
  } catch (error) {
    isOnline = false;
    lastError = error instanceof Error ? error.message : 'Unknown connection error';
    console.warn('Supabase connection failed:', error);
    return false;
  }
}

// Fallback data for offline mode
const fallbackData = {
  projects: [] as Project[],
  testimonials: [] as Testimonial[],
  socialLinks: [] as SocialLink[],
  personalInfo: null as PersonalInfo | null,
};

export const portfolioService = {
  // Connection status getters
  getConnectionStatus: () => ({ isOnline, lastError }),

  // Test and retry connection
  async retryConnection(): Promise<boolean> {
    return await testConnection();
  },

  // Test storage bucket access
  async testStorageAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from('product_preview_images')
        .list('', { limit: 1 });

      if (error) {
        console.error('Storage bucket access error:', error);
        return false;
      }
      
      console.log('Storage bucket accessible:', data);
      return true;
    } catch (error) {
      console.error('Storage test failed:', error);
      return false;
    }
  },

  // Image upload functionality
  async uploadProjectImage(file: File): Promise<string> {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-previews/${fileName}`;

      console.log('Uploading file:', { fileName, fileSize: file.size, fileType: file.type });

      const { data, error } = await supabase.storage
        .from('product_preview_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase storage error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('product_preview_images')
        .getPublicUrl(filePath);

      console.log('Generated URL:', urlData.publicUrl);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  },

  // Delete project image
  async deleteProjectImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/'); // Get last two parts: bucket/filename
      
      const { error } = await supabase.storage
        .from('product_preview_images')
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project image:', error);
      // Don't throw error for image deletion failures as it's not critical
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      // Test connection first
      if (!isOnline) {
        await testConnection();
      }

      // For public viewing, we need to either:
      // 1. Use service role key for bypassing RLS, or
      // 2. Adjust the RLS policy to allow public read access
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Projects fetch error (possibly due to RLS):', error);
        // If RLS blocks this, return cached data
        return fallbackData.projects;
      }
      
      // Return raw data (already matches interface)
      const projects = data || [];
      
      // Cache successful data
      fallbackData.projects = projects;
      isOnline = true;
      lastError = null;
      
      return projects;
    } catch (error) {
      isOnline = false;
      lastError = error instanceof Error ? error.message : 'Failed to fetch projects';
      console.warn('Error fetching projects, using fallback:', error);
      
      // Return cached data or empty array
      return fallbackData.projects;
    }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      if (!isOnline) {
        await testConnection();
      }

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Return data as-is since interface now matches database
      const testimonials = data || [];
      
      fallbackData.testimonials = testimonials;
      isOnline = true;
      lastError = null;
      
      return testimonials;
    } catch (error) {
      isOnline = false;
      lastError = error instanceof Error ? error.message : 'Failed to fetch testimonials';
      console.warn('Error fetching testimonials, using fallback:', error);
      
      return fallbackData.testimonials;
    }
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    try {
      if (!isOnline) {
        await testConnection();
      }

      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_visible', true);
      
      if (error) throw error;
      
      const socialLinks = data || [];
      fallbackData.socialLinks = socialLinks;
      isOnline = true;
      lastError = null;
      
      return socialLinks;
    } catch (error) {
      isOnline = false;
      lastError = error instanceof Error ? error.message : 'Failed to fetch social links';
      console.warn('Error fetching social links, using fallback:', error);
      
      return fallbackData.socialLinks;
    }
  },

  async getPersonalInfo(): Promise<PersonalInfo | null> {
    try {
      if (!isOnline) {
        await testConnection();
      }

      const { data, error } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      fallbackData.personalInfo = data;
      isOnline = true;
      lastError = null;
      
      return data;
    } catch (error) {
      isOnline = false;
      lastError = error instanceof Error ? error.message : 'Failed to fetch personal info';
      console.warn('Error fetching personal info, using fallback:', error);
      
      return fallbackData.personalInfo;
    }
  },

  // Load all data with connection testing
  async loadAll(): Promise<{
    projects: Project[];
    testimonials: Testimonial[];
    socialLinks: SocialLink[];
    personalInfo: PersonalInfo | null;
    isOnline: boolean;
    error?: string;
  }> {
    console.log('Loading all portfolio data...');
    
    try {
      // Test connection first
      const connectionStatus = await testConnection();
      
      // Load all data in parallel
      const [projects, testimonials, socialLinks, personalInfo] = await Promise.all([
        this.getProjects(),
        this.getTestimonials(),
        this.getSocialLinks(),
        this.getPersonalInfo(),
      ]);

      console.log(`Data loaded successfully. Online: ${isOnline}`);
      
      return {
        projects,
        testimonials,
        socialLinks,
        personalInfo,
        isOnline: connectionStatus,
        ...(lastError && { error: lastError }),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load portfolio data';
      console.error('Error loading portfolio data:', error);
      
      return {
        projects: fallbackData.projects,
        testimonials: fallbackData.testimonials,
        socialLinks: fallbackData.socialLinks,
        personalInfo: fallbackData.personalInfo,
        isOnline: false,
        error: errorMessage,
      };
    }
  },

  // Real-time subscriptions for live updates
  subscribeToProjects(callback: (projects: Project[]) => void) {
    return supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          try {
            const projects = await this.getProjects();
            callback(projects);
          } catch (error) {
            console.warn('Error in projects subscription:', error);
          }
        }
      )
      .subscribe();
  },

  subscribeToTestimonials(callback: (testimonials: Testimonial[]) => void) {
    return supabase
      .channel('testimonials_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        async () => {
          try {
            const testimonials = await this.getTestimonials();
            callback(testimonials);
          } catch (error) {
            console.warn('Error in testimonials subscription:', error);
          }
        }
      )
      .subscribe();
  },

  // Utility method for retrying failed operations
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i === maxRetries - 1) {
          throw lastError;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    
    throw lastError!;
  },

  // Update personal information
  async updatePersonalInfo(personalInfo: Partial<PersonalInfo>): Promise<PersonalInfo> {
    try {
      await testConnection();
      
      // Check if personal info already exists
      const { data: existing } = await supabase
        .from('personal_info')
        .select('id')
        .limit(1)
        .single();

      let result;
      
      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('personal_info')
          .update({
            name: personalInfo.name,
            title: personalInfo.title,
            email: personalInfo.email,
            phone: personalInfo.phone,
            location: personalInfo.location,
            bio: personalInfo.bio,
            profile_image_url: personalInfo.profile_image_url
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('personal_info')
          .insert({
            name: personalInfo.name || '',
            title: personalInfo.title,
            email: personalInfo.email,
            phone: personalInfo.phone,
            location: personalInfo.location,
            bio: personalInfo.bio,
            profile_image_url: personalInfo.profile_image_url
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to update personal info';
      console.error('Error updating personal info:', error);
      throw error;
    }
  },

  // Update social links
  async updateSocialLinks(socialLinks: SocialLink[]): Promise<SocialLink[]> {
    try {
      await testConnection();
      
      // First, delete all existing social links
      await supabase
        .from('social_links')
        .delete()
        .neq('platform', ''); // Delete all records (since platform is not empty)
      
      // Then insert new ones (without id since platform is the primary key)
      const { data, error } = await supabase
        .from('social_links')
        .insert(socialLinks.map(link => ({
          platform: link.platform,
          url: link.url,
          is_visible: link.is_visible
        })))
        .select();

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to update social links';
      console.error('Error updating social links:', error);
      throw error;
    }
  },

  // Individual social link operations
  async createSocialLink(socialLink: SocialLink): Promise<SocialLink> {
    try {
      await testConnection();
      
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          platform: socialLink.platform,
          url: socialLink.url,
          is_visible: socialLink.is_visible
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to create social link';
      console.error('Error creating social link:', error);
      throw error;
    }
  },

  async updateSocialLink(platform: string, updates: Partial<SocialLink>): Promise<SocialLink> {
    try {
      await testConnection();
      
      const { data, error } = await supabase
        .from('social_links')
        .update({
          url: updates.url,
          is_visible: updates.is_visible
        })
        .eq('platform', platform)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to update social link';
      console.error('Error updating social link:', error);
      throw error;
    }
  },

  async deleteSocialLink(platform: string): Promise<void> {
    try {
      await testConnection();
      
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('platform', platform);

      if (error) throw error;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to delete social link';
      console.error('Error deleting social link:', error);
      throw error;
    }
  },

  // Save complete profile (personal info + social links)
  async saveProfile(profileData: {
    personalInfo: Partial<PersonalInfo>;
    socialLinks: SocialLink[];
  }): Promise<{ personalInfo: PersonalInfo; socialLinks: SocialLink[] }> {
    try {
      const [personalInfo, socialLinks] = await Promise.all([
        this.updatePersonalInfo(profileData.personalInfo),
        this.updateSocialLinks(profileData.socialLinks)
      ]);

      return { personalInfo, socialLinks };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to save profile';
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Project management methods
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      await testConnection();
      
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required to create projects');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
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
      console.error('Full error object:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      lastError = errorMessage;
      console.error('Error creating project:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    try {
      await testConnection();
      
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required to update projects');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...project,
          updated_at: new Date().toISOString()
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
      console.error('Full error object:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      lastError = errorMessage;
      console.error('Error updating project:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      await testConnection();
      
      // Get current user to ensure we're authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication required to delete projects');
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
      console.error('Full error object:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      lastError = errorMessage;
      console.error('Error deleting project:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Testimonial management methods
  async createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    try {
      await testConnection();
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          ...testimonial,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to create testimonial';
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      await testConnection();
      
      const { data, error } = await supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to update testimonial';
      console.error('Error updating testimonial:', error);
      throw error;
    }
  },

  async deleteTestimonial(id: number): Promise<void> {
    try {
      await testConnection();
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Failed to delete testimonial';
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  },
};