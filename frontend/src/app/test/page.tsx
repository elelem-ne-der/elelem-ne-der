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

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/assignments');
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
      const response = await fetch('http://localhost:3001/api/status');

      if (!response.ok) {
        throw new Error(`Backend çalışmıyor! Status: ${response.status}`);
      }

      // AI endpoint'ini test et
      const aiResponse = await fetch('http://localhost:3001/api/tag-question', {
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
      const response = await fetch('http://localhost:3001/api/admin/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Sayfası</h1>
        
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
              Bu test backend'in AI fonksiyonlarını kontrol eder. Gerçek AI için HUGGINGFACE_API_KEY gerekli.
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
          <button
            onClick={testAdminDataEntry}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Test ediliyor...' : 'Admin Veri Girişi Test Et'}
          </button>
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
