-- SQL to create the services table
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    icon TEXT,
    price TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.services
    FOR SELECT USING (true);

-- Allow authenticated users to manage services
CREATE POLICY "Enable insert for authenticated users only" ON public.services
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.services
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.services
    FOR DELETE TO authenticated USING (true);

-- Insert initial data based on hardcoded content
INSERT INTO public.services (title, description, features, icon, price, order_index)
VALUES 
('Web Development', 'Modern, responsive websites built with React, Next.js, and cutting-edge technologies.', ARRAY['Responsive Design', 'SEO Optimization', 'Performance Focused', 'Modern UI/UX'], 'Globe', 'Starting at $1,500', 1),
('Mobile App Development', 'Cross-platform mobile applications using Flutter and React Native.', ARRAY['iOS & Android', 'Native Performance', 'Custom UI Design', 'App Store Deployment'], 'Mobile', 'Starting at $2,000', 2),
('API Development', 'Robust backend APIs and microservices for your applications.', ARRAY['RESTful APIs', 'Database Design', 'Authentication', 'Documentation'], 'Zap', 'Starting at $1,500', 3),
('E-commerce Solutions', 'Complete online stores with payment integration and inventory management.', ARRAY['Payment Gateway', 'Inventory System', 'Admin Dashboard', 'Mobile Responsive'], 'ShoppingCart', 'Starting at $4,000', 4),
('Technical Consulting', 'Expert advice on technology stack, architecture, and development strategy.', ARRAY['Technology Assessment', 'Architecture Planning', 'Code Review', 'Team Training'], 'Lightbulb', '$150/hour', 5),
('Maintenance & Support', 'Ongoing support, updates, and maintenance for your applications.', ARRAY['Bug Fixes', 'Security Updates', 'Performance Optimization', '24/7 Support'], 'Wrench', 'Custom Packages', 6);
