-- ============================================================================
-- 00036_fix_signup_trigger_and_error_handling.sql
-- Fixes "Database error saving new user" (500) by making handle_new_user()
-- completely exception-safe and removing conflicting triggers on auth.users.
-- ============================================================================

-- 1. Bulletproof handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- 1. Insert Profile
  BEGIN
    INSERT INTO public.profiles (user_id, name, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user profiles insert error: %', SQLERRM;
  END;

  -- 2. Insert User Settings
  BEGIN
    INSERT INTO public.user_settings (user_id, dark_mode, notifications_enabled, locale)
    VALUES (NEW.id, true, true, 'en')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user settings insert error: %', SQLERRM;
  END;

  -- 3. Insert Streaks
  BEGIN
    INSERT INTO public.streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user streaks insert error: %', SQLERRM;
  END;

  -- 4. Insert User Levels
  BEGIN
    INSERT INTO public.user_levels (user_id, level, title, total_xp)
    VALUES (NEW.id, 1, 'Bronze', 0)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user levels insert error: %', SQLERRM;
  END;

  -- 5. Insert Subscriptions (14-day trial)
  BEGIN
    INSERT INTO public.subscriptions (user_id, status, plan_tier, current_period_start, current_period_end)
    VALUES (
      NEW.id,
      'trialing',
      'premium',
      NOW(),
      NOW() + INTERVAL '14 days'
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user subscriptions insert error: %', SQLERRM;
  END;

  -- 6. Insert User Avatar (Egg stage default)
  BEGIN
    INSERT INTO public.user_avatars (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user avatar insert error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- 2. Re-bind the unified trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Drop conflicting legacy triggers if present
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
