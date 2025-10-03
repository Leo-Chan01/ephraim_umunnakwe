export interface Project {
  id?: number;
  name: string;
  description: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  priority: string;
  technologies: string[];
  role: string;
  previewImage?: string;
  projectUrl?: string;
  githubUrl?: string;
}

export interface Testimonial {
  id?: number;
  author: string;
  role: string;
  message: string;
  rating: number;
  avatarUrl?: string;
  createdAt: Date;
}

export interface SocialLink {
  platform: string;
  url: string;
  isVisible: boolean;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImageUrl?: string;
}