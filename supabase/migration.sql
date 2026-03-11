-- ============================================================
-- BYLORA — Migration Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Table profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      TEXT,
  email             TEXT,
  parcours          TEXT,      -- 'naturalisation' | 'titre_sejour' | 'carte_residence'
  depot_type        TEXT,      -- 'avant_2026' | 'apres_2026' | 'pas_encore'
  interview_date    DATE,
  plan              TEXT DEFAULT 'free',
  plan_expires_at   TIMESTAMPTZ,
  stripe_customer_id TEXT,
  marketing_opt_in  BOOLEAN DEFAULT FALSE,
  onboarding_done   BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Politique : chaque utilisateur ne voit que son propre profil
CREATE POLICY "users_own_profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- 4. Trigger : créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
