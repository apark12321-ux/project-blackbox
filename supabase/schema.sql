-- ═══════════════════════════════════════════════
-- AlgoMaker Beta · Supabase DB Schema
-- ═══════════════════════════════════════════════
-- 이 SQL 전체를 Supabase Dashboard의 SQL Editor에 붙여넣고 "Run" 눌러주세요.
-- 한 번만 실행하면 됩니다.

-- 1. profiles 테이블 — 사용자 추가 정보
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits_remaining INTEGER DEFAULT 10,  -- Beta는 무료 10개 영상
  senior_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. projects 테이블 — 사용자의 영상 프로젝트 저장
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  category TEXT,
  title TEXT,
  headline TEXT,
  dek TEXT,
  status TEXT DEFAULT 'draft',  -- draft, script, video, published
  script_blocks JSONB,
  news_items JSONB,
  seo_data JSONB,
  video_url TEXT,
  tts_url TEXT,
  senior_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. usage_logs — API 사용량 추적 (과다 사용 방지용)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  api_type TEXT NOT NULL,  -- gemini, naver_news, elevenlabs, tts_fallback
  tokens_used INTEGER,
  cost_estimate NUMERIC(10, 4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- RLS (Row Level Security) 활성화
-- 각 사용자는 자기 데이터만 볼 수 있음
-- ═══════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- profiles 정책
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- projects 정책
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- usage_logs 정책
CREATE POLICY "Users can view own usage"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- 사용자 가입 시 자동으로 profile 생성
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 실행 완료 메시지
SELECT 'AlgoMaker Beta DB 스키마 생성 완료 ✓' AS status;
