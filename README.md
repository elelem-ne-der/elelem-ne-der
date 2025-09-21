# Elelem Ne Der - AI Destekli Öğrenme Platformu

## Proje Hakkında

Elelem Ne Der, 5-12. sınıf öğrencileri için tasarlanmış AI destekli kişiselleştirilmiş öğrenme platformudur. Platform, öğrencilerin hatalarını analiz ederek kök nedenleri bulur ve kişiselleştirilmiş öğrenme yol haritaları oluşturur.

## Özellikler

### 🎯 Ana Özellikler
- **AI Destekli Soru Etiketleme**: Sorular otomatik olarak konu ve zorluk seviyesine göre etiketlenir
- **Akıllı Hata Analizi**: Öğrenci hatalarını analiz ederek temel eksiklikleri tespit eder
- **Kişiselleştirilmiş Yol Haritası**: Her öğrenci için özel öğrenme planı oluşturur
- **Çoklu Kullanıcı Desteği**: Öğrenci, Öğretmen ve Veli rolleri

### 👥 Kullanıcı Rolleri
- **Öğrenci**: Ödevleri çözer, ilerlemesini takip eder
- **Öğretmen**: Ödev oluşturur, öğrenci ilerlemesini izler
- **Veli**: Çocuğunun gelişimini takip eder

## Teknoloji Yığını

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Supabase Client** - Veritabanı bağlantısı

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Supabase** - PostgreSQL veritabanı ve auth
- **Hugging Face** - AI servisleri

### Deployment
- **Vercel** - Frontend ve Backend hosting

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı
- Hugging Face API anahtarı (opsiyonel)

### 1. Repository'yi klonlayın
```bash
git clone <repository-url>
cd elelem-ne-der
```

### 2. Backend Kurulumu
```bash
cd backend
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### 3. Frontend Kurulumu
```bash
cd frontend
npm install
cp env.local.example .env.local
# .env.local dosyasını düzenleyin
npm run dev
```

### 4. Supabase Kurulumu
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. `schema.sql` dosyasını SQL Editor'de çalıştırın
4. API anahtarlarını `.env` dosyalarına ekleyin

## API Endpoints

### Temel Endpoints
- `GET /api/assignments` - Ödev listesi
- `GET /api/questions/:assignmentId` - Soru listesi
- `POST /api/tag-question` - Soru etiketleme
- `POST /api/generate-questions` - Yeni soru üretimi
- `POST /api/analyze-results` - Hata analizi

### AI Endpoints
- `POST /api/tag-question` - Soru etiketleme
- `POST /api/generate-questions` - Soru üretimi
- `POST /api/analyze-results` - Sonuç analizi

## Proje Yapısı

```
elelem-ne-der/
├── frontend/              # Next.js uygulaması
│   ├── src/
│   │   ├── app/          # Sayfa bileşenleri
│   │   └── lib/          # Yardımcı fonksiyonlar
│   └── package.json
├── backend/               # Express.js API
│   ├── lib/              # AI ve veritabanı modülleri
│   ├── index.js          # Ana sunucu dosyası
│   └── package.json
├── shared/               # Ortak tip tanımları
└── docs/                 # Dokümantasyon
```

## Geliştirme

### Backend Geliştirme
```bash
cd backend
npm run dev
```

### Frontend Geliştirme
```bash
cd frontend
npm run dev
```

### Veritabanı Migrasyonları
Supabase SQL Editor'de `backend/supabase-schema.sql` dosyasını çalıştırın.

## Deployment

### Vercel ile Deployment
1. GitHub repository'sini Vercel'e bağlayın
2. Environment variables'ları ekleyin
3. Deploy edin

### Environment Variables
```env
# Backend
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
HUGGINGFACE_API_KEY=your_hf_key

# Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

- Proje Sahibi: Hayrettin
- UI/UX: Şevval
- E-posta: [e-posta adresi]

## Teşekkürler

- Supabase ekibine veritabanı ve auth servisleri için
- Hugging Face ekibine AI modelleri için
- Next.js ve React topluluğuna
