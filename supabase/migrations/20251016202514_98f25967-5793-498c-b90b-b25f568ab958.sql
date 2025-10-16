-- Create table for YouTube video link
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for weekly highlights
CREATE TABLE public.weekly_highlights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name text NOT NULL,
  event_date date NOT NULL,
  event_time time without time zone NOT NULL,
  theme_title text NOT NULL,
  tag text NOT NULL CHECK (tag IN ('convidado', 'marketing')),
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for student testimonials
CREATE TABLE public.student_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL,
  video_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Update guests table to support admin management
ALTER TABLE public.guests 
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Everyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for weekly_highlights
CREATE POLICY "Everyone can view weekly highlights"
  ON public.weekly_highlights FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage weekly highlights"
  ON public.weekly_highlights FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for student_testimonials
CREATE POLICY "Everyone can view student testimonials"
  ON public.student_testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage student testimonials"
  ON public.student_testimonials FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default YouTube video setting
INSERT INTO public.site_settings (key, value)
VALUES ('how_it_works_video', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
ON CONFLICT (key) DO NOTHING;

-- Insert admin user with credentials
-- Email: admin@prontorecorroeducacao.com.br
-- Password: PSlend@rio88
-- This user will be created through the signup flow and then assigned admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'admin@prontorecorroeducacao.com.br'
ON CONFLICT DO NOTHING;