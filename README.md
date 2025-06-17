# Galip E-Ticaret Projesi

Modern Next.js tabanlı e-ticaret web uygulaması.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **Admin Paneli**: Ürün, kategori, sipariş yönetimi
- **Sepet Sistemi**: Ürün ekleme, çıkarma, miktar güncelleme
- **Sipariş Yönetimi**: Sipariş oluşturma ve takip
- **Görsel Yükleme**: Cloudinary entegrasyonu
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **MongoDB**: NoSQL veritabanı desteği

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Veritabanı**: MongoDB
- **Authentication**: NextAuth.js
- **Image Upload**: Cloudinary
- **Deployment**: Vercel

## 📋 Gereksinimler

- Node.js 18+ 
- MongoDB Atlas hesabı
- Cloudinary hesabı (opsiyonel)
- Google OAuth (opsiyonel)

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/galip-ecommerce.git
cd galip-ecommerce
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables Ayarlayın
`.env` dosyasını oluşturun ve `env.example` dosyasındaki değişkenleri kopyalayın:

```bash
cp env.example .env
```

Gerekli değerleri doldurun:
- `DATABASE_URL`: MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: NextAuth için güvenli bir secret key
- `CLOUDINARY_*`: Cloudinary bilgileri (görsel yükleme için)

### 4. Veritabanını Hazırlayın
```bash
# Prisma migration'ları çalıştırın
npx prisma db push

# Seed verilerini yükleyin
npx prisma db seed
```

### 5. Development Server'ı Başlatın
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 📁 Proje Yapısı

```
├── app/
│   ├── admin/          # Admin paneli sayfaları
│   ├── api/            # API routes
│   ├── components/     # React bileşenleri
│   ├── context/        # React context'leri
│   └── lib/            # Yardımcı fonksiyonlar
├── prisma/
│   ├── schema.prisma   # Veritabanı şeması
│   └── seed.ts         # Seed verileri
└── public/             # Statik dosyalar
```

## 🔧 Admin Paneli

Admin paneline erişmek için:
1. `/admin` sayfasına gidin
2. Admin hesabıyla giriş yapın
3. Ürün, kategori ve sipariş yönetimi yapabilirsiniz

## 🚀 Deployment

### Vercel ile Deploy

1. **GitHub'a Push**: Projenizi GitHub'a yükleyin
2. **Vercel'e Bağlayın**: [vercel.com](https://vercel.com) üzerinden GitHub repo'nuzu import edin
3. **Environment Variables**: Vercel dashboard'da environment variables'ları ayarlayın
4. **Deploy**: Otomatik deploy başlayacak

### Environment Variables (Vercel)

Vercel dashboard'da şu environment variables'ları ayarlayın:
- `DATABASE_URL`
- `NEXTAUTH_URL` (production URL'iniz)
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 📝 API Endpoints

### Ürünler
- `GET /api/products` - Tüm ürünleri listele
- `POST /api/products` - Yeni ürün ekle (admin)
- `GET /api/products/[id]` - Tekil ürün getir
- `PUT /api/products/[id]` - Ürün güncelle (admin)
- `DELETE /api/products/[id]` - Ürün sil (admin)

### Kategoriler
- `GET /api/categories` - Tüm kategorileri listele
- `POST /api/categories` - Yeni kategori ekle (admin)

### Sepet
- `GET /api/cart` - Kullanıcı sepetini getir
- `POST /api/cart` - Sepete ürün ekle
- `DELETE /api/cart/[itemId]` - Sepetten ürün sil

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - [@kullaniciadi](https://github.com/kullaniciadi)

Proje Linki: [https://github.com/kullaniciadi/galip-ecommerce](https://github.com/kullaniciadi/galip-ecommerce)
