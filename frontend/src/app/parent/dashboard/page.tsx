'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ChildStats {
  name: string;
  grade: number;
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  weakTopics: string[];
  strongTopics: string[];
  recentActivity: {
    date: string;
    subject: string;
    score: number;
    topic: string;
  }[];
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<ChildStats[]>([
    {
      name: 'Ahmet Yılmaz',
      grade: 5,
      totalAssignments: 12,
      completedAssignments: 9,
      averageScore: 78,
      weakTopics: ['Kesirler', 'Fiiller'],
      strongTopics: ['Toplama', 'İsimler'],
      recentActivity: [
        { date: '2025-09-20', subject: 'Matematik', score: 85, topic: 'Kesirler' },
        { date: '2025-09-19', subject: 'Türkçe', score: 92, topic: 'Fiiller' },
        { date: '2025-09-18', subject: 'Matematik', score: 75, topic: 'Toplama' },
      ]
    },
    {
      name: 'Fatma Yılmaz',
      grade: 7,
      totalAssignments: 15,
      completedAssignments: 12,
      averageScore: 88,
      weakTopics: ['Geometri'],
      strongTopics: ['Türkçe', 'Fen Bilimleri', 'İngilizce'],
      recentActivity: [
        { date: '2025-09-20', subject: 'Geometri', score: 82, topic: 'Üçgenler' },
        { date: '2025-09-19', subject: 'İngilizce', score: 95, topic: 'Present Tense' },
      ]
    }
  ]);

  const [selectedChild, setSelectedChild] = useState<ChildStats>(children[0]);

  useEffect(() => {
    // API'den çocuk verilerini çek
    // setChildren(apiResponse);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Veli Paneli</h1>
            <div className="flex space-x-4">
              <Link
                href="/parent/reports"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Detaylı Raporlar
              </Link>
              <Link
                href="/parent/profile"
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
        <div className="mb-8 bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Nasıl kullanılır? (Yapay Zeka)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Çocuğun zayıf/kuvvetli konuları AI analizi ile özetlenir.</li>
            <li>"Detaylı Raporlar" bölümünde konu bazlı önerileri görebilirsiniz.</li>
            <li>Önerilere göre tekrar ödevleri talep edin; gelişimi takip edin.</li>
          </ul>
          <div className="mt-4">
            <Link href="/parent/reports" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Detaylı Raporlara Git</Link>
          </div>
        </div>
        {/* Children Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Çocuk Seçimi</h2>
          <div className="flex space-x-4">
            {children.map((child, index) => (
              <button
                key={index}
                onClick={() => setSelectedChild(child)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  selectedChild.name === child.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {child.name} ({child.grade}. Sınıf)
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
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
                <p className="text-2xl font-semibold text-gray-900">{selectedChild.totalAssignments}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{selectedChild.completedAssignments}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{selectedChild.averageScore}%</p>
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
                <p className="text-sm font-medium text-gray-600">Aktivite Sayısı</p>
                <p className="text-2xl font-semibold text-gray-900">{selectedChild.recentActivity.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weak and Strong Topics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {selectedChild.weakTopics.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">⚠️ Geliştirilmesi Gereken Konular</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChild.weakTopics.map((topic, index) => (
                  <span key={index} className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedChild.strongTopics.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4">✅ Başarılı Olduğu Konular</h3>
              <div className="flex flex-wrap gap-2">
                {selectedChild.strongTopics.map((topic, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedChild.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(activity.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.topic}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.score >= 80 ? 'bg-green-100 text-green-800' :
                        activity.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
