# 2025-09-22 Elelem Ne Der - Uygulama Günlüğü

- Yapılan: Backend `teachers.contact_info` artık JSON array olarak kaydediliyor (string değil).
- Yapılan: Öğretmen numarası için prefix `OGRT` olarak belirlendi. UI placeholder ve örnek JSON güncellendi.
- Yapılan: `docs/20250115-complete-setup-guide.md` içindeki öğretmen örneği `OGRT001` olacak şekilde güncellendi.

Notlar:
- Hata kökü: Supabase kolon tipi JSON/JSONB iken string gönderilmesi, bazı sorgularda “cannot get array length of a scalar” hatasına yol açıyordu.
- Toplu içe aktarmada öğretmen verilerinde `teacher_number` artık `OGRT###` kullanılmalı.
