'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setShowLogin(true);
    setLoginData({ username: '', password: '' });
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Girişi</h1>
            <p className="text-gray-600">Yönetim paneline erişim için giriş yapın</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Varsayılan giriş bilgileri:</p>
            <p><strong>Kullanıcı:</strong> admin</p>
            <p><strong>Şifre:</strong> admin123</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Çıkış Yap
              </button>
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                ← Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Veri Yönetimi</h2>
          <p className="text-gray-600">Öğrenci ve öğretmen verilerini yönetin</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Data Entry */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tekli Veri Girişi</h3>
            <p className="text-gray-600 mb-6">
              Formlar ile tek tek öğrenci veya öğretmen ekleyin
            </p>
            <Link
              href="/admin/data-entry"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition text-center block"
            >
              Veri Girişi Paneli
            </Link>
          </div>

          {/* Bulk Import */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Toplu Veri İçe Aktarma</h3>
            <p className="text-gray-600 mb-6">
              JSON formatında çoklu öğrenci/öğretmen verisi yükleyin
            </p>
            <Link
              href="/admin/bulk-import"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition text-center block"
            >
              Toplu İçe Aktarma
            </Link>
          </div>

          {/* Database Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">🗄️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Veritabanı Yönetimi</h3>
            <p className="text-gray-600 mb-6">
              Supabase veritabanını doğrudan yönetin
            </p>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition text-center block"
            >
              Supabase Dashboard
            </a>
          </div>

          {/* Test Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">API Test Paneli</h3>
            <p className="text-gray-600 mb-6">
              Tüm API endpointlerini test edin
            </p>
            <Link
              href="/test"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition text-center block"
            >
              Test Sayfası
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Hızlı İstatistikler</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">100+</div>
              <div className="text-gray-600">Toplam Kayıt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-gray-600">Öğrenci</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">20+</div>
              <div className="text-gray-600">Öğretmen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">30+</div>
              <div className="text-gray-600">Veli</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
