# Panduan Presentasi & Cheat Sheet Project (Aspek 1-3)
**Semarang Food Explorer**

---

## Aspek 1: Perencanaan & Desain Database (Bobot 10%)
**Syarat Penilaian (Sangat Baik):** ERD lengkap, normalisasi 3NF, relasi benar.

### 📂 File yang Harus Dibuka Saat Presentasi:
1. **`database/migrations/2026_04_27_000002_create_culinary_spot_tag_table.php`** 
   *(Buka ini untuk pamerkan relasi Many-to-Many / Pivot Tabel)*
2. **`database/migrations/2026_04_11_174306_create_culinary_spots_table.php`** 
   *(Tunjukkan struktur kolom utama dan foreign key)*

### 💡 Cheat Sheet Pertanyaan Dosen:

**Q: Coba jelaskan relasi antar tabelmu, apakah sudah Normalisasi 3NF?**
> **Jawaban Anda:** "Sudah Pak/Bu. Semua entitas sudah dipisah sesuai fungsinya agar tidak ada redudansi data (3NF). Misalnya antara tabel *Culinary Spot* dan *Tags*. Karena satu spot bisa punya banyak tag, dan satu tag bisa untuk banyak spot, saya pisahkan dan buatkan tabel perantara/pivot `culinary_spot_tag`. Jadi strukturnya mematuhi 3NF."

**Q: Di mana kamu mendefinisikan relasi (Foreign Key)-nya?**
> **Jawaban Anda:** "Semua definisi foreign key saya terapkan di tingkat database melalui file migrations. Saya menggunakan perintah `foreignId()->constrained()->onDelete('cascade')` untuk menjaga integritas data antar tabel."

---

## Aspek 2: Implementasi Migration & Seeder (Bobot 5%)
**Syarat Penilaian (Sangat Baik):** Migration lengkap, seeder realistis, rollback berfungsi.

### 📂 File yang Harus Dibuka Saat Presentasi:
1. **`database/seeders/RealSemarangDataSeeder.php`** 
   *(Ini JOKER Anda! Tunjukkan bahwa data Anda bukan asal-asalan)*
2. **`database/seeders/DatabaseSeeder.php`** 
   *(Untuk menunjukkan urutan pemanggilan seeder)*

### 💡 Cheat Sheet Pertanyaan Dosen:

**Q: Seeder-mu cuma pakai data dummy (faker) yang acak-acakan atau bagaimana?**
> **Jawaban Anda:** "Saya menggunakan data yang sangat realistis Pak/Bu. Saya sengaja membuat `RealSemarangDataSeeder.php` khusus untuk memuat tempat-tempat kuliner asli di Semarang, lengkap dengan kategori, deskripsi yang akurat, dan relasinya."

**Q: Apakah fungsi rollback dari migration ini bisa berjalan?**
> **Jawaban Anda:** "Berjalan sempurna. Setiap skema pembuatan tabel (`create`) yang ada di fungsi `up()`, sudah memiliki pendampingnya yaitu `dropIfExists` di dalam fungsi `down()`. Jadi saat `php artisan migrate:rollback` dijalankan, tabel akan dihancurkan dengan bersih."

---

## Aspek 3: Autentikasi & Otorisasi (Session + Filter) (Bobot 10%)
**Syarat Penilaian (Sangat Baik):** Login, logout, multi-role, filter ketat, proteksi semua route.

### 📂 File yang Harus Dibuka Saat Presentasi:
1. **`routes/web.php`** 
   *(Buka file ini, gulir ke baris 39 untuk melihat `middleware('auth')` dan baris 80 untuk melihat proteksi khusus Multi-Role)*
2. **`app/Http/Controllers/AuthController.php`** 
   *(Tunjukkan fungsi `login()` untuk membuktikan proses otentikasinya)*

### 💡 Cheat Sheet Pertanyaan Dosen:

**Q: Coba tunjukkan di mana letak Session Filter-nya? Gimana cara kamu mencegah user yang belum login mengakses halaman sensitif?**
> **Jawaban Anda:** "Di framework Laravel yang saya gunakan, Session Filter disebut sebagai **Middleware**. Bisa langsung dilihat di file `routes/web.php`. Rute-rute sensitif saya bungkus menggunakan *Route Group* dengan `Route::middleware('auth')`. Middleware inilah yang otomatis memfilter sesi (session) pengunjung. Jika pengunjung belum punya session aktif, mereka akan otomatis ditendang (redirect) kembali ke halaman Login."

**Q: Bagaimana kamu mengatur otorisasi (hak akses) Multi-Role? Jangan sampai user biasa masuk ke Dashboard Admin!**
> **Jawaban Anda:** "Saya menggunakan Middleware berlapis Pak/Bu. Di `routes/web.php` baris ke-107, rute admin saya berikan filter ekstra: `middleware(['auth', 'role:admin'])`. Filter ini bertugas mengecek kolom `role` di database berdasarkan data session user yang sedang aktif. Jika `role` yang terbaca adalah 'user', maka akses ke dasbor admin akan ditolak mentah-mentah (403 Forbidden)."

---
*Semoga sukses presentasinya! Anda punya project dengan struktur kelas industri yang sangat rapi.*
