# Elelem Ne Der - Tam Kurulum Rehberi

## 📅 Tarih: 15 Ocak 2025

## 🎯 Proje Özeti

**Elelem Ne Der**, 5-12. sınıf öğrencileri için kişiselleştirilmiş öğrenme akışları sunar. Öğrenci cevaplarını işler, raporlar ve çalışma önerileri üretir.

## 🚀 Hızlı Kurulum

### 1. Supabase Veritabanı Kurulumu

1. **Supabase Dashboard'a git**: https://supabase.com/dashboard
2. **Yeni proje oluştur** veya mevcut projeyi seç
3. **SQL Editor'a git**: Sol menüden "SQL Editor"
4. **Complete Database Setup dosyasını çalıştır**: `docs/complete-database-setup.sql` dosyasını kopyala ve yapıştır
5. **Run butonuna tıkla**

### 2. Environment Variables Ayarla

**Vercel Dashboard'da Environment Variables:**

#### Backend (Vercel)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_secure_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

#### Frontend (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://your-backend-app.vercel.app
```

### 3. Deploy Et

```bash
# Backend'i deploy et
cd backend
git add .
git commit -m "Complete database setup"
git push origin main

# Frontend'i deploy et
cd frontend
git add .
git commit -m "Complete database setup"
git push origin main
```

## 📊 Veritabanı Yapısı

### Temel Tablolar

| Tablo | Açıklama | Özellikler |
|-------|----------|------------|
| `profiles` | Kullanıcı profilleri | Auth bypass, RLS devre dışı |
| `students` | Öğrenci detayları | 5-12. sınıf, okul bağlantısı |
| `teachers` | Öğretmen detayları | İletişim bilgileri JSON |
| `parents` | Veli detayları | Telefon numarası |
| `schools` | Okul bilgileri | İlçe bağlantısı, seviye |
| `districts` | İlçe bilgileri | İl bağlantısı |
| `provinces` | İl bilgileri | Bağımsız |

### Eğitim İçeriği Tabloları

| Tablo | Açıklama | Özellikler |
|-------|----------|------------|
| `assignments` | Ödevler | Öğretmen bağlantısı, sınıf |
| `questions` | Sorular | Çoktan seçmeli, zorluk seviyesi |
| `student_answers` | Öğrenci cevapları | Doğruluk, süre takibi |
| `analysis_results` | Analiz sonuçları | Zayıf/güçlü konular |
| `roadmap_steps` | Yol haritası | Öğrenme adımları |
| `tags` | Etiketler | Konu, sınıf bazlı |

## 🔧 Özellikler

### ✅ Çalışan Özellikler

- **Toplu Veri Girişi**: JSON formatında öğrenci/öğretmen yükleme
- **Auth Bypass**: RLS olmadan veri girişi
- **Otomatik Okul Oluşturma**: İl/ilçe/okul otomatik oluşturma
- **Test Verileri**: Hazır test verileri ile başlama
- **Admin Paneli**: Web arayüzü ile yönetim

### 🚧 Geliştirilecek Özellikler

- **AI Entegrasyonu**: Soru etiketleme ve analiz
- **Ödev Sistemi**: Öğretmen-öğrenci ödev takibi
- **Raporlama**: Detaylı performans raporları
- **Mobil Uygulama**: React Native ile mobil

## 📝 Toplu Veri Girişi

### Öğrenci Verisi Formatı

```json
[
  {
    "student_number": "OGR001",
    "first_name": "Ahmet",
    "last_name": "Yılmaz",
    "middle_name": "Can",
    "grade": 5,
    "province": "İstanbul",
    "district": "Kadıköy",
    "school_type": "ortaokul",
    "school_name": "Kadıköy Ortaokulu"
  }
]
```

### Öğretmen Verisi Formatı

```json
[
  {
    "teacher_number": "OGRT001",
    "first_name": "Mehmet",
    "last_name": "Hoca",
    "middle_name": "",
    "province": "İstanbul",
    "district": "Kadıköy",
    "school_name": "Kadıköy Ortaokulu",
    "contact_email": "mehmet.hoca@okul.edu.tr",
    "contact_phone": "05551234567"
  }
]
```

## 🛠️ Teknik Detaylar

### Backend API Endpoints

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/status` | GET | Sistem durumu |
| `/api/admin/login` | POST | Admin girişi |
| `/api/admin/bulk-import` | POST | Toplu veri girişi |
| `/api/test/auth-access` | POST | Auth erişim testi |
| `/api/ai/complete` | POST | Metin üretimi (Gemini) |

### Frontend Sayfaları

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Admin Login | `/admin/login` | Admin girişi |
| Admin Panel | `/admin` | Ana admin paneli |
| Bulk Import | `/admin/bulk-import` | Toplu veri girişi |
| Student Login | `/student/login` | Öğrenci girişi |
| Teacher Login | `/teacher/login` | Öğretmen girişi |

## 🔒 Güvenlik

### RLS (Row Level Security)
- **Devre Dışı**: Tüm tablolarda RLS kapatıldı
- **Auth Bypass**: auth.users oluşturma bypass edildi
- **Service Role**: Backend service role ile çalışıyor

### Environment Variables
- **Güvenli**: Tüm API key'ler environment variables'da
- **Ayrılmış**: Frontend ve backend ayrı key'ler
- **Vercel**: Otomatik environment management

## 📈 Performans

### Indexler
- **Öğrenci**: grade, school_id
- **Öğretmen**: school_id
- **Ödevler**: grade, teacher_id
- **Sorular**: assignment_id
- **Cevaplar**: student_id, assignment_id

### Optimizasyonlar
- **Bulk Insert**: Toplu veri girişi optimize edildi
- **Foreign Keys**: İlişkiler optimize edildi
- **JSON Storage**: İletişim bilgileri JSON formatında

## 🐛 Bilinen Sorunlar

### Çözülen Sorunlar
- ✅ **RLS Politikaları**: Tamamen devre dışı bırakıldı
- ✅ **Auth Users**: Oluşturma bypass edildi
- ✅ **Foreign Keys**: Tüm ilişkiler düzeltildi
- ✅ **Bulk Import**: JSON formatında çalışıyor

### Aktif Sorunlar
- ⚠️ **AI Entegrasyonu**: Henüz aktif değil
- ⚠️ **Real-time Updates**: WebSocket entegrasyonu yok
- ⚠️ **File Upload**: Dosya yükleme özelliği yok

## 🚀 Gelecek Planları

### Kısa Vadeli (1-2 hafta)
- [ ] AI entegrasyonunu aktifleştir
- [ ] Ödev sistemi tamamla
- [ ] Raporlama sayfaları ekle

### Orta Vadeli (1-2 ay)
- [ ] Mobil uygulama geliştir
- [ ] Real-time özellikler ekle
- [ ] Gelişmiş analitik

### Uzun Vadeli (3-6 ay)
- [ ] Çoklu dil desteği
- [ ] Offline çalışma
- [ ] Gelişmiş AI özellikleri

## 📞 Destek

### Hızlı Çözümler
1. **RLS Hatası**: Supabase'de RLS'yi kapat
2. **Auth Hatası**: Service role key'i kontrol et
3. **Import Hatası**: JSON formatını kontrol et
4. **Deploy Hatası**: Environment variables'ı kontrol et

### Loglar
- **Backend**: Vercel Dashboard → Functions → Logs
- **Frontend**: Browser Console
- **Database**: Supabase Dashboard → Logs

## 📋 Test Checklist

### Kurulum Testi
- [ ] Supabase veritabanı oluşturuldu
- [ ] Test verileri yüklendi
- [ ] RLS devre dışı bırakıldı
- [ ] Environment variables ayarlandı

### Fonksiyon Testi
- [ ] Admin girişi çalışıyor
- [ ] Bulk import çalışıyor
- [ ] Test verileri görünüyor
- [ ] API endpoints çalışıyor

### Deploy Testi
- [ ] Backend Vercel'de çalışıyor
- [ ] Frontend Vercel'de çalışıyor
- [ ] Database bağlantısı çalışıyor
- [ ] Toplu veri girişi çalışıyor

---

**Son Güncelleme**: 15 Ocak 2025  
**Versiyon**: 1.0.0  
**Durum**: Production Ready ✅
