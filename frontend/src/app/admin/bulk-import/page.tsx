'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ImportResult {
  success: boolean;
  message: string;
  results?: any[];
  errors?: any[];
}

export default function BulkImportPage() {
  const [importType, setImportType] = useState<'students' | 'teachers'>('students');
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      let data;

      try {
        data = JSON.parse(jsonData);
      } catch (error) {
        throw new Error('Geçersiz JSON formatı');
      }

      if (!Array.isArray(data)) {
        throw new Error('JSON array formatında olmalı');
      }

      const response = await fetch('http://localhost:3001/api/admin/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || '',
        },
        body: JSON.stringify({
          dataType: importType,
          data
        }),
      });

      const result = await response.json();
      setResult(result);

    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = (type: 'students' | 'teachers') => {
    const samples = {
      students: [
        {
          student_number: 'OGR001',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          middle_name: 'Can',
          grade: 5,
          province: 'İstanbul',
          district: 'Kadıköy',
          school_type: 'ortaokul',
          school_name: 'Kadıköy Ortaokulu'
        },
        {
          student_number: 'OGR002',
          first_name: 'Fatma',
          last_name: 'Kaya',
          middle_name: '',
          grade: 6,
          province: 'Ankara',
          district: 'Çankaya',
          school_type: 'ortaokul',
          school_name: 'Çankaya Ortaokulu'
        }
      ],
      teachers: [
        {
          teacher_number: 'OGR001',
          first_name: 'Mehmet',
          last_name: 'Hoca',
          middle_name: '',
          province: 'İstanbul',
          district: 'Kadıköy',
          school_name: 'Kadıköy Ortaokulu',
          contact_email: 'mehmet.hoca@okul.edu.tr',
          contact_phone: '05551234567'
        },
        {
          teacher_number: 'OGR002',
          first_name: 'Ayşe',
          last_name: 'Öğretmen',
          middle_name: 'Nur',
          province: 'Ankara',
          district: 'Çankaya',
          school_name: 'Çankaya Ortaokulu',
          contact_email: 'ayse.ogretmen@okul.edu.tr',
          contact_phone: '05557654321'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(samples[type], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_sample.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleData = (type: 'students' | 'teachers') => {
    const samples = {
      students: [
        {
          student_number: 'OGR001',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          middle_name: 'Can',
          grade: 5,
          province: 'İstanbul',
          district: 'Kadıköy',
          school_type: 'ortaokul',
          school_name: 'Kadıköy Ortaokulu'
        },
        {
          student_number: 'OGR002',
          first_name: 'Fatma',
          last_name: 'Kaya',
          middle_name: '',
          grade: 6,
          province: 'Ankara',
          district: 'Çankaya',
          school_type: 'ortaokul',
          school_name: 'Çankaya Ortaokulu'
        }
      ],
      teachers: [
        {
          teacher_number: 'OGR001',
          first_name: 'Mehmet',
          last_name: 'Hoca',
          middle_name: '',
          province: 'İstanbul',
          district: 'Kadıköy',
          school_name: 'Kadıköy Ortaokulu',
          contact_email: 'mehmet.hoca@okul.edu.tr',
          contact_phone: '05551234567'
        },
        {
          teacher_number: 'OGR002',
          first_name: 'Ayşe',
          last_name: 'Öğretmen',
          middle_name: 'Nur',
          province: 'Ankara',
          district: 'Çankaya',
          school_name: 'Çankaya Ortaokulu',
          contact_email: 'ayse.ogretmen@okul.edu.tr',
          contact_phone: '05557654321'
        }
      ]
    };

    setJsonData(JSON.stringify(samples[type], null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin - Toplu Veri Girişi</h1>
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
        {/* Import Type Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İçe Aktarma Türü Seçin</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setImportType('students')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                importType === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨‍🎓 Öğrenciler
            </button>
            <button
              onClick={() => setImportType('teachers')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                importType === 'teachers'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨‍🏫 Öğretmenler
            </button>
          </div>
        </div>

        {/* Sample Data */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Örnek Veri Formatı</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => downloadSample(importType)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              📥 Örnek JSON İndir
            </button>
            <button
              onClick={() => loadSampleData(importType)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              📋 Örneği Yükle
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 overflow-auto max-h-64">
              {JSON.stringify([
                importType === 'students' ? {
                  student_number: 'OGR001',
                  first_name: 'Ahmet',
                  last_name: 'Yılmaz',
                  middle_name: 'Can',
                  grade: 5,
                  province: 'İstanbul',
                  district: 'Kadıköy',
                  school_type: 'ortaokul',
                  school_name: 'Kadıköy Ortaokulu'
                } : {
                  teacher_number: 'OGR001',
                  first_name: 'Mehmet',
                  last_name: 'Hoca',
                  middle_name: '',
                  province: 'İstanbul',
                  district: 'Kadıköy',
                  school_name: 'Kadıköy Ortaokulu',
                  contact_email: 'mehmet.hoca@okul.edu.tr',
                  contact_phone: '05551234567'
                }
              ], null, 2)}
            </pre>
          </div>
        </div>

        {/* JSON Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">JSON Veri Girişi</h2>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={`JSON array formatında ${importType} verilerini girin...`}
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          />

          <div className="mt-4 text-sm text-gray-600">
            <p>⚠️ <strong>Zorunlu Alanlar:</strong></p>
            <p>• Tüm alanlar dolu olmalı</p>
            <p>• student_number/teacher_number unique olmalı</p>
            <p>• grade 5-12 arası olmalı</p>
            <p>• school_type: 'ortaokul' veya 'lise'</p>
          </div>
        </div>

        {/* Import Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">İçe Aktarma</h2>
              <p className="text-gray-600">
                {jsonData ? 'JSON verisi hazır. İçe aktarmak için butona tıklayın.' : 'JSON verisi girin ve içe aktarın.'}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={loading || !jsonData.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  İçe aktarılıyor...
                </div>
              ) : (
                '📤 Toplu İçe Aktar'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Sonuç</h3>

            <div className={`p-4 rounded-lg mb-4 ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {result.message}
            </div>

            {result.results && result.results.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-green-600 mb-2">✅ Başarılı Kayıtlar ({result.results.length})</h4>
                <div className="bg-green-50 p-3 rounded text-sm">
                  {result.results.map((item, index) => (
                    <div key={index} className="mb-1">
                      {importType === 'students' ? item.first_name + ' ' + item.last_name : item.first_name + ' ' + item.last_name} - {importType === 'students' ? item.student_number : item.teacher_number}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2">❌ Hatalı Kayıtlar ({result.errors.length})</h4>
                <div className="bg-red-50 p-3 rounded text-sm">
                  {result.errors.map((error, index) => (
                    <div key={index} className="mb-1 text-red-700">
                      {importType === 'students' ? error.student : error.teacher}: {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
