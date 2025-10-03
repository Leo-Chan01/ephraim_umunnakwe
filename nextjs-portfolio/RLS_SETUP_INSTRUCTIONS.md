## RLS Policy Setup Instructions

Your project creation is failing because of Row Level Security (RLS) policies. I've updated the `adminService` to include proper authentication, but you need to apply the RLS policies to your Supabase database.

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to the SQL Editor (in the left sidebar)
4. Copy and paste the contents of `sql/update_rls_policies.sql` into the editor
5. Click "Run" to execute the SQL

### Option 2: Apply via Supabase CLI (if you have it installed)

```bash
# If you have Supabase CLI installed
supabase db reset --linked
```

### Option 3: Manual SQL Execution

Copy this SQL and run it in your Supabase SQL Editor:

```sql
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
```

### After applying the policies:

1. Make sure you're logged in to the admin panel
2. Try creating a new project again
3. The RLS errors should be resolved

### What I Fixed:

1. **Updated adminService**: Added authentication checks to all CRUD operations
2. **RLS Policies**: Created policies that allow public reads but require authentication for writes
3. **No user_id requirement**: Policies work without requiring a user_id column since you're the sole admin

The project creation should now work properly once you apply these RLS policies to your database.
