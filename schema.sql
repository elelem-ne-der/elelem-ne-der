-- Supabase Schema - FIXED (Trigger ile 1 veli-1 öğrenci kontrolü)
-- Bu dosyayı Supabase SQL Editor'a kopyala ve çalıştır

-- Kullanıcı profilleri (Supabase auth.users ile senkronize)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İller tablosu (bağımsız)
CREATE TABLE provinces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlçeler tablosu (provinces'e bağlı)
CREATE TABLE districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id UUID REFERENCES provinces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(province_id, name)
);

-- Okullar tablosu (districts'e bağlı)
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('anaokulu', 'ilkokul', 'ortaokul', 'lise', 'üniversite')),
  type TEXT, -- resmi/özel
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenci profili (profiles ve schools'a bağlı)
CREATE TABLE students (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  student_number TEXT UNIQUE NOT NULL, -- Öğrenci numarası (unique)
  first_name TEXT NOT NULL, -- Ad (zorunlu)
  last_name TEXT NOT NULL, -- Soyad (zorunlu)
  middle_name TEXT, -- Orta isim (isteğe bağlı)
  grade INTEGER NOT NULL CHECK (grade >= 5 AND grade <= 12), -- 5-12. sınıf arası
  school_id UUID REFERENCES schools(id) NOT NULL, -- Okul foreign key
  parent_id UUID REFERENCES profiles(id), -- Maksimum 1 veli
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğretmen profili (profiles ve schools'a bağlı)
CREATE TABLE teachers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  teacher_number TEXT UNIQUE NOT NULL, -- Öğretmen numarası (unique)
  first_name TEXT NOT NULL, -- Ad (zorunlu)
  last_name TEXT NOT NULL, -- Soyad (zorunlu)
  middle_name TEXT, -- Orta isim (isteğe bağlı)
  school_id UUID REFERENCES schools(id) NOT NULL, -- Okul foreign key
  contact_info JSONB NOT NULL CHECK (jsonb_array_length(contact_info) >= 1), -- En az 1 mail/telefon
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli profili (profiles'e bağlı)
CREATE TABLE parents (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  first_name TEXT NOT NULL, -- Ad (zorunlu)
  last_name TEXT NOT NULL, -- Soyad (zorunlu)
  middle_name TEXT, -- Orta isim (isteğe bağlı)
  phone TEXT, -- Telefon numarası
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli-Öğrenci ilişkisi (trigger ile 1 veli - 1 öğrenci kontrolü)
CREATE TABLE parent_students (
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'veli', -- anne/baba/vasi vb.
  PRIMARY KEY (parent_id, student_id)
);

-- Ödevler (teachers'a bağlı)
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

-- Sorular (assignments'a bağlı)
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

-- Öğrenci cevapları (students, questions, assignments'a bağlı)
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

-- Analiz sonuçları (students, assignments'a bağlı)
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

-- Yol haritası adımları (analysis_results'e bağlı)
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

-- Etiketler (bağımsız)
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 12),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps ENABLE ROW LEVEL SECURITY;

-- Profil politikaları
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Öğrenci politikaları
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Parents can view children data" ON students
  FOR SELECT USING (id IN (
    SELECT student_id FROM parent_students WHERE parent_id = auth.uid()
  ));

CREATE POLICY "Teachers can view their students" ON students
  FOR SELECT USING (id IN (
    SELECT student_id FROM student_answers sa
    JOIN assignments a ON sa.assignment_id = a.id
    JOIN teachers t ON a.teacher_id = t.id
    WHERE t.id = auth.uid()
  ));

-- Öğretmen politikaları
CREATE POLICY "Teachers can view own data" ON teachers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can update own data" ON teachers
  FOR UPDATE USING (auth.uid() = id);

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

-- Okul politikaları (tüm authenticated kullanıcılar görebilir)
CREATE POLICY "Authenticated users can view provinces" ON provinces
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view districts" ON districts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view schools" ON schools
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin politikaları (veri girişi için)
CREATE POLICY "Service role can insert provinces" ON provinces
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert districts" ON districts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert schools" ON schools
  FOR INSERT WITH CHECK (true);

-- Auth triggers (kullanıcı kayıt olduğunda profiles'a otomatik ekle)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Veli-Öğrenci ilişkisi için trigger (1 veli - 1 öğrenci kontrolü)
CREATE OR REPLACE FUNCTION check_one_parent_per_student()
RETURNS TRIGGER AS $$
BEGIN
  -- Aynı öğrenciye başka bir veli atanmış mı kontrol et
  IF EXISTS (
    SELECT 1 FROM parent_students
    WHERE student_id = NEW.student_id
    AND parent_id != NEW.parent_id
  ) THEN
    RAISE EXCEPTION 'Bu öğrenciye zaten bir veli atanmış';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı parent_students tablosuna ekle
CREATE TRIGGER enforce_one_parent_per_student
  BEFORE INSERT ON parent_students
  FOR EACH ROW EXECUTE FUNCTION check_one_parent_per_student();
