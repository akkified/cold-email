-- Profiles: Student info
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT,
    school TEXT,
    grade TEXT,
    location TEXT,
    interests TEXT,
    bio TEXT,
    experience TEXT,
    daily_send_cap INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns: Groups of professors
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professors: Professor data
CREATE TABLE IF NOT EXISTS professors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    university TEXT,
    department TEXT,
    research_area TEXT,
    paper_title TEXT,
    paper_summary TEXT,
    user_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates: Email templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    tone TEXT DEFAULT 'formal',
    target_length TEXT DEFAULT 'short',
    is_built_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drafts: AI-generated drafts
CREATE TABLE IF NOT EXISTS drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    professor_id UUID REFERENCES professors ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES templates ON DELETE SET NULL,
    subject TEXT,
    body TEXT,
    status TEXT DEFAULT 'pending', -- pending, generated, queued, sent, failed
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skip RLS for now as we are using supabaseAdmin in the API routes
-- and syncing from NextAuth which uses its own session management.
