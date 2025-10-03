import { supabase } from './supabase';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read?: boolean;
  created_at?: Date;
}

export const contactService = {
  async submitMessage(message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
      }]);

    if (error) throw error;
  },
};