'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendOverride, setBackendOverride] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');

  const buildUrl = (path: string) => {
    if (!backendOverride) return `/api/backend${path}`;
    const sep = path.includes('?') ? '&' : '?';
    return `/api/backend${path}${sep}backend=${encodeURIComponent(backendOverride.replace(/\/$/, ''))}`;
  };

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildUrl('/api/assignments'));
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' });
    } finally {
      setLoading(false);
    }
  };

  const testAI = async () => {
    setLoading(true);
    try {
      // Önce basit bir test yapalım
      const response = await fetch(buildUrl('/api/status'));

      if (!response.ok) {
        throw new Error(`Backend çalışmıyor! Status: ${response.status}`);
      }

      // AI endpoint'ini test et
      const aiResponse = await fetch(buildUrl('/api/tag-question'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: '1/2 + 1/4 = ?'
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        throw new Error(`AI endpoint hatası: ${aiResponse.status} - ${errorText}`);
      }

      const data = await aiResponse.json();
      setTestResult({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setTestResult({
        success: false,
        error: `AI Test Hatası: ${errorMessage}\n\n🔍 Sorun Giderme:\n1. Backend çalışıyor mu? (http://localhost:3001)\n2. Backend sunucusunu başlat (cd backend && node index.js)\n3. .env.local dosyasında HUGGINGFACE_API_KEY var mı?\n4. Supabase bağlantısı çalışıyor mu?`
      });
    } finally {
      setLoading(false);
    }
  };

  const testAdminDataEntry = async () => {
    setLoading(true);
    try {
      const response = await fetch(buildUrl('/api/admin/seed-data'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify({
          type: 'student',
          data: {
            student_number: 'TEST001',
            first_name: 'Test',
            last_name: 'Öğrenci',
            grade: 5,
            province: 'İstanbul',
            district: 'Test',
            school_type: 'ortaokul',
            school_name: 'Test Okulu'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Admin API hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setTestResult({
        success: false,
        error: `Admin Veri Girişi Hatası: ${errorMessage}\n\n🔍 Sorun Giderme:\n1. Backend çalışıyor mu?\n2. Supabase bağlantısı var mı?\n3. .env.local dosyasında SUPABASE_SERVICE_KEY var mı?`
      });
    } finally {
      setLoading(false);
    }
  };

  const testBulkImport = async () => {
    setLoading(true);
    try {
      const bulkData = {
        dataType: 'students',
        data: [
          {
            student_number: 'BULK001',
            first_name: 'Bulk',
            last_name: 'Test1',
            grade: 6,
            province: 'Ankara',
            district: 'Çankaya',
            school_type: 'ortaokul',
            school_name: 'Çankaya Ortaokulu'
          },
          {
            student_number: 'BULK002',
            first_name: 'Bulk',
            last_name: 'Test2',
            grade: 7,
            province: 'İzmir',
            district: 'Konak',
            school_type: 'ortaokul',
            school_name: 'Konak Ortaokulu'
          }
        ]
      };

      const response = await fetch(buildUrl('/api/admin/bulk-import'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bulk import hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setTestResult({
        success: false,
        error: `Toplu Veri Girişi Hatası: ${errorMessage}\n\n🔍 Sorun Giderme:\n1. Backend çalışıyor mu?\n2. Supabase bağlantısı var mı?\n3. JSON formatı doğru mu?\n4. Zorunlu alanlar dolu mu?`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Sayfası</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Ayarlar</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Backend Override (opsiyonel)</label>
              <input
                type="text"
                placeholder="https://elelem-ne-der-backend.vercel.app"
                value={backendOverride}
                onChange={(e) => setBackendOverride(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Boş bırakırsan `NEXT_PUBLIC_BACKEND_URL` kullanılır.</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Admin JWT (opsiyonel)</label>
              <input
                type="password"
                placeholder="Bearer token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Admin endpoint'leri için kullanılır.</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Backend Test</h2>
            <button
              onClick={testBackend}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : 'Backend API Test Et'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">AI Test</h2>
            <p className="text-sm text-gray-600 mb-4">
              Bu test backend'in AI fonksiyonlarını kontrol eder. Gerçek AI için GEMINI_API_KEY gerekli.
            </p>
            <button
              onClick={testAI}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : 'AI Servis Test Et'}
            </button>
          </div>
        </div>

        {/* Admin Data Entry Test */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Admin Veri Girişi Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            Bu test admin paneli üzerinden örnek öğrenci/öğretmen verisi ekler.
          </p>
          <p className="text-xs text-gray-500 mb-4">Gerekirse yukarıdan JWT gir; aksi durumda 401 alabilirsin.</p>
          <div className="flex space-x-4">
            <button
              onClick={testAdminDataEntry}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : 'Tekli Veri Girişi Test Et'}
            </button>
            <button
              onClick={testBulkImport}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Test ediliyor...' : 'Toplu Veri Girişi Test Et'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Test Sonucu</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
