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

-- Öğretmen profili
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

-- Veli profili
CREATE TABLE parents (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  first_name TEXT NOT NULL, -- Ad (zorunlu)
  last_name TEXT NOT NULL, -- Soyad (zorunlu)
  middle_name TEXT, -- Orta isim (isteğe bağlı)
  phone TEXT, -- Telefon numarası
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli-Öğrenci ilişkisi (1 veli - 1 öğrenci kısıtı için)
CREATE TABLE parent_students (
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'veli', -- anne/baba/vasi vb.
  PRIMARY KEY (parent_id, student_id),
  CONSTRAINT one_parent_per_student CHECK (
    NOT EXISTS (
      SELECT 1 FROM parent_students ps2
      WHERE ps2.student_id = parent_students.student_id
      AND ps2.parent_id != parent_students.parent_id
    )
  )
);

-- İller tablosu
CREATE TABLE provinces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlçeler tablosu
CREATE TABLE districts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id UUID REFERENCES provinces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(province_id, name)
);

-- Okullar tablosu
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
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

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

-- Örnek veriler (veri girişi için)
INSERT INTO tags (name, subject, grade, description) VALUES
  ('kesirler', 'Matematik', 5, 'Kesir işlemleri ve kavramları'),
  ('toplama', 'Matematik', 5, 'Temel toplama işlemleri'),
  ('çıkarma', 'Matematik', 5, 'Temel çıkarma işlemleri'),
  ('fiiller', 'Türkçe', 6, 'Fiil türleri ve çekimleri'),
  ('isimler', 'Türkçe', 6, 'İsim türleri ve özellikleri');

-- Örnek öğrenci verisi
INSERT INTO profiles (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'ahmet.yilmaz@okul.edu.tr', 'Ahmet Yılmaz', 'student'),
  ('550e8400-e29b-41d4-a716-446655440002', 'fatma.kaya@okul.edu.tr', 'Fatma Kaya', 'student');

INSERT INTO students (id, student_number, first_name, last_name, grade, province, district, school_type, school_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'OGR001', 'Ahmet', 'Yılmaz', 5, 'İstanbul', 'Kadıköy', 'ortaokul', 'Kadıköy Ortaokulu'),
  ('550e8400-e29b-41d4-a716-446655440002', 'OGR002', 'Fatma', 'Kaya', 6, 'Ankara', 'Çankaya', 'ortaokul', 'Çankaya Ortaokulu');

-- Örnek öğretmen verisi
INSERT INTO profiles (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'mehmet.hoca@okul.edu.tr', 'Mehmet Hoca', 'teacher'),
  ('550e8400-e29b-41d4-a716-446655440004', 'ayse.ogretmen@okul.edu.tr', 'Ayşe Öğretmen', 'teacher');

INSERT INTO teachers (id, teacher_number, first_name, last_name, province, district, school_name, contact_info) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'OGR001', 'Mehmet', 'Hoca', 'İstanbul', 'Kadıköy', 'Kadıköy Ortaokulu', '[{"type": "email", "value": "mehmet.hoca@okul.edu.tr"}, {"type": "phone", "value": "05551234567"}]'),
  ('550e8400-e29b-41d4-a716-446655440004', 'OGR002', 'Ayşe', 'Öğretmen', 'Ankara', 'Çankaya', 'Çankaya Ortaokulu', '[{"type": "email", "value": "ayse.ogretmen@okul.edu.tr"}, {"type": "phone", "value": "05557654321"}]');

-- Örnek veli verisi
INSERT INTO profiles (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440005', 'veli.yilmaz@email.com', 'Veli Yılmaz', 'parent');

INSERT INTO parents (id, first_name, last_name, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440005', 'Veli', 'Yılmaz', '05559876543');

-- Veli-Öğrenci ilişkisi
INSERT INTO parent_students (parent_id, student_id, relationship) VALUES
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'baba');

-- Örnek ödev
INSERT INTO assignments (title, description, grade, subject, topic, teacher_id, due_date) VALUES
  ('Matematik - Kesirler Testi', 'Bu hafta işlediğimiz kesir konularını pekiştirmek için', 5, 'Matematik', 'Kesirler', '550e8400-e29b-41d4-a716-446655440003', NOW() + INTERVAL '7 days');

-- Örnek sorular
INSERT INTO questions (assignment_id, question, options, correct_answer, tags, difficulty, explanation) VALUES
  ((SELECT id FROM assignments WHERE title = 'Matematik - Kesirler Testi'),
   '1/2 + 1/4 = ?',
   '["2/6", "3/4", "1/6", "2/4"]',
   1,
   ARRAY['kesirler', 'toplama'],
   'easy',
   '1/2 = 2/4, 2/4 + 1/4 = 3/4');
