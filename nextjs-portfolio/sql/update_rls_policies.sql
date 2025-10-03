-- Drop existing policies
DROP POLICY IF EXISTS "Projects are manageable by authenticated users" ON public.projects;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.projects;

-- Create new policies for projects table (without user_id requirement)
-- Allow public read access (for portfolio visitors)
CREATE POLICY "Enable read access for all users" ON public.projects
FOR SELECT USING (true);

-- Allow authenticated users to insert projects (for admin)
CREATE POLICY "Enable insert for authenticated users only" ON public.projects
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update any project (since you're the only admin)
CREATE POLICY "Enable update for authenticated users only" ON public.projects
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete any project (since you're the only admin)
CREATE POLICY "Enable delete for authenticated users only" ON public.projects
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies first
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Storage bucket policies for product_preview_images
-- Allow public read access to images (for portfolio display)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product_preview_images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product_preview_images' );

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product_preview_images' );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product_preview_images' );

-- Also create similar policies for other tables if needed
-- For testimonials table (if you have one with RLS)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.testimonials;
CREATE POLICY "Enable read access for all users" ON public.testimonials
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.testimonials;
CREATE POLICY "Enable insert for authenticated users only" ON public.testimonials
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- For personal_info table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.personal_info;
CREATE POLICY "Enable read access for all users" ON public.personal_info
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.personal_info;
CREATE POLICY "Enable update for authenticated users only" ON public.personal_info
FOR UPDATE TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.personal_info;
CREATE POLICY "Enable insert for authenticated users only" ON public.personal_info
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- For social_links table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.social_links;
CREATE POLICY "Enable read access for all users" ON public.social_links
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.social_links;
CREATE POLICY "Enable update for authenticated users only" ON public.social_links
FOR UPDATE TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.social_links;
CREATE POLICY "Enable insert for authenticated users only" ON public.social_links
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.social_links;
CREATE POLICY "Enable delete for authenticated users only" ON public.social_links
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);
