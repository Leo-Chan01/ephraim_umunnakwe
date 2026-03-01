-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    year TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Award',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON public.achievements
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.achievements
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users only" ON public.achievements
    FOR UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users only" ON public.achievements
    FOR DELETE TO authenticated
    USING (auth.uid() IS NOT NULL);

-- Seed data
INSERT INTO public.achievements (title, organization, year, description, icon, order_index)
VALUES 
('Google Certified Associate Cloud Engineer', 'Google Cloud', '2024', 'Validation of cloud architecture and infrastructure management.', 'Cloud', 1),
('Outstanding Engineering Excellence', 'Tech Institute', '2023', 'Awarded for exceptional systems design and implementation.', 'Cpu', 2),
('Top Developer Award', 'Open Source Community', '2022', 'Recognition for contributions to major mobile frameworks.', 'Award', 3);
