'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function TeacherProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/teacher/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const m = (user as any).user_metadata || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Öğretmen Profili</h1>
            <div className="flex gap-3">
              <Link href="/teacher/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">← Dashboard</Link>
              <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Çıkış</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hesap Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">E-posta</div>
                <div className="text-gray-900 font-medium">{user.email}</div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Ad Soyad</div>
                  <div className="text-gray-900 font-medium">{m.full_name || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Branş</div>
                  <div className="text-gray-900 font-medium">{m.branch || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Okul</div>
                  <div className="text-gray-900 font-medium">{m.school || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Telefon</div>
                  <div className="text-gray-900 font-medium">{m.phone || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kısa Özet</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Rol: Öğretmen</li>
              <li>• Kayıt: {(user.created_at || '').slice(0, 10)}</li>
              <li>• ID: {user.id.slice(0, 8)}…</li>
            </ul>
            <div className="mt-6">
              <Link href="/teacher/create-assignment" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Yeni Ödev Oluştur</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


