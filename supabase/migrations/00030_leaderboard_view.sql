-- Weekly leaderboard view: exposes per-user weekly XP plus display info to all
-- authenticated users. Runs as the view owner, so it bypasses RLS on
-- xp_ledger / profiles and returns every user's row for the leaderboard UI.
CREATE OR REPLACE VIEW public.leaderboard_weekly AS
SELECT
  l.user_id,
  COALESCE(NULLIF(p.name, ''), 'Anonymous') AS name,
  p.avatar_url,
  SUM(l.amount)::integer AS weekly_xp
FROM public.xp_ledger l
JOIN public.profiles p ON p.user_id = l.user_id
WHERE l.created_at >= (now() - interval '7 days')
GROUP BY l.user_id, p.name, p.avatar_url;

GRANT SELECT ON public.leaderboard_weekly TO authenticated;
