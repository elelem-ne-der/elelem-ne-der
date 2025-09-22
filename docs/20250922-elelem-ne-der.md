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

# 2025-09-22 Elelem Ne Der - Uygulama Günlüğü

- Yapılan: Backend `teachers.contact_info` artık JSON array olarak kaydediliyor (string değil).
- Yapılan: Öğretmen numarası için prefix `OGRT` olarak belirlendi. UI placeholder ve örnek JSON güncellendi.
- Yapılan: `docs/20250115-complete-setup-guide.md` içindeki öğretmen örneği `OGRT001` olacak şekilde güncellendi.

Notlar:
- Hata kökü: Supabase kolon tipi JSON/JSONB iken string gönderilmesi, bazı sorgularda “cannot get array length of a scalar” hatasına yol açıyordu.
- Toplu içe aktarmada öğretmen verilerinde `teacher_number` artık `OGRT###` kullanılmalı.
