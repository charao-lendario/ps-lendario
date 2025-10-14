-- Create enums for type safety
CREATE TYPE public.app_role AS ENUM ('admin', 'student');
CREATE TYPE public.product_type AS ENUM ('formacao', 'founders');
CREATE TYPE public.session_type AS ENUM ('estrategico', 'tecnico', 'marketing');
CREATE TYPE public.event_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE public.link_category AS ENUM ('gravacoes', 'materiais', 'comunidade');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  product_type product_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create hosts table
CREATE TABLE public.hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  role session_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
  time TIME NOT NULL,
  type session_type NOT NULL,
  host_id UUID REFERENCES public.hosts(id) ON DELETE CASCADE,
  recurring BOOLEAN DEFAULT true,
  room_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE,
  status event_status DEFAULT 'scheduled',
  room_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create useful_links table
CREATE TABLE public.useful_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category link_category NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, product_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo Aluno'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'product_type')::product_type, 'formacao')
  );
  
  -- Set default role as student
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for hosts (read-only for students, full access for admins)
CREATE POLICY "Everyone can view hosts"
  ON public.hosts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage hosts"
  ON public.hosts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for guests (read-only for students, full access for admins)
CREATE POLICY "Everyone can view guests"
  ON public.guests FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage guests"
  ON public.guests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for schedules (read-only for students, full access for admins)
CREATE POLICY "Everyone can view schedules"
  ON public.schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedules"
  ON public.schedules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events (read-only for students, full access for admins)
CREATE POLICY "Everyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for useful_links (read-only for students, full access for admins)
CREATE POLICY "Everyone can view useful links"
  ON public.useful_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage useful links"
  ON public.useful_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_schedules_day_time ON public.schedules(day_of_week, time);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_useful_links_category ON public.useful_links(category, display_order);

-- Enable realtime for events table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Insert default hosts
INSERT INTO public.hosts (name, bio, role, social_links) VALUES
  ('Lucas Charão', 'Especialista em estratégia e crescimento de negócios digitais.', 'estrategico', '{"linkedin": "", "instagram": ""}'),
  ('Adávio Tittoni', 'Expert técnico em desenvolvimento e automações.', 'tecnico', '{"linkedin": "", "instagram": ""}');

-- Insert default useful links
INSERT INTO public.useful_links (title, url, category, display_order) VALUES
  ('Gravações Anteriores', '#', 'gravacoes', 1),
  ('Materiais de Apoio', '#', 'materiais', 1),
  ('Comunidade no Discord', '#', 'comunidade', 1);