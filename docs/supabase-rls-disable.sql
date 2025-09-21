-- Supabase RLS'yi tamamen devre dışı bırak
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

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

-- Mevcut tüm politikaları sil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Students can view own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Parents can view children data" ON students;
DROP POLICY IF EXISTS "Teachers can view their students" ON students;
DROP POLICY IF EXISTS "Teachers can view own data" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own data" ON teachers;
DROP POLICY IF EXISTS "Parents can view own data" ON parents;
DROP POLICY IF EXISTS "Parents can update own data" ON parents;
DROP POLICY IF EXISTS "Students can view their parents" ON parents;
DROP POLICY IF EXISTS "Teachers can view own assignments" ON assignments;
DROP POLICY IF EXISTS "Students can view assigned work" ON assignments;
DROP POLICY IF EXISTS "Questions are viewable by all authenticated users" ON questions;
DROP POLICY IF EXISTS "Students can view own answers" ON student_answers;
DROP POLICY IF EXISTS "Students can insert own answers" ON student_answers;
DROP POLICY IF EXISTS "Students can view own analysis" ON analysis_results;
DROP POLICY IF EXISTS "Parents can view children analysis" ON analysis_results;
DROP POLICY IF EXISTS "Students can view own roadmap" ON roadmap_steps;
DROP POLICY IF EXISTS "Parents can view own parent-student relationships" ON parent_students;
DROP POLICY IF EXISTS "Students can view own parent-student relationships" ON parent_students;
DROP POLICY IF EXISTS "Service role can insert parent-student relationships" ON parent_students;
DROP POLICY IF EXISTS "Authenticated users can view tags" ON tags;
DROP POLICY IF EXISTS "Teachers can insert tags" ON tags;
DROP POLICY IF EXISTS "Authenticated users can view provinces" ON provinces;
DROP POLICY IF EXISTS "Authenticated users can view districts" ON districts;
DROP POLICY IF EXISTS "Authenticated users can view schools" ON schools;
DROP POLICY IF EXISTS "Service role can insert provinces" ON provinces;
DROP POLICY IF EXISTS "Service role can insert districts" ON districts;
DROP POLICY IF EXISTS "Service role can insert schools" ON schools;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert students" ON students;
DROP POLICY IF EXISTS "Service role can insert teachers" ON teachers;
DROP POLICY IF EXISTS "Service role can insert parents" ON parents;

-- RLS devre dışı bırakıldı - artık tüm işlemler serbest
