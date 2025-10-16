-- Fix security warning - set explicit search_path
CREATE OR REPLACE FUNCTION public.setup_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID for admin email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@prontorecorroeducacao.com.br'
  LIMIT 1;
  
  -- If user exists, ensure they have admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;