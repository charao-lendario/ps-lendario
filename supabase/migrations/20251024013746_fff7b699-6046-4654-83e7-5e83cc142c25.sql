-- First, insert Adávio Tittoni if not exists
INSERT INTO public.guests (name, bio)
SELECT 'Adávio Tittoni', 'Instrutor Técnico'
WHERE NOT EXISTS (
  SELECT 1 FROM public.guests WHERE name = 'Adávio Tittoni'
);

-- Insert events for Adávio Tittoni
DO $$
DECLARE
  adavio_id uuid;
  loop_date date := '2025-10-31'::date;
  end_date date := '2026-01-31'::date;
  day_of_week integer;
BEGIN
  -- Get Adávio's guest_id
  SELECT id INTO adavio_id FROM public.guests WHERE name = 'Adávio Tittoni' LIMIT 1;
  
  -- Only proceed if we found the guest
  IF adavio_id IS NOT NULL THEN
    -- Loop through dates from 31/10/2025 to 31/01/2026
    WHILE loop_date <= end_date LOOP
      day_of_week := EXTRACT(DOW FROM loop_date); -- 0=Sunday, 1=Monday, etc.
      
      -- Monday (1), Wednesday (3), Friday (5) at 18:30
      IF day_of_week IN (1, 3, 5) THEN
        INSERT INTO public.events (date, time, guest_id, status)
        VALUES (loop_date, '18:30:00', adavio_id, 'scheduled');
      END IF;
      
      -- Tuesday (2), Thursday (4) at 10:00
      IF day_of_week IN (2, 4) THEN
        INSERT INTO public.events (date, time, guest_id, status)
        VALUES (loop_date, '10:00:00', adavio_id, 'scheduled');
      END IF;
      
      loop_date := loop_date + interval '1 day';
    END LOOP;
  END IF;
END $$;