-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 0,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can read
CREATE POLICY "Allow public read access" ON public.skills
    FOR SELECT USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Allow authenticated management" ON public.skills
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial data based on hardcoded content
INSERT INTO public.skills (name, level, category, order_index)
VALUES 
('Flutter/Dart', 90, 'Mobile', 1),
('React Native', 87, 'Mobile', 2),
('Next.js', 80, 'Web', 3),
('Node.js', 75, 'Backend', 4),
('Python', 80, 'Backend', 5),
('TypeScript', 89, 'Universal', 6),
('PostgreSQL', 85, 'Database', 7);
