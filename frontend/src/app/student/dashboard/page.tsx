'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: number;
  title: string;
  grade: number;
  subject: string;
  topic: string;
  questions: number;
  created_at: string;
}

interface StudentStats {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  weakTopics: string[];
  strongTopics: string[];
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState<StudentStats>({
    totalAssignments: 0,
    completedAssignments: 0,
    averageScore: 0,
    weakTopics: [],
    strongTopics: []
  });
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/student/login');
      return;
    }
    fetchAssignments();
  }, [user, router]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/assignments');
      const data = await response.json();
      setAssignments(data);

      // Sample performance data
      const sampleStats: StudentStats = {
        totalAssignments: data.length,
        completedAssignments: Math.floor(data.length * 0.7), // %70 tamamlanmış
        averageScore: 82,
        weakTopics: ['Kesirler', 'Fiiller'],
        strongTopics: ['Toplama', 'İsimler']
      };
      setStudentStats(sampleStats);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Öğrenci Paneli</h1>
            <div className="flex space-x-4">
              <Link 
                href="/student/profile" 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ödev</p>
                <p className="text-2xl font-semibold text-gray-900">{studentStats.totalAssignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-semibold text-gray-900">{studentStats.completedAssignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <p className="text-2xl font-semibold text-gray-900">{studentStats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Konu Sayısı</p>
                <p className="text-2xl font-semibold text-gray-900">{studentStats.weakTopics.length + studentStats.strongTopics.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weak and Strong Topics */}
        {(studentStats.weakTopics.length > 0 || studentStats.strongTopics.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {studentStats.weakTopics.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Geliştirilmesi Gereken Konular</h3>
                <div className="flex flex-wrap gap-2">
                  {studentStats.weakTopics.map((topic, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {studentStats.strongTopics.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Başarılı Olduğun Konular</h3>
                <div className="flex flex-wrap gap-2">
                  {studentStats.strongTopics.map((topic, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Atanan Ödevler</h2>
          <p className="text-gray-600">Öğretmeninizin size verdiği ödevleri buradan çözebilirsiniz.</p>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz ödev yok</h3>
            <p className="text-gray-600">Öğretmeniniz size ödev verdiğinde burada görünecek.</p>
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
                
                <Link 
                  href={`/student/assignment/${assignment.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center block"
                >
                  Ödevi Çöz
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
