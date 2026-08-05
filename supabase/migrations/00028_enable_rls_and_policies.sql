-- Enable Row Level Security and add policies for protected tables

-- 1. Enable RLS on user-owned tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE coins_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Policies for profiles
CREATE POLICY "Profiles: authenticated users can manage their own profile"
  ON profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Policies for daily workouts
CREATE POLICY "Daily workouts: authenticated users can access their own workouts"
  ON daily_workouts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Policies for workout items
CREATE POLICY "Workout items: allow access based on owning workout"
  ON workout_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM daily_workouts
      WHERE id = workout_items.workout_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_workouts
      WHERE id = workout_items.workout_id
      AND user_id = auth.uid()
    )
  );

-- 5. Policies for activity logs
CREATE POLICY "Activity logs: users may read and write their own logs"
  ON activity_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Policies for brain scores
CREATE POLICY "Brain scores: users may read/write owned scores"
  ON brain_scores
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Policies for streaks
CREATE POLICY "Streaks: users may manage their own streak record"
  ON streaks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. Policies for XP ledger
CREATE POLICY "XP ledger: users may access their own transactions"
  ON xp_ledger
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. Policies for coins ledger
CREATE POLICY "Coins ledger: users may access their own transactions"
  ON coins_ledger
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. Policies for achievements
CREATE POLICY "Achievements: users may access their own achievements"
  ON achievements
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 11. Policies for missions
CREATE POLICY "Missions: users may access their own missions"
  ON missions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 12. Policies for mission progress
CREATE POLICY "Mission progress: allow access if user owns parent mission"
  ON mission_progress
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM missions
      WHERE id = mission_progress.mission_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM missions
      WHERE id = mission_progress.mission_id
      AND user_id = auth.uid()
    )
  );

-- 13. Policies for notifications
CREATE POLICY "Notifications: users may access their own notifications"
  ON notifications
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 14. Policies for subscriptions
CREATE POLICY "Subscriptions: users may access their own subscription"
  ON subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 15. Public read policies for content tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories: allow public select"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Activities: allow public select for active activities"
  ON activities
  FOR SELECT
  USING (is_active = true);

-- 16. Protect categories/activities data from client-side writes by requiring service role
CREATE POLICY "Categories: deny client writes"
  ON categories
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Activities: deny client writes"
  ON activities
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
