'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Supabase ile giriş yap
      await signIn(loginData.email, loginData.password);
      setShowLogin(false);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogin(true);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
                E-posta
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
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
            <p>Admin hesabı oluşturmak için:</p>
            <p>1. Supabase Dashboard'a gidin</p>
            <p>2. Authentication &gt; Users &gt; Add User</p>
            <p>3. E-posta ve şifre ile admin hesabı oluşturun</p>
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
