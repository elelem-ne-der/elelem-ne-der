# Elelem Ne Der - AI Destekli Eğitim Platformu

## 📋 Proje Genel Bakış

**Elelem Ne Der**, 5-12. sınıf Türk öğrencileri için tasarlanmış yapay zeka destekli kişiselleştirilmiş öğrenme platformudur. Platform, öğrencilerin hatalarını analiz ederek kök nedenleri bulur ve özel öğrenme yol haritaları oluşturur.

### 🎯 Temel Özellikler

- **AI Destekli Soru Etiketleme**: Sorular otomatik olarak konu ve zorluk seviyesine göre etiketlenir
- **Akıllı Hata Analizi**: Öğrenci hatalarını analiz ederek temel eksiklikleri tespit eder
- **Kişiselleştirilmiş Yol Haritası**: Her öğrenci için özel öğrenme planı oluşturur
- **Çoklu Kullanıcı Desteği**: Öğrenci, Öğretmen ve Veli rolleri

### 👥 Kullanıcı Rolleri

| Rol | Yetkiler | Özellikler |
|-----|----------|------------|
| **Öğrenci** | Ödev çözme, ilerleme takibi | Kişisel dashboard, AI analiz sonuçları |
| **Öğretmen** | Ödev oluşturma, öğrenci takibi | Sınıf yönetimi, rapor görüntüleme |
| **Veli** | Çocuk takibi | Performans raporları, gelişim takibi |

## 🛠️ Teknoloji Yığını

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Supabase Client** - Veritabanı bağlantısı

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Supabase** - Database & Auth
- **Hugging Face** - AI servisleri (ücretsiz)

### Database & Auth
- **Supabase** (PostgreSQL) - Veritabanı
- **Supabase Auth** - Kullanıcı yönetimi
- **Row Level Security** - Güvenlik

### Deployment
- **Vercel** - Hosting platformu
- **GitHub** - Version control

## 🗄️ Veritabanı Yapısı

### Temel Tablolar

#### Kullanıcı Yönetimi
- `profiles` - Kullanıcı profilleri (auth.users ile bağlantılı)
- `students` - Öğrenci detayları
- `teachers` - Öğretmen detayları
- `parents` - Veli detayları

#### Eğitim İçeriği
- `assignments` - Ödevler
- `questions` - Sorular
- `student_answers` - Öğrenci cevapları
- `analysis_results` - AI analiz sonuçları

#### Sistem Tabloları
- `provinces` - İller
- `districts` - İlçeler
- `schools` - Okullar
- `tags` - Etiketler
- `roadmap_steps` - Yol haritası adımları

### 🔐 Güvenlik Kuralları

#### Row Level Security (RLS) Politikaları
Platform, Supabase'in Row Level Security özelliğini aktif olarak kullanır:

- **Tüm tablolar RLS ile korunuyor**: Her tablo için uygun SELECT, INSERT, UPDATE politikaları tanımlı
- **Role-based erişim**: Kullanıcı rolleri (student, teacher, parent) bazında farklı erişim kuralları
- **Automatic filtering**: Kullanıcılar sadece kendi verilerine erişebiliyor
- **Secure functions**: Database fonksiyonları search_path ile korunuyor

#### Öğrenci Kısıtlamaları
- Her öğrencinin **unique numarası** olmak zorunda
- İsim ve soy isim **zorunlu**, orta isim **isteğe bağlı**
- Sınıf bilgisi **5-12 arasında** olmak zorunda
- Her öğrencinin **maksimum 1 velisi** olabilir (trigger ile kontrol)

#### Öğretmen Kısıtlamaları
- Her öğretmenin **unique numarası** olmak zorunda
- İsim, soy isim, okul bilgisi **zorunlu**
- En az **1 adet mail/telefon** bilgisi olmak zorunda
- Sadece kendi öğrencilerinin bilgilerini görebilir
- Kendi ödevlerini oluşturup yönetebilir

#### Veli Kısıtlamaları
- En az **1 öğrencisi** olmak zorunda
- Sadece kendi çocuğunun bilgilerini görebilir
- Kendi öğrencisinin öğretmen bilgilerini görebilir
- Çocuğunun analiz sonuçlarını ve yol haritasını takip edebilir

#### Güvenlik Özellikleri
- **JWT Authentication**: Supabase Auth ile güvenli oturum yönetimi
- **Service Role**: Admin işlemleri için service key kullanılıyor
- **Input Validation**: Frontend ve backend'de veri doğrulama
- **SQL Injection Protection**: Parametrized queries kullanılıyor

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
```bash
# Node.js ve npm kurulu olmalı
node --version  # >= 18.0.0
npm --version   # >= 9.0.0
```

### 2. Proje Kurulumu
```bash
# Ana klasör
cd /Users/hayrettin/Desktop/hayrettin/elelem-ne-der

# Backend kurulumu
cd backend
npm install

# Frontend kurulumu
cd ../frontend
npm install
```

### 3. Environment Dosyaları
```bash
# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
HUGGINGFACE_API_KEY=your_huggingface_key

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Kurulumu
1. [Supabase](https://supabase.com) hesabınızı oluşturun
2. Yeni proje oluşturun
3. `schema.sql` dosyasını SQL Editor'de çalıştırın
4. API anahtarlarını environment dosyalarına ekleyin

### 5. Geliştirme Ortamı
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📊 API Endpoints

### Temel Endpoints
- `GET /api/assignments` - Ödev listesi
- `GET /api/questions/:assignmentId` - Soru listesi
- `GET /api/status` - Sistem durumu

### AI Endpoints
- `POST /api/tag-question` - Soru etiketleme
- `POST /api/generate-questions` - Soru üretme
- `POST /api/analyze-results` - Hata analizi

### Admin Endpoints
- `POST /api/admin/seed-data` - Tekli veri girişi
- `POST /api/admin/bulk-import` - Toplu veri import

## 🎨 Kullanıcı Arayüzü

### Ana Sayfalar
- `/` - Ana sayfa (giriş seçenekleri)
- `/student/login` - Öğrenci girişi
- `/teacher/login` - Öğretmen girişi
- `/parent/login` - Veli girişi

### Dashboard'lar
- `/student/dashboard` - Öğrenci dashboard'u
- `/teacher/dashboard` - Öğretmen dashboard'u
- `/parent/dashboard` - Veli dashboard'u

### Özel Sayfalar
- `/admin` - Admin paneli
- `/test` - API test sayfası
- `/student/assignment/[id]` - Ödev çözme

## 🔧 Geliştirme Notları

### Ücretsiz Servisler
- **Supabase** - Database & Auth (ücretsiz katman)
- **Hugging Face** - AI servisleri (ücretsiz API)
- **Vercel** - Deployment (ücretsiz katman)

### Yapay Zeka Entegrasyonu
- Soru etiketleme için Hugging Face transformers
- Hata analizi için metin işleme modelleri
- Kişiselleştirilmiş öneri sistemi

### Güvenlik
- Row Level Security (RLS) aktif
- JWT token tabanlı authentication
- Role-based access control
- Input validation ve sanitization

## 📈 Proje Durumu

### ✅ Tamamlanan Özellikler
- [x] Proje yapısı kurulumu
- [x] Supabase entegrasyonu
- [x] Auth sistemi (email + password)
- [x] Kullanıcı rolleri
- [x] Temel dashboard'lar
- [x] Ödev oluşturma ve çözme
- [x] AI servis entegrasyonu
- [x] Schema ve veritabanı tasarımı

### 🚧 Geliştirme Aşamasında
- [ ] AI analiz algoritmaları
- [ ] Detaylı raporlama
- [ ] Mobil uyumluluk
- [ ] Performans optimizasyonu

### 📋 Yaklaşan Özellikler
- [ ] İleri seviye AI entegrasyonu
- [ ] Gerçek dataset import
- [ ] Gelişmiş analitikler
- [ ] Notification sistemi

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 📞 İletişim

- **Proje Sahibi:** Hayrettin, Şevval
- **Teknoloji:** Next.js, Supabase, Express.js

---

**Son Güncelleme:** 21 Eylül 2025
**Versiyon:** 1.1.0
