-- SQL script to add order_index to projects, testimonials, and blog_posts tables

-- 1. Projects
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='order_index') THEN
        ALTER TABLE public.projects ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Testimonials
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='testimonials' AND column_name='order_index') THEN
        ALTER TABLE public.testimonials ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. Blog Posts
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='order_index') THEN
        ALTER TABLE public.blog_posts ADD COLUMN order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- Initialize order_index with existing IDs to maintain a stable starting order
UPDATE public.projects SET order_index = id WHERE order_index = 0;
UPDATE public.testimonials SET order_index = id WHERE order_index = 0;
UPDATE public.blog_posts SET order_index = id WHERE order_index = 0;
UPDATE public.services SET order_index = id WHERE order_index = 0;
UPDATE public.skills SET order_index = id WHERE order_index = 0;
UPDATE public.experiences SET order_index = id WHERE order_index = 0;
UPDATE public.achievements SET order_index = id WHERE order_index = 0;
