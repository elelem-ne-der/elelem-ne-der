import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              ← Ana Sayfa
            </Link>
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
