'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StudentForm {
  student_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  grade: string;
  province: string;
  district: string;
  school_type: string;
  school_name: string;
}

interface TeacherForm {
  teacher_number: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  province: string;
  district: string;
  school_name: string;
  contact_email: string;
  contact_phone: string;
}

export default function DataEntryPage() {
  const [studentForm, setStudentForm] = useState<StudentForm>({
    student_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    grade: '',
    province: '',
    district: '',
    school_type: 'ortaokul',
    school_name: ''
  });

  const [teacherForm, setTeacherForm] = useState<TeacherForm>({
    teacher_number: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    province: '',
    district: '',
    school_name: '',
    contact_email: '',
    contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setMessage('❌ Giriş yapmanız gerekiyor');
        return;
      }

      const response = await fetch(`/api/backend/api/admin/seed-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'student',
          data: studentForm
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Öğrenci başarıyla eklendi!');
        setStudentForm({
          student_number: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          grade: '',
          province: '',
          district: '',
          school_type: 'ortaokul',
          school_name: ''
        });
      } else {
        setMessage('❌ Hata: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Bağlantı hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setMessage('❌ Giriş yapmanız gerekiyor');
        return;
      }

      const response = await fetch(`/api/backend/api/admin/seed-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'teacher',
          data: teacherForm
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Öğretmen başarıyla eklendi!');
        setTeacherForm({
          teacher_number: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          province: '',
          district: '',
          school_name: '',
          contact_email: '',
          contact_phone: ''
        });
      } else {
        setMessage('❌ Hata: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Bağlantı hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (form: 'student' | 'teacher', field: string, value: string) => {
    if (form === 'student') {
      setStudentForm(prev => ({ ...prev, [field]: value }));
    } else {
      setTeacherForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin - Veri Girişi</h1>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              ← Admin Paneli
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('student')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'student'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👨‍🎓 Öğrenci Ekle
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teacher'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👨‍🏫 Öğretmen Ekle
              </button>
            </nav>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Student Form */}
        {activeTab === 'student' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-6">Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleStudentSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Student Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öğrenci Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: OGR001"
                    value={studentForm.student_number}
                    onChange={(e) => handleInputChange('student', 'student_number', e.target.value)}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sınıf (5-12) *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={studentForm.grade}
                    onChange={(e) => handleInputChange('student', 'grade', e.target.value)}
                  >
                    <option value="">Sınıf seçin</option>
                    {Array.from({ length: 8 }, (_, i) => i + 5).map(grade => (
                      <option key={grade} value={grade}>{grade}. Sınıf</option>
                    ))}
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Öğrencinin adı"
                    value={studentForm.first_name}
                    onChange={(e) => handleInputChange('student', 'first_name', e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Öğrencinin soyadı"
                    value={studentForm.last_name}
                    onChange={(e) => handleInputChange('student', 'last_name', e.target.value)}
                  />
                </div>

                {/* Middle Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orta İsim (İsteğe bağlı)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Öğrencinin orta ismi"
                    value={studentForm.middle_name}
                    onChange={(e) => handleInputChange('student', 'middle_name', e.target.value)}
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İl *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İstanbul"
                    value={studentForm.province}
                    onChange={(e) => handleInputChange('student', 'province', e.target.value)}
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kadıköy"
                    value={studentForm.district}
                    onChange={(e) => handleInputChange('student', 'district', e.target.value)}
                  />
                </div>

                {/* School Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Okul Türü *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={studentForm.school_type}
                    onChange={(e) => handleInputChange('student', 'school_type', e.target.value)}
                  >
                    <option value="ortaokul">Ortaokul</option>
                    <option value="lise">Lise</option>
                  </select>
                </div>

                {/* School Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Okul Adı *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Okulun tam adı"
                    value={studentForm.school_name}
                    onChange={(e) => handleInputChange('student', 'school_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Ekleniyor...' : 'Öğrenci Ekle'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teacher Form */}
        {activeTab === 'teacher' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-6">Yeni Öğretmen Ekle</h2>
            <form onSubmit={handleTeacherSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Teacher Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öğretmen Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Örn: OGRT001"
                    value={teacherForm.teacher_number}
                    onChange={(e) => handleInputChange('teacher', 'teacher_number', e.target.value)}
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Öğretmenin adı"
                    value={teacherForm.first_name}
                    onChange={(e) => handleInputChange('teacher', 'first_name', e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Öğretmenin soyadı"
                    value={teacherForm.last_name}
                    onChange={(e) => handleInputChange('teacher', 'last_name', e.target.value)}
                  />
                </div>

                {/* Middle Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orta İsim (İsteğe bağlı)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Öğretmenin orta ismi"
                    value={teacherForm.middle_name}
                    onChange={(e) => handleInputChange('teacher', 'middle_name', e.target.value)}
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İl *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="İstanbul"
                    value={teacherForm.province}
                    onChange={(e) => handleInputChange('teacher', 'province', e.target.value)}
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kadıköy"
                    value={teacherForm.district}
                    onChange={(e) => handleInputChange('teacher', 'district', e.target.value)}
                  />
                </div>

                {/* School Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Okul Adı *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Okulun tam adı"
                    value={teacherForm.school_name}
                    onChange={(e) => handleInputChange('teacher', 'school_name', e.target.value)}
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ogretmen@okul.edu.tr"
                    value={teacherForm.contact_email}
                    onChange={(e) => handleInputChange('teacher', 'contact_email', e.target.value)}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0555 555 5555"
                    value={teacherForm.contact_phone}
                    onChange={(e) => handleInputChange('teacher', 'contact_phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Ekleniyor...' : 'Öğretmen Ekle'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
