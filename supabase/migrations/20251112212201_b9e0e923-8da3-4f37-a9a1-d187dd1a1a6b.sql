-- Remove all auth-related tables and policies
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;

-- Drop the enum types
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.product_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.setup_admin_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_admin_user_if_not_exists() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;