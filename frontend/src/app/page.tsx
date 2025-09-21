import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen animated-bg relative">
      <div className="bg-icons" aria-hidden>
        <i className="fa-solid fa-book-open bg-icon i1" aria-hidden></i>
        <i className="fa-solid fa-bookmark bg-icon i2" aria-hidden></i>
        <i className="fa-brands fa-react bg-icon i3" aria-hidden></i>
        <i className="fa-solid fa-dna bg-icon i4" aria-hidden></i>
        <i className="fa-solid fa-microscope bg-icon i5" aria-hidden></i>
        <i className="fa-solid fa-superscript bg-icon i6" aria-hidden></i>
        <i className="fa-solid fa-square-root-variable bg-icon i7" aria-hidden></i>
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Elelem Ne Der
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI destekli kişiselleştirilmiş öğrenme platformu
          </p>
          
          <div className="mb-12 flex space-x-4 justify-center">
            <a
              href="/test"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              🔧 Test Sayfası
            </a>
            <a
              href="/admin"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              ⚙️ Admin Paneli
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍🎓</div>
              <h3 className="text-2xl font-semibold mb-4 card-title-student">Öğrenci</h3>
              <p className="text-gray-600 mb-6">
                Ödevlerini çöz, hatalarını öğren, kişisel yol haritanı takip et
              </p>
              <div className="space-y-3">
                <Link
                  href="/student/login"
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center"
                >
                  Öğrenci Girişi
                </Link>
                <Link
                  href="/student/register"
                  className="block w-full bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition text-center"
                >
                  Yeni Öğrenci Kaydı
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-2xl font-semibold mb-4 card-title-teacher">Öğretmen</h3>
              <p className="text-gray-600 mb-6">
                Ödev oluştur, öğrenci ilerlemesini takip et, raporları incele
              </p>
              <div className="space-y-3">
                <Link
                  href="/teacher/login"
                  className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-center"
                >
                  Öğretmen Girişi
                </Link>
                <Link
                  href="/teacher/register"
                  className="block w-full bg-white border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition text-center"
                >
                  Yeni Öğretmen Kaydı
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-semibold mb-4 card-title-parent">Veli</h3>
              <p className="text-gray-600 mb-6">
                Çocuğunun gelişimini takip et, detaylı raporları görüntüle
              </p>
              <div className="space-y-3">
                <Link
                  href="/parent/login"
                  className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
                >
                  Veli Girişi
                </Link>
                <Link
                  href="/parent/register"
                  className="block w-full bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition text-center"
                >
                  Yeni Veli Kaydı
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}