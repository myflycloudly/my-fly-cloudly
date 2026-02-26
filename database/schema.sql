-- =============================================================================
-- Flight Experience Booking System — Full schema + RLS
-- Run this in Supabase SQL Editor (Project: cwxusqzgjbrajzuqnunu)
-- Use anon key in frontend only; never use service_role in the app.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLES
-- -----------------------------------------------------------------------------

-- Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    nationality TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration TEXT NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    participants INTEGER NOT NULL CHECK (participants > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    admin_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slider images (homepage hero)
CREATE TABLE IF NOT EXISTS slider_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slider_images ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 2b. HELPER: is_admin() — avoids RLS circular reference (must not query profiles under RLS)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. RLS POLICIES — PROFILES (drop first so script is re-runnable)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. RLS POLICIES — SERVICES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read active services" ON services;
DROP POLICY IF EXISTS "Admins can read all services" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;

CREATE POLICY "Public can read active services"
ON services FOR SELECT
USING (active = true);

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

-- -----------------------------------------------------------------------------
-- 5. RLS POLICIES — BOOKINGS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can read all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

CREATE POLICY "Users can read own bookings"
ON bookings FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all bookings"
ON bookings FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can create own bookings"
ON bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update bookings"
ON bookings FOR UPDATE
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. RLS POLICIES — SLIDER_IMAGES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can read active slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can read all slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can insert slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can update slider images" ON slider_images;
DROP POLICY IF EXISTS "Admins can delete slider images" ON slider_images;

CREATE POLICY "Public can read active slider images"
ON slider_images FOR SELECT
USING (active = true);

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

-- -----------------------------------------------------------------------------
-- 7. TRIGGER — Create profile on signup
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 8. STORAGE (run in Dashboard or add bucket + policies)
-- -----------------------------------------------------------------------------
-- Create bucket "service-images" in Supabase Dashboard > Storage.
-- Policies: public read; upload/update/delete only for admins (e.g. check
-- (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' in policy).

-- =============================================================================
-- AFTER RUNNING:
-- 1. Create first admin: sign up a user, then run:
--    UPDATE profiles SET role = 'admin' WHERE id = '<that-user-uuid>';
-- 2. (Optional) Add sample services via Admin UI or INSERT here.
-- =============================================================================
