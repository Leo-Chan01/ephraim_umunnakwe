-- Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can read
CREATE POLICY "Allow public read access" ON public.experiences
    FOR SELECT USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Allow authenticated management" ON public.experiences
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial data based on hardcoded content
INSERT INTO public.experiences (title, company, period, description, order_index)
VALUES 
('Flutter Developer', 'Coder''s Triangle', 'Apr 2025 – Present', 'Collaborated with a cross-functional team to maintain and enhance ''Confide'' (Social Media App) and ''CTLearn'' (Ed-Tech Platform). Integrated push and in-app notifications using Firebase Cloud Messaging, improving user engagement by 25%. Implemented secure user authentication and optimized app performance, reducing ANR rates to below 0.5%.', 1),
('Senior Flutter Developer', 'Xeno Technologies', 'Oct 2023 – Jan 2025', 'Developed and maintained a cross-platform crypto mining application using Flutter, achieving over 150k installations and 17k+ daily active users. Implemented JWT-based authentication, notifications using FCM and OneSignal, and CRUD API operations. Optimized app performance to achieve less than 1% ANR reports and a 4.0 rating on the Play Store.', 2),
('Flutter Developer', 'ProjKonnect', 'Apr 2023 – Nov 2024', 'Built a scalable Ed-Tech Flutter application with features like notifications, chat, video streaming, media download, and payment integration. Deployed application on Play Store and App Store; currently runs on over 500 devices nationwide. Integrated third-party services such as Paystack for in-app purchases and secured user data using encryption algorithms.', 3);
