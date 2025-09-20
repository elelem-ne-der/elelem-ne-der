'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AssignmentForm {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  questions: number;
  dueDate: string;
}

export default function CreateAssignment() {
  const [formData, setFormData] = useState<AssignmentForm>({
    title: '',
    grade: '',
    subject: '',
    topic: '',
    questions: 1,
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Form validation
      if (!formData.title || !formData.grade || !formData.subject || !formData.topic) {
        throw new Error('Lütfen tüm zorunlu alanları doldurun');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/teacher/dashboard');
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'questions' ? parseInt(value) || 1 : value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödev Başarıyla Oluşturuldu!</h2>
          <p className="text-gray-600 mb-6">Ödeviniz öğrencilerinizle paylaşılacak.</p>
          <Link
            href="/teacher/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Yeni Ödev Oluştur</h1>
            <Link
              href="/teacher/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              ← Dashboard'a Dön
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Ödev Başlığı *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Matematik - Kesirler Konu Testi"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Grade */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Sınıf Seviyesi *
              </label>
              <select
                id="grade"
                name="grade"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="">Sınıf seçin</option>
                <option value="5">5. Sınıf</option>
                <option value="6">6. Sınıf</option>
                <option value="7">7. Sınıf</option>
                <option value="8">8. Sınıf</option>
                <option value="9">9. Sınıf</option>
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
                <option value="12">12. Sınıf</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Ders *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Ders seçin</option>
                <option value="Matematik">Matematik</option>
                <option value="Türkçe">Türkçe</option>
                <option value="Fen Bilimleri">Fen Bilimleri</option>
                <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                <option value="İngilizce">İngilizce</option>
                <option value="Din Kültürü">Din Kültürü ve Ahlak Bilgisi</option>
              </select>
            </div>

            {/* Topic */}
            <div className="md:col-span-2">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Konu *
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Kesirler, Fiiller, Geometri"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>

            {/* Questions */}
            <div>
              <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-2">
                Soru Sayısı
              </label>
              <input
                type="number"
                id="questions"
                name="questions"
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.questions}
                onChange={handleChange}
              />
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Teslim Tarihi
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/teacher/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Oluşturuluyor...
                </div>
              ) : (
                'Ödev Oluştur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
