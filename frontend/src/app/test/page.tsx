&#39;use client&#39;;

import { useState } from &#39;react&#39;;
import Link from &#39;next/link&#39;;

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
      const response = await fetch(&#39;http://localhost:3001/api/assignments&#39;);
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : &#39;Bilinmeyen hata&#39; });
    } finally {
      setLoading(false);
    }
  };

  const testAI = async () => {
    setLoading(true);
    try {
      const response = await fetch(&#39;http://localhost:3001/api/tag-question&#39;, {
        method: &#39;POST&#39;,
        headers: {
          &#39;Content-Type&#39;: &#39;application/json&#39;,
        },
        body: JSON.stringify({
          question: &#39;1/2 + 1/4 = ?&#39;
        }),
      });
      const data = await response.json();
      setTestResult({ success: true, data });
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : &#39;Bilinmeyen hata&#39; });
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
              {loading ? &#39;Test ediliyor...&#39; : &#39;Backend API Test Et&#39;}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AI Test</h2>
            <button
              onClick={testAI}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? &#39;Test ediliyor...&#39; : &#39;AI Servis Test Et&#39;}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Test Sonucu</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
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
