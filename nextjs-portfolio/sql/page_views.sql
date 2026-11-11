-- Simple first-party page view tracking
CREATE TABLE IF NOT EXISTS public.page_views (
    id BIGSERIAL PRIMARY KEY,
    path TEXT NOT NULL,
    referrer TEXT,
    session_id TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON public.page_views (created_at);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON public.page_views (path);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone (anonymous visitors) can record a view
CREATE POLICY "Allow public insert" ON public.page_views
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Only the authenticated admin can read view data
CREATE POLICY "Enable read access for authenticated users only" ON public.page_views
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL);
