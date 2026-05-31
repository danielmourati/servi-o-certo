-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  bio TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Ativo', 'Inativo')),
  city TEXT,
  neighborhood TEXT,
  internal_rating NUMERIC(3,2) DEFAULT 5.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create provider_services table (many-to-many relationship for specialties/services)
CREATE TABLE IF NOT EXISTS provider_services (
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL, -- Reference to the service ID (e.g. srv-1)
  PRIMARY KEY (provider_id, service_id)
);

-- Create provider_availability table
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (provider_id, day_of_week, start_time, end_time)
);

-- Create provider_team_members table
CREATE TABLE IF NOT EXISTS provider_team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - since we are developing admin functions, we can allow full access for now, or standard policies.
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_team_members ENABLE ROW LEVEL SECURITY;

-- Allow all operations for admin (or public for local ease of use in development)
CREATE POLICY "Allow public read" ON providers FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON providers FOR ALL USING (true);

CREATE POLICY "Allow public read" ON provider_services FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON provider_services FOR ALL USING (true);

CREATE POLICY "Allow public read" ON provider_availability FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON provider_availability FOR ALL USING (true);

CREATE POLICY "Allow public read" ON provider_team_members FOR SELECT USING (true);
CREATE POLICY "Allow public write" ON provider_team_members FOR ALL USING (true);
