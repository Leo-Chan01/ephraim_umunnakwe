-- SQL to create the newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public insert" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Optional: Allow admin to view subscriptions (if you have an admin role)
-- CREATE POLICY "Allow admin select" ON newsletter_subscriptions
--     FOR SELECT USING (auth.role() = 'authenticated');
