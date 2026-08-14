-- Add locale column to user_settings (used by settings page + i18n provider).
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';
