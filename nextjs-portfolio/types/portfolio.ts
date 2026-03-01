export interface Project {
  id?: number;
  name: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
  priority: string;
  technologies: string[];
  role: string;
  preview_image?: string;
  project_url?: string;
  github_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id?: number;
  author: string;
  role: string;
  message: string;
  rating: number;
  avatar_url?: string;
  created_at: string;
}

export interface SocialLink {
  platform: string; // Primary key
  url: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalInfo {
  id?: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profile_image_url?: string;
  updated_at?: string;
}

export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  featured_image?: string;
  is_published: boolean;
  read_time: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  price: string;
  order_index?: number;
  created_at?: string;
}