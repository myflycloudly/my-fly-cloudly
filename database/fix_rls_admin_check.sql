-- =============================================================================
-- FIX: 500 errors on profiles/bookings — RLS circular reference
-- Run this in Supabase SQL Editor. It adds an is_admin() helper so RLS
-- policies don't query profiles recursively.
-- =============================================================================

-- 1. Create helper that bypasses RLS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop policies that use the inline profiles subquery (so we can recreate with is_admin())

-- Profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Services
DROP POLICY IF EXISTS "Admins can read all services" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;

-- Bookings
DROP POLICY IF EXISTS "Admins can read all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

-- Slider images
DROP POLICY IF EXISTS "Admins can read all slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can insert slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can update slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can delete slider images" ON slider_images;

-- 3. Recreate policies using is_admin()

-- Profiles
CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
USING (public.is_admin());

-- Services
CREATE POLICY "Admins can read all services"
ON services FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can insert services"
ON services FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update services"
ON services FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete services"
ON services FOR DELETE
USING (public.is_admin());

-- Bookings
CREATE POLICY "Admins can read all bookings"
ON bookings FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update bookings"
ON bookings FOR UPDATE
USING (public.is_admin());

-- Slider images
CREATE POLICY "Admins can read all slider images"
ON slider_images FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can insert slider images"
ON slider_images FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update slider images"
ON slider_images FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete slider images"
ON slider_images FOR DELETE
USING (public.is_admin());
