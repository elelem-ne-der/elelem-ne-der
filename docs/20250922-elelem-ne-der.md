## 2025-09-22 — Gemini AI Entegrasyonu (Ücretsiz Kota ile)

### Yapılanlar
- Backend'e `@google/generative-ai` eklendi ve `backend/lib/gemini.js` oluşturuldu.
- `index.js` içine `/api/ai/complete` endpoint'i eklendi (Gemini tabanlı).
- `backend/env.example` içine `GEMINI_API_KEY` ve `GEMINI_MODEL` eklendi.

### Nasıl Çalıştırılır
1) Google Gemini API anahtarını alın (ai.google.dev) ve backend `.env` dosyasına ekleyin:
```
GEMINI_API_KEY=...your key...
GEMINI_MODEL=gemini-1.5-flash
```
2) Bağımlılığı kurun ve backend'i başlatın:
```
cd backend
npm i
npm run dev
```
3) Test (curl):
```
curl -X POST http://localhost:3001/api/ai/complete \
  -H "Content-Type: application/json" \
  -d '{"prompt":"5. sınıf kesirler konusunda 2 soru üret"}'
```

### Notlar
- Ücretsiz kota ile çalışır; kota dolarsa istekler hata dönebilir.
- Production dağıtımında Vercel ortam değişkenlerine `GEMINI_API_KEY` eklenmelidir.

# 2025-09-22 — Yapay Zeka Özelliklerinin Kullanımı (UI Rehberleri)

Bu güncelleme ile panellere "Nasıl kullanılır?" blokları eklendi. Kod/endpoint bilmeden kullanabilirsiniz.

- Öğretmen Paneli (`/teacher/dashboard`):
  - "Yeni Ödev Oluştur" ile sınıf/ders/konu ve soru sayısını girin.
  - AI, soru setini oluşturur; çözümlerden sonra zayıf/kuvvetli konu özetleri dashboard'da görünür.

- Yeni Ödev Sayfası (`/teacher/create-assignment`):
  - Form üstünde AI bilgilendirme kutusu gösterilir.
  - Ödev hedefi seçimi: Tüm sınıf, Şube (örn: 8-A) veya Seçili Öğrenciler.
  - Seçili öğrencileri e-posta veya okul numarasıyla virgül/satır ayırarak girin.

- Öğrenci Paneli (`/student/dashboard`):
  - Üstte kullanım rehberi; "Ödevlere Git" ile atanmış ödevler listesine atlar.

- Ödev Çözme (`/student/assignment/[id]`):
  - Üstte AI yardım kutusu; teslimden sonra analiz sonuçları (zayıf/kuvvetli konular + öneriler) görünür.

- Veli Paneli (`/parent/dashboard`):
  - AI analizi ile özet ve "Detaylı Raporlar" bağlantısı gösterilir.

- Admin Paneli (`/admin`):
  - AI akışı özetlenir; test için "API Test Paneli" bağlantısı bulunur.

Not: Üretim ve yerelde AI'nın çalışması için backend'in ve `GEMINI_API_KEY`'in aktif olması gerekir. Frontend proxy ile istekler `/api/backend/...` üzerinden yönlendirilir.

### Öğretmen Girişi (Supabase) Sorun Giderme

Giriş olmuyorsa aşağıdakileri kontrol edin:

1) Frontend ortam değişkenleri (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=...your supabase url...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your supabase anon key...
```
Kaydedip frontend'i yeniden başlatın.

2) Supabase Auth kullanıcı kaydı: Supabase Dashboard → Authentication → Users içinde öğretmen e-postası görünüyor olmalı.

3) Mail onayı açık ise: Kullanıcının mail onayını tamamlayın ya da Supabase'de "Confirm user" yapın.

4) Hâlâ olmuyorsa: Tarayıcı Konsolu'ndaki hata mesajını bize iletin (uygulama artık eksik konfigurasyonda kırmızı uyarı gösterir).

# 2025-09-22 Elelem Ne Der - Uygulama Günlüğü

- Yapılan: Backend `teachers.contact_info` artık JSON array olarak kaydediliyor (string değil).
- Yapılan: Öğretmen numarası için prefix `OGRT` olarak belirlendi. UI placeholder ve örnek JSON güncellendi.
- Yapılan: `docs/20250115-complete-setup-guide.md` içindeki öğretmen örneği `OGRT001` olacak şekilde güncellendi.

- Yapılan: 9. sınıf müfredat veri modeli tasarımı (grade/subject/unit/topic) belirlendi.
- Yapılan: `docs/complete-database-setup.sql` içine müfredat tabloları (`grade_levels`, `subjects`, `units`, `topics`) eklendi ve RLS devre dışı bırakıldı.
- Yapılan: `docs/curriculum/grade-9.json` oluşturuldu; 9. sınıf tüm ders/ünite/konu listesi işlendi.
- Yapılan: `backend/scripts/import-curriculum.js` eklendi; JSON'dan Supabase'e içe aktarım script'i.
- Not: `backend/lib/supabase.js` mevcut ortam değişkenlerini (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) kullanır. Script çalıştırmadan önce `.env` ayarlanmalı.

Çalıştırma adımları:
1) Supabase SQL Editor'de `docs/complete-database-setup.sql` dosyasını çalıştırın (müfredat tabloları dahil).
2) Backend `.env` dosyasına `SUPABASE_URL` ve `SUPABASE_SERVICE_KEY` ekleyin.
3) `cd backend && npm i` (gerekirse) ve `node scripts/import-curriculum.js` komutunu çalıştırın.
4) İçeri aktarılanları doğrulamak için tabloları kontrol edin: `grade_levels`, `subjects`, `units`, `topics`.

Notlar:
- Hata kökü: Supabase kolon tipi JSON/JSONB iken string gönderilmesi, bazı sorgularda “cannot get array length of a scalar” hatasına yol açıyordu.
- Toplu içe aktarmada öğretmen verilerinde `teacher_number` artık `OGRT###` kullanılmalı.

## 2025-09-22 — Tarayıcıdan AI Çağrıları (Terminalsiz)

### Yapılanlar
- Frontend'e bir proxy route eklendi: `frontend/src/app/api/backend/[...path]/route.ts`.
- `frontend/src/app/test/page.tsx` güncellenerek doğrudan `http://localhost:3001` yerine `/api/backend/...` kullanıldı.

### Nasıl Kullanılır
1) Frontend ortam değişkenine backend adresini ekleyin:
```
frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```
2) Frontend'i çalıştırın ve tarayıcıdan `/test` sayfasını açın. Butonlar artık proxy üzerinden backend'e gider; terminal komutu girmeden tarayıcıdan test edebilirsiniz.

### Notlar
- Proxy tüm HTTP metodlarını iletir ve `Content-Type: application/json` gövdesini otomatik taşır.
- Production'da `NEXT_PUBLIC_BACKEND_URL` Vercel ortam değişkenlerine eklenmelidir.

## Genişletilmiş AI Analizi

`/api/analyze-results` yanıtı genişletildi:

- `rootCauses`: Kök neden listesi.
  - `cause`: Metinsel açıklama (örn: "payda eşitleme eksikliği").
  - `frequency`: Kaç soruda tekrarlandığı.
  - `examples`: Örnek soru referansları (`questionId`, `tags`).
- `subtopicBreakdown`: Alt konu bazında performans.
  - Anahtar: alt konu adı (örn: "kesir toplama - payda eşitleme").
  - Değer: `{ correct, total, rate }` (yüzde).

Örnek yanıt:
```
{
  "overallScore": 72.5,
  "weakTopics": ["kesirler", "çıkarma"],
  "strongTopics": ["toplama"],
  "recommendations": ["kesirler, çıkarma konularını tekrar etmelisin"],
  "roadmap": [ { "title": "kesirler konusunu tekrar et", ... } ],
  "rootCauses": [
    { "cause": "payda eşitleme eksikliği", "frequency": 2, "examples": [{"questionId":1,"tags":["kesirler","toplama"]}] },
    { "cause": "işlem hatası (çıkarma)", "frequency": 1, "examples": [{"questionId":2,"tags":["kesirler","çıkarma"]}] }
  ],
  "subtopicBreakdown": {
    "kesir toplama - payda eşitleme": { "correct": 1, "total": 2, "rate": 50 },
    "kesir çıkarma - payda eşitleme": { "correct": 0, "total": 1, "rate": 0 }
  }
}
```

## Quick Wins (Bugün Eklendi)

- Öğrenci Sonuçları: "Zayıf Konu İçin Hızlı Tekrar" butonu eklendi. İlk zayıf konu için 3 soru anında üretilip ekranda gösterilir.
- Öğretmen Dashboard: Sınıf ve ders filtreleri eklendi; ödev kartları filtrelenebilir.
