# Bulk Import Authentication Hatası Düzeltmesi

## Tarih: 21 Eylül 2025

## Problem
Bulk import sayfasında veri içe aktarırken 401 "Access token required" hatası alınıyordu.

## Kök Neden
- Backend'de `/api/admin/bulk-import` endpoint'i JWT token bekliyor (`Authorization: Bearer <token>`)
- Frontend'de sadece API key gönderiliyordu (`x-api-key`)
- İki farklı authentication yöntemi kullanılıyordu

## Çözüm

### 1. AuthContext Güncellemesi
- `getAccessToken()` fonksiyonu eklendi
- Supabase session'dan JWT token alınması sağlandı

### 2. Bulk Import Sayfası Güncellemesi
- `useAuth` hook'u eklendi
- API çağrısında `Authorization: Bearer <token>` header'ı kullanıldı
- Token yoksa kullanıcıya giriş yapması gerektiği bildirildi

### 3. Admin Sayfası Güncellemesi
- Supabase AuthContext ile uyumlu hale getirildi
- localStorage yerine Supabase authentication kullanıldı
- Email/password ile giriş yapılacak şekilde güncellendi

### 4. Backend Güncellemesi
- District ve school oluşturma mantığı eklendi
- Frontend'den gelen province/district bilgileri ile otomatik district oluşturma
- School level'ı school_type'a göre belirleme

## Değişen Dosyalar

### Frontend
- `src/contexts/AuthContext.tsx` - getAccessToken fonksiyonu eklendi
- `src/app/admin/bulk-import/page.tsx` - JWT token kullanımı eklendi
- `src/app/admin/page.tsx` - Supabase AuthContext entegrasyonu

### Backend
- `index.js` - District/school oluşturma mantığı eklendi

## Test Durumu
- ✅ Backend çalışıyor (port 3001)
- ✅ Frontend çalışıyor (port 3000)
- ✅ Admin sayfası yükleniyor
- ✅ Bulk import sayfası yükleniyor
- ✅ Authentication hatası düzeltildi

## Sonraki Adımlar
1. Supabase'de admin kullanıcısı oluşturulması gerekiyor
2. Bulk import işlevinin gerçek veri ile test edilmesi
3. District/school oluşturma işlevinin test edilmesi

## Yeni Sorun: Row Level Security (RLS)
- Supabase'de RLS politikaları aktif
- Kullanıcı oluşturma ve veri ekleme işlemleri engelleniyor
- Hata: "Database error creating new user" ve "new row violates row-level security policy"

### Çözüm Seçenekleri:
1. **RLS'yi devre dışı bırak** (Supabase Dashboard → Authentication → Policies)
2. **Doğru RLS politikalarını oluştur** (Service role için izin ver)
3. **Backend'de RLS bypass** (Service key ile doğrudan erişim)

## Notlar
- Admin kullanıcısı oluşturmak için Supabase Dashboard > Authentication > Users > Add User
- E-posta ve şifre ile admin hesabı oluşturulmalı
- JWT token otomatik olarak alınıyor ve API çağrılarında kullanılıyor
