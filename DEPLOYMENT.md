# Panduan Deploy ke Rumahweb

Checklist ini dibuat setelah audit keamanan penuh terhadap project ini (lihat riwayat commit). Ikuti urutan di bawah — jangan lompat langkah, terutama bagian document root, karena itu yang paling sering bikin `.env` (isi password database & API key) bisa diakses langsung lewat URL oleh siapa saja.

## 1. Tentukan tipe hosting kamu dulu

Login ke cPanel Rumahweb, cek apakah kamu bisa mengubah **document root** domain ke folder custom (biasanya di menu "Domains" atau "Addon Domains").

- **Bisa atur document root sendiri** → lanjut ke Opsi A.
- **Tidak bisa / hanya ada `public_html` bawaan** → lanjut ke Opsi B (lebih aman untuk kasus ini, tidak butuh fitur khusus apa pun).

### Opsi A — Document root bisa diarahkan ke `public/`

1. Upload seluruh isi project (semua folder: `app/`, `public/`, `vendor/`, dst) ke satu folder, misal `/home/namacpanel/semarang-food-explorer/`.
2. Di menu domain cPanel, arahkan document root domain kamu ke `/home/namacpanel/semarang-food-explorer/public`.
3. Selesai — `app/`, `.env`, `vendor/`, `storage/` otomatis tidak bisa diakses lewat URL karena berada di luar document root.

### Opsi B — Hanya ada `public_html` bawaan (tidak bisa custom document root)

Ini pola standar Laravel-di-shared-hosting yang aman meski hosting-nya terbatas:

1. Upload seluruh project ke folder **di luar** `public_html`, misalnya `/home/namacpanel/semarang-food-explorer/` (sejajar dengan `public_html`, bukan di dalamnya).
2. Pindahkan **isi** folder `public/` (bukan foldernya) ke dalam `public_html/`. Jadi `public_html/index.php`, `public_html/build/`, `public_html/.htaccess`, dll — bukan `public_html/public/index.php`.
3. Edit `public_html/index.php` hasil pindahan, ubah 3 baris `require`/`require_once` supaya menunjuk satu level lebih dalam ke folder project:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../semarang-food-explorer/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../semarang-food-explorer/vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../semarang-food-explorer/bootstrap/app.php';

$app->handleRequest(Request::capture());
```

   (Ganti `semarang-food-explorer` di 3 tempat itu sesuai nama folder project kamu yang sebenarnya.)

4. Sekarang `.env`, `app/`, `vendor/` ada di `/home/namacpanel/semarang-food-explorer/` — di luar `public_html/` — jadi tidak bisa diakses lewat URL browser sama sekali, meski nama filenya ditebak.

## 2. Siapkan `.env` production

Jangan pernah upload `.env` development/lokal kamu ke server. Salin `.env.production.example` (sudah saya siapkan di root project) jadi `.env` di server, lalu isi bagian yang kosong:

- `APP_KEY` — generate baru khusus untuk production (langkah 4), jangan pakai yang lokal.
- `APP_URL` — domain asli kamu, harus `https://`.
- `DB_*` — buat database MySQL baru lewat cPanel > "MySQL Databases", masukkan kredensialnya.
- `MAIL_FROM_ADDRESS` — sesuaikan.
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — isi kalau mau notifikasi Telegram tetap jalan (opsional).
- `MIDTRANS_SERVER_KEY` / `MIDTRANS_CLIENT_KEY` — biarkan pakai key sandbox (`SB-Mid-...`) sampai kamu benar-benar siap pakai Midtrans production asli. **Jangan ubah `MIDTRANS_IS_PRODUCTION` ke `true` sampai kamu punya akun Midtrans bisnis terverifikasi** — kalau di-set true tapi key masih sandbox, pembayaran akan gagal semua.

**Sudah otomatis benar di template** (jangan diubah tanpa alasan kuat): `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, `QUEUE_CONNECTION=sync`, `LOG_LEVEL=error`.

## 3. Build frontend di komputer kamu (bukan di server)

```bash
npm run build
```

Ini menghasilkan folder `public/build/`. Upload folder ini ke server (ke `public_html/build/` kalau pakai Opsi B, atau `public/build/` kalau pakai Opsi A). Server Rumahweb TIDAK perlu Node.js/npm sama sekali — hanya butuh hasil build-nya.

## 4. Jalankan perintah setup di server

Kalau paket Rumahweb kamu ada akses **SSH/Terminal** (cek menu cPanel > "Terminal"):

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Kalau **tidak ada SSH**, sebagian besar hosting cPanel punya menu "Setup Node.js/PHP App" atau kamu perlu jalankan lewat cron job sekali (buat cron job yang jalan 1x lalu hapus lagi), atau hubungi support Rumahweb untuk composer install — shared hosting murni tanpa terminal agak merepotkan untuk Laravel, jadi kalau memang tidak ada akses ini sama sekali, kabari saya, ada alternatif (upload `vendor/` hasil composer install dari lokal).

## 5. Set permission folder

`storage/` dan `bootstrap/cache/` harus bisa ditulis oleh web server:

```bash
chmod -R 775 storage bootstrap/cache
```

## 6. Verifikasi sebelum umumkan ke publik

- Buka domain kamu, coba akses halaman yang sengaja error (misal `/spot/999999`) — pastikan yang muncul halaman 404 biasa, **bukan** halaman debug Laravel dengan stack trace. Kalau masih muncul debug page, berarti `APP_DEBUG` masih `true` di server atau cache config belum di-refresh (`php artisan config:cache` lagi).
- Coba buka `https://domainkamu.com/.env` langsung di browser — **harus** dapat error/404, bukan isi file .env. Kalau kebaca, langsung stop, jangan lanjut promosikan situsnya, dan kabari saya — berarti document root-nya salah (balik ke langkah 1).
- Login sebagai admin, coba buka Admin Panel, coba upload foto di "Kelola Foto" — pastikan `storage:link` sudah jalan.
- Coba alur registrasi/login beberapa kali salah password berturut-turut — pastikan kena rate-limit (pesan "terlalu banyak percobaan") setelah 5x, bukan bisa dicoba tanpa batas.

## Catatan tambahan

- **PHP version**: project ini butuh PHP 8.3 ke atas (`composer.json`). Pastikan cPanel > "Select PHP Version" di-set ke 8.3 atau lebih baru sebelum composer install, kalau tidak composer akan gagal atau fitur tertentu error.
- **Kalau nanti ganti dari sandbox ke Midtrans production sungguhan**: tombol "Tandai Lunas (Simulasi)" di halaman Promosi otomatis hilang sendiri (sudah dikunci ke mode sandbox saja di kode), jadi tidak perlu ada yang diubah manual soal itu.
