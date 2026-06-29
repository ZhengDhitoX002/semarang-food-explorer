# Spesifikasi Desain: Semarang Food Explorer Extensions

Dokumen ini mendefinisikan arsitektur, skema data, alur integrasi, dan rencana perubahan UI/UX untuk melengkapi fitur-fitur Semarang Food Explorer sesuai dengan rubrik penilaian dan panduan kebutuhan fungsional.

---

## 1. Arsitektur & Lingkup Fitur

### A. CRUD Kategori & Tag (Admin)
*   **Tujuan**: Memberikan antarmuka bagi Admin untuk mengelola kategori kuliner dan tag penanda.
*   **Controller Baru**:
    *   `App\Http\Controllers\AdminCategoryController`
    *   `App\Http\Controllers\AdminTagController`
*   **Rute Admin**:
    *   `POST /admin/categories`, `PUT /admin/categories/{id}`, `DELETE /admin/categories/{id}`
    *   `POST /admin/tags`, `PUT /admin/tags/{id}`, `DELETE /admin/tags/{id}`
*   **Antarmuka**: Tab baru "Kategori" dan "Tag" di dalam `Admin/Dashboard.tsx`.

### B. Server-Side Nominatim Geocoding dengan Cache
*   **Tujuan**: Melakukan geocoding (Alamat ➔ Koordinat) secara server-side melalui Laravel Controller dan menyimpan hasilnya di cache.
*   **Endpoint Baru**: `GET /api/geocode/search`
*   **Controller**: Menambahkan method `search` di `App\Http\Controllers\Api\GeocodeController`.
*   **Logika Cache**:
    ```php
    $cacheKey = 'geocode_' . md5($address);
    $coordinates = Cache::remember($cacheKey, now()->addDay(), function () use ($address) {
        $response = Http::withHeaders(['User-Agent' => 'SemarangFoodExplorer/1.0'])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $address,
            'format' => 'json',
            'limit' => 1
        ]);
        // Ambil data lat, lon dari response
    });
    ```
*   **Frontend**: Mengubah `SubmitSpot.tsx` agar memanggil `/api/geocode/search?q={address}` secara internal.

### C. Seeder 20+ Kuliner Sekitar Kampus (Udinus)
*   **Tujuan**: Mengisi database dengan 20+ data kuliner nyata di sekitar Kampus Udinus Semarang (Lat: `-6.9822`, Lng: `110.4091`) dengan sebaran radius < 2 km.
*   **File**: `database/seeders/RealSemarangDataSeeder.php`
*   **Data Kuliner**: Penambahan kuliner seperti Ayam Goreng Kampung Kali, Nasi Ayam Bu Wido, Tahu Gimbal Nakula, Soto Bokoran, Angkringan Pandanaran, Warmindo Imam Bonjol, dll.

### D. Filter Jarak (Haversine Proximity)
*   **Tujuan**: Menyaring dan menampilkan tempat kuliner terdekat berdasarkan posisi pengunjung.
*   **Endpoint**: Mengaktifkan `/api/nearby` secara penuh di frontend.
*   **Alur Kerja**:
    1.  Frontend `Explorer.tsx` mendeteksi koordinat pengguna via `navigator.geolocation`.
    2.  Jika diizinkan, panggil `GET /api/nearby?lat={user_lat}&lng={user_lng}&radius=5000` via Axios.
    3.  Tampilkan hasil dinamis pada daftar "Nearby Results" di sebelah peta. Jika diblokir, gunakan titik tengah Kampus Udinus (`-6.9822, 110.4091`).

### E. Fitur "Laporkan Tutup Permanen" (Kontributor)
*   **Tujuan**: Memungkinkan pengguna login untuk melaporkan tempat kuliner yang sudah tutup permanen.
*   **Alur Kerja**:
    1.  User menekan tombol "Laporkan Tutup Permanen" di detail tempat.
    2.  User mengisi alasan penutupan melalui modal form.
    3.  Request dikirim ke `POST /spot/{id}/report-closed`.
    4.  Status tempat kuliner berubah menjadi `pending_close` di database (atau disimpan di tabel laporan khusus).
    5.  Admin melihat antrean laporan tutup di Dashboard Admin, lalu dapat menyetujui (mengubah status spot menjadi `closed`) or menolaknya (mengembalikan status ke `approved`).

### F. Notifikasi Pembayaran via Telegram Bot
*   **Tujuan**: Mengirim pesan konfirmasi pembayaran promosi ke channel/grup/chat Telegram secara instan.
*   **Konfigurasi `.env`**:
    *   `TELEGRAM_BOT_TOKEN`
    *   `TELEGRAM_CHAT_ID`
*   **Alur Kerja**:
    1.  Saat status transaksi berubah menjadi `paid` di `TransactionController::webhookSimulate()`, panggil notifikasi.
    2.  Mengirim pesan menggunakan HTTP Client Laravel ke: `https://api.telegram.org/bot{token}/sendMessage` dengan teks detail pesanan (Order ID, nama toko, jumlah, status sukses).

---

## 2. Rencana Perubahan Database

### Tabel `culinary_spots`
*   Menambahkan status baru `pending_close` pada logika penanganan status di model/controller.
*   Menambahkan kolom `address` (varchar 255) pada tabel `culinary_spots` untuk menyimpan alamat fisik secara permanen (untuk mempermudah fitur pencarian alamat).
    *   *Catatan*: Dibuat melalui file migrasi baru `database/migrations/2026_06_23_add_address_to_culinary_spots_table.php`.

---

## 3. Rencana Perubahan UI/UX

*   **Admin Dashboard (`Admin/Dashboard.tsx`)**:
    *   Menambahkan tab baru "Kategori & Tag" dengan antarmuka tabel pengelolaan sederhana (tambah, edit, hapus).
    *   Menambahkan tab "Laporan Penutupan" untuk menyetujui/menolak laporan tempat tutup permanen.
*   **Detail Kuliner (`CulinarySpotDetail.tsx`)**:
    *   Menambahkan tombol "Laporkan Tutup Permanen" di samping tombol favorit untuk pengguna terautentikasi.
*   **Explorer (`Explorer.tsx`)**:
    *   Menghubungkan visual "Nearby Results" dengan data nyata hasil fetch API `/api/nearby`.

---

## 4. Validasi Keamanan & Kualitas Kode

*   Setiap input form (tambah kategori, tag, submit spot, alasan penutupan) akan divalidasi ketat di sisi backend (Laravel request validation).
*   Mencegah manipulasi ID dengan memvalidasi kepemilikan data (misal: hanya user pemilik atau admin yang bisa mengubah data terkait).
*   Menyimpan dokumentasi API Scribe dengan menjalankan `php artisan scribe:generate` setelah rute baru terdaftar.
