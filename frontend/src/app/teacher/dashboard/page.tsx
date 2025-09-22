'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Assignment {
  id: number;
  title: string;
  grade: number;
  subject: string;
  topic: string;
  questions: number;
  created_at: string;
}

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/backend/api/assignments');
      const data = await response.json();
      let merged = Array.isArray(data) ? data : [];
      try {
        const localRaw = typeof window !== 'undefined' ? localStorage.getItem('local_assignments') : null;
        const localList: any[] = localRaw ? JSON.parse(localRaw) : [];
        if (Array.isArray(localList) && localList.length) {
          const key = (a: any) => `${a.title}|${a.created_at}`;
          const seen = new Set(merged.map(key));
          for (const a of localList) {
            const k = key(a);
            if (!seen.has(k)) {
              merged.unshift(a);
              seen.add(k);
            }
          }
        }
      } catch (_) {}
      setAssignments(merged);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ödevler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Öğretmen Paneli</h1>
            <div className="flex space-x-4">
              <Link 
                href="/teacher/create-assignment" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Yeni Ödev Oluştur
              </Link>
              <Link 
                href="/teacher/profile" 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Profil
              </Link>
              <Link 
                href="/" 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Çıkış
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Nasıl kullanılır?</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>"Yeni Ödev Oluştur" ile sınıf, ders ve konu seç.</li>
            <li>Soru sayısını ve zorluk seviyesini belirle, kaydet.</li>
            <li>Ödev otomatik atanır; sonuçlar burada görünür.</li>
            <li>Öğrenci sonuçlarını ve zayıf/kuvvetli konuları incele.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/teacher/create-assignment" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Hemen Ödev Oluştur
            </Link>
            <Link href="/teacher/dashboard" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              İstatistikleri Gör
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ödev</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Öğrenci</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oluşturulan Ödevler</h2>
          <p className="text-gray-600">Öğrencilerinize verdiğiniz ödevleri buradan yönetebilirsiniz.</p>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz ödev oluşturmadınız</h3>
            <p className="text-gray-600 mb-6">Öğrencileriniz için ilk ödevinizi oluşturun.</p>
            <Link 
              href="/teacher/create-assignment"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              İlk Ödevi Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {assignment.grade}. Sınıf
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {assignment.subject}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {assignment.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  <strong>Konu:</strong> {assignment.topic}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {assignment.questions} soru
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(assignment.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    href={`/teacher/assignment/${assignment.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Görüntüle
                  </Link>
                  <button className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition">
                    Düzenle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
