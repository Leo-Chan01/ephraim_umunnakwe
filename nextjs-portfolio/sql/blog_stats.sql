-- Per-post share tracking + combined views/shares stats for the admin.
-- Requires sql/page_views.sql to have been run first.

CREATE TABLE IF NOT EXISTS public.blog_shares (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL,
    -- 'native' (phone share sheet), 'copy', 'x', 'linkedin', 'whatsapp', 'facebook'
    method TEXT NOT NULL,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS blog_shares_slug_idx ON public.blog_shares (slug);

ALTER TABLE public.blog_shares ENABLE ROW LEVEL SECURITY;

-- Visitors can record a share; only the signed-in admin can read them
CREATE POLICY "Allow public insert" ON public.blog_shares
    FOR INSERT TO anon, authenticated
    WITH CHECK (char_length(slug) <= 200 AND method IN ('native', 'copy', 'x', 'linkedin', 'whatsapp', 'facebook'));

CREATE POLICY "Enable read access for authenticated users only" ON public.blog_shares
    FOR SELECT TO authenticated
    USING (auth.uid() IS NOT NULL);

-- Views + shares per post slug.
-- SECURITY INVOKER: runs with the caller's permissions, so RLS still applies
-- and anonymous callers just get no rows.
CREATE OR REPLACE FUNCTION public.blog_post_stats()
RETURNS TABLE (slug TEXT, views BIGINT, unique_views BIGINT, shares BIGINT)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
    WITH v AS (
        SELECT substring(path FROM '^/blog/([^/]+)$') AS slug,
               count(*) AS views,
               count(DISTINCT session_id) AS unique_views
        FROM public.page_views
        WHERE path LIKE '/blog/%'
        GROUP BY 1
    ),
    s AS (
        SELECT slug, count(*) AS shares
        FROM public.blog_shares
        GROUP BY 1
    )
    SELECT COALESCE(v.slug, s.slug) AS slug,
           COALESCE(v.views, 0) AS views,
           COALESCE(v.unique_views, 0) AS unique_views,
           COALESCE(s.shares, 0) AS shares
    FROM v
    FULL OUTER JOIN s ON s.slug = v.slug
    WHERE COALESCE(v.slug, s.slug) IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.blog_post_stats() TO authenticated;
