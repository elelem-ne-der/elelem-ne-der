import Link from &#39;next/link&#39;;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Elelem Ne Der
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI destekli kişiselleştirilmiş öğrenme platformu
          </p>
          
          <div className="mb-12">
            <a
              href="/test"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              🔧 Test Sayfası
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍🎓</div>
              <h3 className="text-2xl font-semibold mb-4">Öğrenci</h3>
              <p className="text-gray-600 mb-6">
                Ödevlerini çöz, hatalarını öğren, kişisel yol haritanı takip et
              </p>
              <Link 
                href="/student/login" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Öğrenci Girişi
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-semibold mb-4">Öğretmen</h3>
              <p className="text-gray-600 mb-6">
                Ödev oluştur, öğrenci ilerlemesini takip et, raporları incele
              </p>
              <Link 
                href="/teacher/login" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Öğretmen Girişi
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-semibold mb-4">Veli</h3>
              <p className="text-gray-600 mb-6">
                Çocuğunun gelişimini takip et, detaylı raporları görüntüle
              </p>
              <Link 
                href="/parent/login" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Veli Girişi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}