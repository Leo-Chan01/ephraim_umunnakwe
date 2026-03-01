-- Add years_of_experience column to personal_info
ALTER TABLE public.personal_info 
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER DEFAULT 0;

-- Update the existing record (assuming there's only one as per the code)
UPDATE public.personal_info 
SET years_of_experience = 8
WHERE years_of_experience = 0 OR years_of_experience IS NULL;
