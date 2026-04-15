# 🍜 Semarang Food Explorer

**Platform eksplorasi kuliner kota Semarang** — Membantu wisatawan dan warga lokal menemukan tempat kuliner terbaik di Semarang melalui peta interaktif, ulasan pengguna, dan rekomendasi berbasis AI.

> 📌 Project ini dibuat sebagai tugas mata kuliah **Pemrograman Web Lanjut (PWL)** — Universitas Dian Nuswantoro

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur](#-arsitektur)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Cara Instalasi](#-cara-instalasi)
- [Konfigurasi .env](#-konfigurasi-env)
- [Akun Demo](#-akun-demo)
- [API Endpoints](#-api-endpoints)
- [Screenshot](#-screenshot)

---

## ✨ Fitur Utama

### 🌐 Public (Tanpa Login)
- **Explorer** — Jelajahi kuliner Semarang dengan peta interaktif (Leaflet.js)
- **Detail Spot** — Lihat info lengkap, foto, rating, dan ulasan tempat kuliner
- **Search** — Pencarian cepat dengan Meilisearch full-text search

### 👤 User (Login)
- **Review & Rating** — Beri ulasan dan rating pada tempat kuliner
- **Rekomendasi AI** — Dapatkan rekomendasi kuliner berdasarkan preferensi (Collaborative Filtering)
- **Transaksi Promosi** — Promosikan tempat kuliner favorit

### 🏪 Merchant
- **Dashboard** — Statistik penjualan, ulasan, dan analitik pengunjung (Recharts)
- **Promosi** — Kelola promosi tempat kuliner

### 🛡️ Admin
- **Manajemen Spot** — CRUD tempat kuliner
- **Akses Merchant** — Semua fitur merchant

### 🔧 Fitur Teknis
- **Geocoding** — Reverse geocode menggunakan Nominatim API
- **Geofencing** — Cari kuliner terdekat dengan Haversine Formula
- **PWA** — Progressive Web App support dengan Service Worker
- **API Rate Limiting** — Throttle untuk keamanan API
- **Media Management** — Upload & manajemen foto menggunakan Spatie MediaLibrary

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Laravel 13 (PHP 8.3) |
| **Frontend** | React 19 + TypeScript |
| **Bridge** | Inertia.js 2.0 |
| **Styling** | Tailwind CSS 4 |
| **Database** | PostgreSQL |
| **Search** | Meilisearch |
| **Maps** | Leaflet.js + React-Leaflet |
| **Charts** | Recharts |
| **Auth** | Laravel Session-based |
| **API Auth** | Laravel Sanctum |
| **Media** | Spatie MediaLibrary |
| **Build** | Vite 7 |
| **Monitoring** | Sentry |
| **Testing** | Pest PHP |

---

## 🏗️ Arsitektur

```
semarang-food-explorer/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Controller utama (Auth, CRUD, dll)
│   │   │   └── Api/              # API controllers (Geocode, Geofence, Recommendation)
│   │   └── Middleware/           # Custom middleware (role-based access)
│   ├── Models/                   # Eloquent Models (User, CulinarySpot, Review, dll)
│   ├── Notifications/            # Notification classes
│   └── Providers/                # Service Providers
├── database/
│   ├── migrations/               # 11 migration files
│   ├── seeders/                  # 8 seeder files (data real Semarang)
│   └── factories/                # Model factories
├── resources/
│   └── js/
│       └── Pages/
│           ├── Explorer.tsx       # Halaman utama dengan peta
│           ├── CulinarySpotDetail.tsx  # Detail tempat kuliner
│           ├── Auth/              # Login & Register
│           └── Merchant/          # Dashboard & Promotion
├── routes/
│   ├── web.php                   # Web routes (Inertia)
│   └── api.php                   # API routes (REST)
└── config/                       # Konfigurasi Laravel
```

---

## 💻 Persyaratan Sistem

- **PHP** >= 8.3
- **Composer** >= 2.x
- **Node.js** >= 20.x
- **NPM** >= 10.x
- **PostgreSQL** >= 14
- **Meilisearch** >= 1.x *(opsional, untuk fitur search)*

---

## 🚀 Cara Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/semarang-food-explorer.git
cd semarang-food-explorer
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 3. Konfigurasi Environment

```bash
# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=semarang_food_explorer
DB_USERNAME=postgres
DB_PASSWORD=password_anda
```

### 4. Setup Database

```bash
# Buat database PostgreSQL terlebih dahulu:
# sudo -u postgres createdb semarang_food_explorer

# Jalankan migration + seeder
php artisan migrate --seed
```

### 5. Buat Storage Link

```bash
php artisan storage:link
```

### 6. Build Frontend & Jalankan

```bash
# Development mode (hot reload)
npm run dev

# Di terminal lain, jalankan Laravel server:
php artisan serve
```

Atau jalankan semuanya sekaligus:

```bash
composer dev
```

Buka browser dan akses: **http://localhost:8000**

---

## ⚙️ Konfigurasi .env

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DB_CONNECTION` | Driver database | `pgsql` |
| `DB_HOST` | Host database | `127.0.0.1` |
| `DB_PORT` | Port database | `5432` |
| `DB_DATABASE` | Nama database | `semarang_food_explorer` |
| `DB_USERNAME` | Username database | `postgres` |
| `DB_PASSWORD` | Password database | `password_anda` |
| `SCOUT_DRIVER` | Search engine | `meilisearch` *(opsional)* |
| `MEILISEARCH_HOST` | URL Meilisearch | `http://127.0.0.1:7700` |
| `SENTRY_LARAVEL_DSN` | Sentry DSN | *(opsional)* |

> **Catatan:** Jika tidak menggunakan Meilisearch, ubah `SCOUT_DRIVER` menjadi `database` atau `null`.

---

## 👤 Akun Demo

Setelah menjalankan `php artisan migrate --seed`, akun berikut tersedia:

### Admin
| Email | Password | Role |
|-------|----------|------|
| `admin@semarangfood.com` | `password` | Admin |

### Merchant
| Email | Password | Role |
|-------|----------|------|
| `merchant1@semarangfood.com` | `password` | Merchant (Pak Lumpia) |
| `merchant2@semarangfood.com` | `password` | Merchant (Bu Elrina) |

### User
| Email | Password | Role |
|-------|----------|------|
| `budi@example.com` | `password` | User |
| `siti@example.com` | `password` | User |
| `andi@example.com` | `password` | User |
| `dewi@example.com` | `password` | User |
| `rizky@example.com` | `password` | User |

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/` | ❌ | Halaman Explorer |
| `GET` | `/spot/{id}` | ❌ | Detail tempat kuliner |
| `POST` | `/login` | ❌ | Login |
| `POST` | `/register` | ❌ | Register |
| `POST` | `/reviews` | ✅ | Buat review |
| `POST` | `/transactions` | ✅ | Buat transaksi promosi |
| `GET` | `/merchant/dashboard` | ✅ Merchant | Dashboard merchant |
| `POST` | `/admin/spots` | ✅ Admin | Tambah spot kuliner |
| `PUT` | `/admin/spots/{id}` | ✅ Admin | Update spot kuliner |
| `POST` | `/api/analytics` | ❌ | Track analytics |
| `GET` | `/api/geocode` | ❌ | Reverse geocoding |
| `GET` | `/api/nearby` | ❌ | Cari spot terdekat |
| `GET` | `/api/recommendations` | ✅ | Rekomendasi AI |

---

## 📸 Screenshot

> *Screenshot akan ditambahkan setelah deployment.*

<!-- Contoh format screenshot:
### Halaman Explorer
![Explorer](screenshots/explorer.png)

### Detail Kuliner
![Detail](screenshots/detail.png)

### Merchant Dashboard
![Dashboard](screenshots/dashboard.png)
-->

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik mata kuliah Pemrograman Web Lanjut (PWL) — Universitas Dian Nuswantoro.
