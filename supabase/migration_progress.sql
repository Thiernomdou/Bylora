-- Table user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id     UUID   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT   NOT NULL,
  theme       TEXT   NOT NULL,
  rating      TEXT   NOT NULL CHECK (rating IN ('connais', 'hesite', 'connais_pas')),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_progress" ON public.user_progress
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
