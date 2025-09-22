-- =====================================================
-- ELELEM NE DER - TAM VERİTABANI KURULUMU
-- =====================================================
-- Bu dosyayı Supabase SQL Editor'a kopyala ve çalıştır
-- Tüm tablolar, RLS, trigger'lar ve test verileri dahil

-- =====================================================
-- 1. MEVCUT TABLOLARI TEMİZLE (EĞER VARSA)
-- =====================================================

-- Önce tüm trigger'ları sil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS enforce_one_parent_per_student ON parent_students;

-- Sonra tüm fonksiyonları sil
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS check_one_parent_per_student();

-- Tüm tabloları sil (foreign key sırasına göre)
DROP TABLE IF EXISTS roadmap_steps CASCADE;
DROP TABLE IF EXISTS analysis_results CASCADE;
DROP TABLE IF EXISTS student_answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS parent_students CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

-- =====================================================
-- 2. TEMEL TABLOLARI OLUŞTUR
-- =====================================================

-- İller tablosu
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
  type TEXT DEFAULT 'resmi', -- resmi/özel
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı profilleri (auth.users ile bağlantısız - RLS bypass için)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID, -- NULL olabilir (auth bypass için)
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'parent', 'admin')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğrenci profili (profiles ve schools'a bağlı)
CREATE TABLE students (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  student_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  grade INTEGER NOT NULL CHECK (grade >= 5 AND grade <= 12),
  school_id UUID REFERENCES schools(id) NOT NULL,
  parent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Öğretmen profili (profiles ve schools'a bağlı)
CREATE TABLE teachers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  teacher_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  school_id UUID REFERENCES schools(id) NOT NULL,
  contact_info JSONB NOT NULL CHECK (jsonb_array_length(contact_info) >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli profili (profiles'e bağlı)
CREATE TABLE parents (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veli-Öğrenci ilişkisi
CREATE TABLE parent_students (
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'veli',
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
  options JSONB NOT NULL,
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
  time_spent INTEGER DEFAULT 0,
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
  estimated_time INTEGER DEFAULT 0,
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

-- =====================================================
-- 3. RLS'Yİ TAMAMEN DEVRE DIŞI BIRAK
-- =====================================================

-- Tüm tablolarda RLS'yi devre dışı bırak
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE provinces DISABLE ROW LEVEL SECURITY;
ALTER TABLE districts DISABLE ROW LEVEL SECURITY;
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_steps DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. TRIGGER'LARI OLUŞTUR
-- =====================================================

-- Veli-Öğrenci ilişkisi için trigger (1 veli - 1 öğrenci kontrolü)
CREATE OR REPLACE FUNCTION check_one_parent_per_student()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
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

-- =====================================================
-- 5. TEST VERİLERİNİ EKLE
-- =====================================================

-- İl verileri
INSERT INTO provinces (name) VALUES 
('İstanbul'),
('Ankara'),
('İzmir'),
('Bursa'),
('Antalya'),
('Adana'),
('Konya'),
('Gaziantep'),
('Mersin'),
('Diyarbakır');

-- İlçe verileri
INSERT INTO districts (province_id, name) 
SELECT p.id, 'Merkez' FROM provinces p;

INSERT INTO districts (province_id, name) VALUES 
((SELECT id FROM provinces WHERE name = 'İstanbul'), 'Kadıköy'),
((SELECT id FROM provinces WHERE name = 'İstanbul'), 'Beşiktaş'),
((SELECT id FROM provinces WHERE name = 'İstanbul'), 'Şişli'),
((SELECT id FROM provinces WHERE name = 'Ankara'), 'Çankaya'),
((SELECT id FROM provinces WHERE name = 'Ankara'), 'Keçiören'),
((SELECT id FROM provinces WHERE name = 'İzmir'), 'Konak'),
((SELECT id FROM provinces WHERE name = 'İzmir'), 'Karşıyaka');

-- Okul verileri
INSERT INTO schools (district_id, name, level, type) VALUES 
((SELECT id FROM districts WHERE name = 'Kadıköy'), 'Kadıköy Ortaokulu', 'ortaokul', 'resmi'),
((SELECT id FROM districts WHERE name = 'Kadıköy'), 'Kadıköy Lisesi', 'lise', 'resmi'),
((SELECT id FROM districts WHERE name = 'Çankaya'), 'Çankaya Ortaokulu', 'ortaokul', 'resmi'),
((SELECT id FROM districts WHERE name = 'Çankaya'), 'Çankaya Lisesi', 'lise', 'resmi'),
((SELECT id FROM districts WHERE name = 'Konak'), 'Konak Ortaokulu', 'ortaokul', 'resmi'),
((SELECT id FROM districts WHERE name = 'Konak'), 'Konak Lisesi', 'lise', 'resmi');

-- Admin profili oluştur
INSERT INTO profiles (id, email, name, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin@elelem.com', 'Admin User', 'admin');

-- Test öğrenci profilleri
INSERT INTO profiles (id, email, name, role) VALUES 
('00000000-0000-0000-0000-000000000002', 'ahmet.yilmaz@student.example.com', 'Ahmet Yılmaz', 'student'),
('00000000-0000-0000-0000-000000000003', 'fatma.kaya@student.example.com', 'Fatma Kaya', 'student'),
('00000000-0000-0000-0000-000000000004', 'mehmet.hoca@teacher.example.com', 'Mehmet Hoca', 'teacher'),
('00000000-0000-0000-0000-000000000005', 'ayse.ogretmen@teacher.example.com', 'Ayşe Öğretmen', 'teacher'),
('00000000-0000-0000-0000-000000000006', 'veli.baba@parent.example.com', 'Veli Baba', 'parent');

-- Test öğrenci verileri
INSERT INTO students (id, student_number, first_name, last_name, middle_name, grade, school_id, parent_id) VALUES 
('00000000-0000-0000-0000-000000000002', 'OGR001', 'Ahmet', 'Yılmaz', 'Can', 5, 
 (SELECT id FROM schools WHERE name = 'Kadıköy Ortaokulu'), '00000000-0000-0000-0000-000000000006'),
('00000000-0000-0000-0000-000000000003', 'OGR002', 'Fatma', 'Kaya', '', 6, 
 (SELECT id FROM schools WHERE name = 'Çankaya Ortaokulu'), NULL);

-- Test öğretmen verileri
INSERT INTO teachers (id, teacher_number, first_name, last_name, middle_name, school_id, contact_info) VALUES 
('00000000-0000-0000-0000-000000000004', 'OGR001', 'Mehmet', 'Hoca', '', 
 (SELECT id FROM schools WHERE name = 'Kadıköy Ortaokulu'), 
 '[{"type": "email", "value": "mehmet.hoca@okul.edu.tr"}, {"type": "phone", "value": "05551234567"}]'),
('00000000-0000-0000-0000-000000000005', 'OGR002', 'Ayşe', 'Öğretmen', 'Nur', 
 (SELECT id FROM schools WHERE name = 'Çankaya Ortaokulu'), 
 '[{"type": "email", "value": "ayse.ogretmen@okul.edu.tr"}, {"type": "phone", "value": "05557654321"}]');

-- Test veli verileri
INSERT INTO parents (id, first_name, last_name, middle_name, phone) VALUES 
('00000000-0000-0000-0000-000000000006', 'Veli', 'Baba', '', '05559876543');

-- Veli-Öğrenci ilişkisi
INSERT INTO parent_students (parent_id, student_id, relationship) VALUES 
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'baba');

-- Test ödev verileri
INSERT INTO assignments (id, title, description, grade, subject, topic, teacher_id, due_date) VALUES 
('00000000-0000-0000-0000-000000000010', 'Matematik - Kesirler', 'Kesirler konusunda temel sorular', 5, 'Matematik', 'Kesirler', 
 '00000000-0000-0000-0000-000000000004', NOW() + INTERVAL '7 days'),
('00000000-0000-0000-0000-000000000011', 'Türkçe - Fiiller', 'Fiiller konusunda test soruları', 6, 'Türkçe', 'Fiiller', 
 '00000000-0000-0000-0000-000000000005', NOW() + INTERVAL '5 days');

-- Test soru verileri
INSERT INTO questions (id, assignment_id, question, options, correct_answer, tags, difficulty, explanation) VALUES 
('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', '1/2 + 1/4 = ?', 
 '["2/6", "3/4", "1/6", "2/4"]', 1, ARRAY['kesirler', 'toplama', 'temel'], 'easy', 'Paydalar eşitlendikten sonra toplama yapılır'),
('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', '3/4 - 1/2 = ?', 
 '["2/2", "1/4", "2/4", "1/2"]', 1, ARRAY['kesirler', 'çıkarma', 'temel'], 'easy', 'Paydalar eşitlendikten sonra çıkarma yapılır'),
('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011', 'Aşağıdakilerden hangisi fiildir?', 
 '["güzel", "koşmak", "mavi", "ev"]', 1, ARRAY['fiiller', 'kelime-türleri'], 'medium', 'Fiiller iş, oluş, durum bildiren kelimelerdir');

-- Test etiket verileri
INSERT INTO tags (name, subject, grade, description) VALUES 
('kesirler', 'Matematik', 5, 'Kesirler konusu ile ilgili sorular'),
('toplama', 'Matematik', 5, 'Toplama işlemi soruları'),
('çıkarma', 'Matematik', 5, 'Çıkarma işlemi soruları'),
('fiiller', 'Türkçe', 6, 'Fiil türleri ve özellikleri'),
('kelime-türleri', 'Türkçe', 6, 'Kelime türleri genel konusu');

-- =====================================================
-- 6. İNDEXLER OLUŞTUR (PERFORMANS İÇİN)
-- =====================================================

-- Performans için indexler
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE INDEX idx_assignments_grade ON assignments(grade);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_questions_assignment ON questions(assignment_id);
CREATE INDEX idx_student_answers_student ON student_answers(student_id);
CREATE INDEX idx_student_answers_assignment ON student_answers(assignment_id);
CREATE INDEX idx_analysis_results_student ON analysis_results(student_id);
CREATE INDEX idx_roadmap_steps_analysis ON roadmap_steps(analysis_id);

-- =====================================================
-- 7. KURULUM TAMAMLANDI MESAJI
-- =====================================================

-- Kurulum başarılı mesajı
DO $$
BEGIN
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'ELELEM NE DER VERİTABANI KURULUMU TAMAMLANDI!';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'Tablolar: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
  RAISE NOTICE 'Test verileri eklendi';
  RAISE NOTICE 'RLS devre dışı bırakıldı';
  RAISE NOTICE 'Trigger''lar oluşturuldu';
  RAISE NOTICE 'Indexler oluşturuldu';
  RAISE NOTICE '=====================================================';
  RAISE NOTICE 'Artık toplu veri girişi yapabilirsiniz!';
  RAISE NOTICE '=====================================================';
END $$;
