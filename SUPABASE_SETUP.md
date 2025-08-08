# Supabase Database Schema

This document outlines the database schema needed for the portfolio website and admin dashboard.

## Table: projects

```sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Planning',
  start_date DATE,
  end_date DATE,
  priority TEXT DEFAULT 'Medium',
  technologies TEXT[] DEFAULT '{}',
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Projects are manageable by authenticated users" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
```

## Table: testimonials

```sql
CREATE TABLE testimonials (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Testimonials are manageable by authenticated users" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');
```

## Table: social_links

```sql
CREATE TABLE social_links (
  platform TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only visible links)
CREATE POLICY "Social links are viewable by everyone" ON social_links
  FOR SELECT USING (is_visible = true);

-- Create policy for authenticated users to manage all links
CREATE POLICY "Social links are manageable by authenticated users" ON social_links
  FOR ALL USING (auth.role() = 'authenticated');
```

## Table: personal_info

```sql
CREATE TABLE personal_info (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Personal info is viewable by everyone" ON personal_info
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Personal info is manageable by authenticated users" ON personal_info
  FOR ALL USING (auth.role() = 'authenticated');
```

## Triggers for updated_at

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. Copy and paste the SQL commands above into your Supabase SQL editor
2. Execute them in order to create the tables and policies
3. Update the Supabase configuration files with your actual URL and anon key:
   - `/admin_dashboard/lib/services/supabase_config.dart`
   - `/lib/services/supabase_config.dart`

## Configuration Files to Update

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` in:

### Admin Dashboard
- `admin_dashboard/lib/services/supabase_config.dart`

### Main Portfolio
- `lib/services/supabase_config.dart`

## Real-time Features

The system supports real-time updates across both applications:

- **Admin Dashboard**: Changes made here will immediately reflect in the portfolio website
- **Portfolio Website**: Will automatically update when data changes in Supabase
- **Multiple Admins**: Multiple admin users can work simultaneously with real-time sync

## Authentication (Optional)

For production use, consider adding Supabase authentication to the admin dashboard:

1. Enable authentication in your Supabase project
2. Add login/logout functionality to the admin dashboard
3. Update RLS policies to be more restrictive based on user roles
