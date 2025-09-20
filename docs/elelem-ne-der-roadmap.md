
## Seçilen Teknoloji Yığını (Tech Stack)

- **Frontend:** **Next.js** (React framework'ü)
- **Backend:** **Express.js** (Node.js ile çalışan JavaScript API framework'ü)
- **Veritabanı & Auth:** **Supabase** (PostgreSQL veritabanı ve hazır kullanıcı yönetimi)
- **Deployment:** **Vercel** (Hem Frontend hem de Backend API için tek platform)

Bu yapı, Vercel'in "monorepo" yaklaşımıyla mükemmel çalışır. Tek bir GitHub deposu içinde hem Next.js projeniz hem de `/api` klasörü altında Express.js backend'iniz yaşayacak ve Vercel ikisini de akıllıca deploy edecektir.

---

## Güncellenmiş Hackathon Yol Haritası

### Gün 0: Planlama ve Kurulum (Bugün, 17 Eylül Akşamı)

**Amaç:** Yarın sabah tek bir komutla (`npm run dev`) geliştirme ortamını başlatacak kadar hazır olmak.

- **Ortak Görevler (1-2 saat):**
    1. **Supabase Projesini Oluşturma:**
        - `supabase.com`'a gidin ve yeni bir proje oluşturun.
        - **API Anahtarlarını Kaydedin:** Proje ayarlarından **Project URL** ve **anon public** anahtarını güvenli bir yere not alın. Bunlar Next.js tarafında kullanılacak. **service_role** anahtarı ise backend için gerekecek.
        - **Veritabanı Tablolarını Oluşturma:** Supabase arayüzündeki "Table Editor"e gidin. SQL Editor'ü kullanarak daha önce tasarladığınız tabloları oluşturun. Supabase, kullanıcılarınız için `auth.users` adında bir tabloyu zaten oluşturur. Diğer tabloları buna bağlayabilirsiniz.
    2. **Yapay Zeka Prompt'ları:** Bu adım değişmedi, hâlâ projenin kalbi. Prompt'larınızı bir metin dosyasında hazır edin.
- **Senin Görevin (Backend & Altyapı):**
    1. **Geliştirme Ortamı:** Bilgisayarında **Node.js** ve **npm**'in en güncel LTS versiyonunun kurulu olduğundan emin ol.    
    2. **Next.js Projesini Başlatma:** Terminalde `npx create-next-app@latest elelem-projesi` komutunu çalıştırarak projeyi başlat. (TypeScript kullanmak isteyip istemediğini soracaktır, basitlik için şimdilik "No" diyebilirsiniz).
    3. **Gerekli Kütüphaneleri Kurma:** Proje klasörüne girip (`cd elelem-projesi`) şu komutları çalıştır:
	    - Backend için: `npm install express cors`
        - Supabase ve AI için: `npm install @supabase/supabase-js openai`
    4. **API Klasör Yapısı:** Projenin ana dizininde `api` adında bir klasör oluştur. İçine `index.js` adında bir dosya oluştur. Bu dosya, Express.js sunucunun başlangıç noktası olacak.
    5. **GitHub & .gitignore:** GitHub deposunu oluştur. `.gitignore` dosyasına `node_modules` ve özellikle `.env.local` dosyalarını eklediğinden emin ol.
    6. **Environment Variables:** Projenin ana dizininde `.env.local` adında bir dosya oluştur. Supabase ve OpenAI anahtarlarını buraya ekle. Bu dosya asla GitHub'a gönderilmemelidir.

   ```
        NEXT_PUBLIC_SUPABASE_URL=...
        NEXT_PUBLIC_SUPABASE_ANON_KEY=...
        SUPABASE_SERVICE_KEY=...
        OPENAI_API_KEY=...
	```


- **Şevval'in Görevi (Frontend & UI):**
    
    1. **UI Kütüphanesi Ekleme:** Hız kazanmak için bir component kütüphanesi seçin.
        - **Öneri:** **Chakra UI** veya **Mantine**. Her ikisi de hızlı prototipleme için harika, hazır bileşenler sunar. `npm install @chakra-ui/react ...` komutlarıyla kurulumunu yap.
    2. **Sayfa Dosyalarını Oluşturma:** Next.js'in `app` (veya `pages`) klasörü altında, daha önce kağıda çizdiğiniz her ekran için bir klasör ve `page.js` dosyası oluşturun (örn: `/app/dashboard/page.js`, `/app/login/page.js`).
    3. **Genel Layout Oluşturma:** Her sayfada görünecek olan navigasyon çubuğu, kenar çubuğu gibi sabit bileşenleri içeren bir `layout.js` dosyası oluştur.

---

### Gün 1: İskelet ve Veri Akışı (18 Eylül, Perşembe)

**Amaç:** Kullanıcıların Supabase ile giriş yapabildiği, backend API'den sahte verileri çekip gösterebildiği bir arayüz oluşturmak.

- **Senin Görevin (Backend API):**
    1. **Express API Sunucusunu Yazma:** `api/index.js` dosyasında temel bir Express sunucusu kur. Supabase bağlantısını `service_role` anahtarı ile yap.
    2. **Sahte API Endpoint'leri:** Frontend'in ihtiyaç duyacağı API rotalarını oluştur ama içlerini sahte, sabit verilerle doldur.
        - `GET /api/assignments`: Hardcoded bir ödev listesi döndürsün.
        - `GET /api/questions/:assignmentId`: Hardcoded soru listesi döndürsün.
    3. **CORS Yapılandırması:** Express sunucusuna `cors` middleware'ini ekle. Bu, `localhost:3000`'de çalışan Next.js'in `localhost:3001`'de (veya başka bir portta) çalışan API'ye istek atabilmesi için gereklidir.
- **Şevval'in Görevi (Frontend):**

    1. **Supabase Auth Entegrasyonu:** Bu, en büyük kazanımlarınızdan biri. `supabase-js` kütüphanesini kullanarak **doğrudan Next.js component'leri içinden** kullanıcı kayıt (`signup`), giriş (`login`) ve çıkış (`logout`) fonksiyonlarını implemente et. Backend'e hiç dokunmadan güvenli bir kullanıcı yönetimi elde edeceksiniz.
    2. **Component Geliştirme:** Seçtiğiniz UI kütüphanesini (Chakra vb.) kullanarak `OdevKarti`, `SoruCevapAlani`, `RaporGrafigi` gibi yeniden kullanılabilir React component'leri oluştur.
    3. **API'den Veri Çekme:** `useEffect` ve `useState` React hook'larını kullanarak sayfa yüklendiğinde senin hazırladığın sahte API endpoint'lerine istek at ve dönen veriyi ekranda göster. Veri yüklenirken bir "loading" animasyonu göstermeyi unutma.

---

### Gün 2: Fonksiyonellik ve AI Entegrasyonu (19 Eylül, Cuma)

**Amaç:** Projenin canlandığı, en yoğun gün. Yapay zeka ve ana mantık devreye giriyor.

- **Senin Görevin (Backend API):**
    1. **Gerçek AI Endpoint'leri:** Sahte AI fonksiyonlarını, OpenAI kütüphanesini kullanarak gerçek API çağrılarıyla değiştir. Prompt'ları `.env` dosyasından veya kod içinden alarak kullan.
        - `POST /api/tag-question`
        - `POST /api/generate-questions`
        - `POST /api/create-roadmap`
    2. **Veritabanı Mantığı:** Öğrenciden gelen cevapları Supabase'e kaydeden, öğretmenin yeni ödev oluşturmasını sağlayan API endpoint'lerini yaz.
    3. **Çekirdek Hata Analizi Mantığı:** Projenizin en önemli kısmı. Bir ödev tamamlandığında gelen veriyi işleyen, yanlışları analiz eden, öncül konuları belirleyip yeni test soruları isteyen ve en sonunda yol haritası oluşturan ana API endpoint'ini (`POST /api/analyze-results`) kodla. Bu, birden fazla AI ve Supabase çağrısı içerebilir.

- **Şevval'in Görevi (Frontend):**
    1. **Etkileşimli Formlar:** Ödev çözme arayüzünü tamamen işlevsel hale getir. Kullanıcının seçimlerini state'de tut, ödev bitince cevapları toplu olarak backend'deki analiz endpoint'ine gönder.
    2. **Dinamik Sonuçları Gösterme:** Backend'den gelen yol haritası, yeni sorular gibi dinamik ve kişiye özel verileri kullanıcı arayüzünde anlamlı bir şekilde göster.
    3. **State Yönetimi:** Uygulama büyüdükçe kullanıcı bilgisi, mevcut ödev gibi verileri component'ler arasında taşımak için React Context veya Zustand gibi basit bir state yönetim aracı kullanmayı düşünebilirsiniz.
    4. **Sunum Akışı:** Projenin "vay be" dedirtecek özelliğini (hata kökünü bulup kişisel yol haritası çıkarma) en iyi nasıl sunacağınızı planla.


---

### Gün 3: Test, Sunum ve Tek Tıkla Deploy (20 Eylül, Cumartesi)

**Amaç:** Yeni özellik yok, sadece mevcut olanı parlatma ve dünyaya açma günü.

- **Ortak Görevler (Sabah):**

1. **Uçtan Uca Test:** Üç kullanıcı rolünü de (Öğretmen, Öğrenci, Veli) baştan sona deneyin. Tarayıcının Geliştirici Araçları'ndaki "Network" sekmesinden API isteklerinin başarılı olup olmadığını kontrol edin. Supabase tablolarını kontrol ederek verilerin doğru yazıldığından emin olun.
2. **Hata Ayıklama:** Karşılaştığınız hataları birlikte çözün.

- **Şevval'in Görevi (Öğleden Sonra):**
    
    1. **Sunumu Hazırlama:** Demo akışını netleştir. Projenin çözdüğü problemi ve sizin çözümünüzün neden yenilikçi olduğunu anlatan bir hikaye oluştur.
    2. **Mobil Uyumluluk:** CSS Grid/Flexbox veya UI kütüphanenizin özelliklerini kullanarak uygulamanın mobil cihazlarda da düzgün göründüğünden emin ol.

- **Senin Görevin (Öğleden Sonra):**
    
    1. **Vercel'e Deployment:**
        - Vercel'e GitHub hesabınla giriş yap.
        - GitHub deponuzu Vercel'e "Import" et.
        - Vercel, projenin bir Next.js projesi olduğunu otomatik olarak anlayacaktır.
        - **Kritik Adım:** Proje ayarlarında "Environment Variables" bölümüne git ve `.env.local` dosyasındaki _tüm_ anahtarları buraya kopyala.
        - "Deploy" butonuna bas. Vercel, hem Next.js arayüzünü hem de `api` klasöründeki Express sunucusunu deploy edip tek bir URL altında çalışır hale getirecektir. Bu süreç genellikle birkaç dakika sürer.
    2. **README Dosyasını Tamamlama:** Projenin ne yaptığını ve nasıl çalıştığını anlatan `README.md` dosyasını güncelle.
