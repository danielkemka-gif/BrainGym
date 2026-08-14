-- Attribute a referral to a new user at profile creation time.
-- Idempotent, runs as the function owner (bypasses RLS), and can be called
-- by the authenticated user for their own account or by the service role.

CREATE OR REPLACE FUNCTION public.attribute_referral(p_user_id UUID, p_ref TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id UUID;
BEGIN
  -- Only allow a user to attribute their own account; service_role (auth.uid() IS NULL) is allowed.
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RETURN;
  END IF;

  IF p_ref IS NULL OR btrim(p_ref) = '' THEN
    RETURN;
  END IF;

  -- Idempotent: never overwrite an existing attribution.
  IF EXISTS (SELECT 1 FROM profiles WHERE user_id = p_user_id AND referred_by IS NOT NULL) THEN
    RETURN;
  END IF;

  SELECT user_id INTO referrer_id
  FROM profiles
  WHERE referral_code = btrim(p_ref)
    AND onboarding_complete = true
  LIMIT 1;

  IF referrer_id IS NULL OR referrer_id = p_user_id THEN
    RETURN;
  END IF;

  UPDATE profiles
  SET referred_by = referrer_id
  WHERE user_id = p_user_id;

  UPDATE profiles
  SET referral_count = COALESCE(referral_count, 0) + 1
  WHERE user_id = referrer_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attribute_referral(UUID, TEXT) TO service_role;
