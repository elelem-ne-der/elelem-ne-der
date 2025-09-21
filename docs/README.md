# Elelem Ne Der - AI Destekli Eğitim Platformu

## 📋 Proje Hakkında

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

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Supabase** - Database & Auth

### AI & Deployment
- **Hugging Face** - AI servisleri (ücretsiz)
- **Vercel** - Hosting platformu

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- Supabase hesabı

### 1. Kurulum
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Supabase Kurulumu
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. `schema.sql` dosyasını SQL Editor'de çalıştırın
4. API anahtarlarını environment dosyalarına ekleyin

### 3. Çalıştırma
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**🎯 Production URL'lerinizden uygulamaya erişin.**

### 4. Vercel'e Deploy

#### Frontend Deploy
1. [Vercel Dashboard](https://vercel.com) hesabınıza giriş yapın
2. **New Project** → **Import Git Repository**
3. Repository'yi seçin ve **Import** edin
4. **Project Settings** → **Environment Variables** kısmında:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_API_KEY`
   - `NEXT_PUBLIC_API_URL` (Backend URL'iniz)

#### Backend Deploy
1. Backend klasörüne gidin: `cd backend`
2. [Vercel CLI](https://vercel.com/cli) yükleyin: `npm i -g vercel`
3. Login yapın: `vercel login`
4. Deploy edin: `vercel --prod`
5. Environment Variables ekleyin:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

**🌐 Production URL'lerinizden uygulamaya erişin.**

## 📊 API Endpoints

### Temel Endpoints
- `GET /api/assignments` - Ödev listesi
- `GET /api/questions/:assignmentId` - Soru listesi
- `GET /api/status` - Sistem durumu

### AI Endpoints
- `POST /api/tag-question` - Soru etiketleme
- `POST /api/generate-questions` - Soru üretimi
- `POST /api/analyze-results` - Hata analizi

## 📁 Proje Yapısı

```
elelem-ne-der/
├── frontend/          # Next.js uygulaması
├── backend/           # Express.js API
├── schema.sql         # Veritabanı şeması
└── project-documentation.md  # Detaylı dokümantasyon
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 📞 İletişim

- **Proje Sahibi:** Hayrettin
- **UI/UX:** Şevval

---

**🚀 Proje hazır! Detaylar için [project-documentation.md](project-documentation.md) dosyasına bakın.**
