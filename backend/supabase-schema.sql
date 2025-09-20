-- Supabase veritabanı şeması

-- Kullanıcılar tablosu (Supabase auth.users ile bağlantılı)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenci profili
CREATE TABLE students (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
  parent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğretmen profili
CREATE TABLE teachers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  school TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli profili
CREATE TABLE parents (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli-Öğrenci ilişkisi
CREATE TABLE parent_students (
  parent_id UUID REFERENCES parents(id),
  student_id UUID REFERENCES students(id),
  PRIMARY KEY (parent_id, student_id)
);

-- Ödevler
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE
);

-- Sorular
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["A", "B", "C", "D"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  tags TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenci cevapları
CREATE TABLE student_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  assignment_id UUID REFERENCES assignments(id) NOT NULL,
  selected_answer INTEGER NOT NULL CHECK (selected_answer >= 0 AND selected_answer <= 3),
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER DEFAULT 0, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analiz sonuçları
CREATE TABLE analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) NOT NULL,
  assignment_id UUID REFERENCES assignments(id) NOT NULL,
  weak_topics TEXT[] DEFAULT '{}',
  strong_topics TEXT[] DEFAULT '{}',
  overall_score DECIMAL(5,2) NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Yol haritası adımları
CREATE TABLE roadmap_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('study', 'practice', 'test')) NOT NULL,
  resources TEXT[] DEFAULT '{}',
  estimated_time INTEGER DEFAULT 0, -- minutes
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Etiketler
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;

-- Profil politikaları
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Öğrenci politikaları
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Parents can view children data" ON students
  FOR SELECT USING (id IN (
    SELECT student_id FROM parent_students WHERE parent_id = auth.uid()
  ));

-- Ödev politikaları
CREATE POLICY "Teachers can view own assignments" ON assignments
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Students can view assigned work" ON assignments
  FOR SELECT USING (true); -- Tüm öğrenciler ödevleri görebilir

-- Soru politikaları
CREATE POLICY "Questions are viewable by all authenticated users" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Öğrenci cevap politikaları
CREATE POLICY "Students can view own answers" ON student_answers
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert own answers" ON student_answers
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Analiz sonuç politikaları
CREATE POLICY "Students can view own analysis" ON analysis_results
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Parents can view children analysis" ON analysis_results
  FOR SELECT USING (student_id IN (
    SELECT student_id FROM parent_students WHERE parent_id = auth.uid()
  ));

-- Yol haritası politikaları
CREATE POLICY "Students can view own roadmap" ON roadmap_steps
  FOR SELECT USING (analysis_id IN (
    SELECT id FROM analysis_results WHERE student_id = auth.uid()
  ));

-- Örnek veriler
INSERT INTO tags (name, subject, grade, description) VALUES
  ('kesirler', 'Matematik', 5, 'Kesir işlemleri ve kavramları'),
  ('toplama', 'Matematik', 5, 'Temel toplama işlemleri'),
  ('çıkarma', 'Matematik', 5, 'Temel çıkarma işlemleri'),
  ('fiiller', 'Türkçe', 6, 'Fiil türleri ve çekimleri'),
  ('isimler', 'Türkçe', 6, 'İsim türleri ve özellikleri');
