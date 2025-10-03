import { supabase } from './supabase';

export interface SiteSettings {
  id?: number;
  site_title: string;
  site_description: string;
  maintenance_mode: boolean;
  allow_comments: boolean;
  email_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

export const settingsService = {
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  async updateSettings(settings: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};