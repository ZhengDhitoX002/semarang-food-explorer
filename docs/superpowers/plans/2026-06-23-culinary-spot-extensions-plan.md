# Semarang Food Explorer Extensions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Melengkapi fitur-fitur Semarang Food Explorer (CRUD Kategori/Tag, geocoding Nominatim server-side dengan caching, 20+ seeder spot dekat kampus, filter jarak Haversine dinamis, laporan tutup permanen, dan notifikasi Telegram Bot).

**Architecture:** Menggunakan Laravel 13 untuk routing, controller, validation, database migrations, dan integration tests. Frontend diimplementasikan di Inertia React dengan Tailwind CSS v4 untuk integrasi visual.

**Tech Stack:** Laravel 13, Inertia.js, React, Tailwind CSS, Leaflet, PHPUnit.

## Global Constraints
* Semua rute backend divalidasi dengan Laravel Form Requests.
* Geocoding eksternal ke Nominatim harus menyertakan header `User-Agent` yang valid dan di-cache selama 24 jam.
* Notifikasi Telegram dikirim via HTTP Client Laravel secara asinkron/langsung saat simulasi pembayaran berhasil.

---

### Task 1: Add Address Migration and Update Model

**Files:**
- Create: `database/migrations/2026_06_23_000001_add_address_to_culinary_spots_table.php`
- Test: `tests/Feature/CulinarySpotAddressTest.php`

**Interfaces:**
- Consumes: Skema tabel `culinary_spots` saat ini.
- Produces: Kolom `address` (nullable string) di tabel `culinary_spots`.

- [ ] **Step 1: Tulis migration file untuk menambahkan kolom address**

Create file `database/migrations/2026_06_23_000001_add_address_to_culinary_spots_table.php`:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->string('address')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('culinary_spots', function (Blueprint $table) {
            $table->dropColumn('address');
        });
    }
};
```

- [ ] **Step 2: Tulis feature test untuk memverifikasi kolom address**

Create file `tests/Feature/CulinarySpotAddressTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\CulinarySpot;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CulinarySpotAddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_save_spot_with_address(): void
    {
        $category = Category::create(['name' => 'Warteg']);
        $spot = CulinarySpot::create([
            'category_id' => $category->id,
            'name' => 'Warteg Udinus',
            'description' => 'Warteg murah dekat Udinus',
            'address' => 'Jl. Nakula I No. 5, Semarang',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 15000,
        ]);

        $this->assertDatabaseHas('culinary_spots', [
            'id' => $spot->id,
            'address' => 'Jl. Nakula I No. 5, Semarang'
        ]);
    }
}
```

- [ ] **Step 3: Jalankan migrasi dan tes**

Run: `php artisan migrate`
Expected: Migrasi berhasil dijalankan.

Run: `php artisan test --filter=CulinarySpotAddressTest`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add database/migrations/2026_06_23_000001_add_address_to_culinary_spots_table.php tests/Feature/CulinarySpotAddressTest.php
git commit -m "feat: add address field to culinary spots table and write test"
```

---

### Task 2: CRUD Kategori & Tag (Admin Backend & Frontend)

**Files:**
- Create: `app/Http/Controllers/AdminCategoryController.php`
- Create: `app/Http/Controllers/AdminTagController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/Admin/Dashboard.tsx`
- Test: `tests/Feature/AdminCategoryControllerTest.php`
- Test: `tests/Feature/AdminTagControllerTest.php`

**Interfaces:**
- Consumes: Model `Category` dan `Tag`.
- Produces: Endpoint backend dan UI untuk pengelolaan Kategori dan Tag oleh Admin.

- [ ] **Step 1: Tulis unit/feature test untuk Admin Category & Tag CRUD**

Create file `tests/Feature/AdminCategoryControllerTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminCategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);
    }

    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/categories', [
            'name' => 'Kopi Es'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', ['name' => 'Kopi Es']);
    }

    public function test_admin_can_update_category(): void
    {
        $category = Category::create(['name' => 'Minuman']);
        $response = $this->actingAs($this->admin)->put("/admin/categories/{$category->id}", [
            'name' => 'Minuman Dingin'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Minuman Dingin'
        ]);
    }

    public function test_admin_can_delete_category(): void
    {
        $category = Category::create(['name' => 'Cemilan']);
        $response = $this->actingAs($this->admin)->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
```

Create file `tests/Feature/AdminTagControllerTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminTagControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);
    }

    public function test_admin_can_create_tag(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/tags', [
            'name' => 'WiFi Cepat',
            'slug' => 'wifi-cepat'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tags', ['name' => 'WiFi Cepat']);
    }

    public function test_admin_can_delete_tag(): void
    {
        $tag = Tag::create(['name' => 'AC Dingin', 'slug' => 'ac-dingin']);
        $response = $this->actingAs($this->admin)->delete("/admin/tags/{$tag->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }
}
```

- [ ] **Step 2: Implementasikan Controller `AdminCategoryController.php`**

Create file `app/Http/Controllers/AdminCategoryController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name']
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id]
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(int $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    }
}
```

- [ ] **Step 3: Implementasikan Controller `AdminTagController.php`**

Create file `app/Http/Controllers/AdminTagController.php`:
```php
<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminTagController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name']
        ]);

        Tag::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Tag berhasil ditambahkan!');
    }

    public function destroy(int $id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return redirect()->back()->with('success', 'Tag berhasil dihapus!');
    }
}
```

- [ ] **Step 4: Daftarkan Rute Baru di `routes/web.php`**

Modify `routes/web.php` di dalam grup middleware admin:
```php
// Tambahkan di dalam Route::middleware(['auth', 'role:admin'])->group(function () {
Route::post('/admin/categories', [\App\Http\Controllers\AdminCategoryController::class, 'store'])->name('admin.categories.store');
Route::put('/admin/categories/{id}', [\App\Http\Controllers\AdminCategoryController::class, 'update'])->name('admin.categories.update');
Route::delete('/admin/categories/{id}', [\App\Http\Controllers\AdminCategoryController::class, 'destroy'])->name('admin.categories.destroy');

Route::post('/admin/tags', [\App\Http\Controllers\AdminTagController::class, 'store'])->name('admin.tags.store');
Route::delete('/admin/tags/{id}', [\App\Http\Controllers\AdminTagController::class, 'destroy'])->name('admin.tags.destroy');
```

- [ ] **Step 5: Verifikasi Tes Unit Backend**

Run: `php artisan test --filter=AdminCategoryControllerTest`
Expected: PASS

Run: `php artisan test --filter=AdminTagControllerTest`
Expected: PASS

- [ ] **Step 6: Update Admin Controller Dashboard untuk Passing Kategori & Tag**

Modify `app/Http/Controllers/AdminController.php` untuk melampirkan categories dan tags ke view:
```php
// Update index method di AdminController.php
public function index()
{
    // existing statistics...
    $categories = \App\Models\Category::all();
    $tags = \App\Models\Tag::all();

    return Inertia::render('Admin/Dashboard', [
        // existing data...
        'categories' => $categories,
        'tags' => $tags,
    ]);
}
```

- [ ] **Step 7: Tambahkan Tab Kategori & Tag di Frontend React (`Admin/Dashboard.tsx`)**

Modify `resources/js/Pages/Admin/Dashboard.tsx` untuk menampilkan panel manajemen kategori dan tag. Tambahkan tab dan tombol aksi CRUD. Gunakan Inertia `router.post`, `router.delete`, dan form handler.
```typescript
// Tambahkan Tab Kategori & Tag
// Definisikan state untuk tab
// Tambahkan modal form tambah kategori/tag
```

- [ ] **Step 8: Commit**

```bash
git add app/Http/Controllers/AdminCategoryController.php app/Http/Controllers/AdminTagController.php routes/web.php tests/Feature/AdminCategoryControllerTest.php tests/Feature/AdminTagControllerTest.php app/Http/Controllers/AdminController.php resources/js/Pages/Admin/Dashboard.tsx
git commit -m "feat: implement category and tag CRUD for admin dashboard with feature tests"
```

---

### Task 3: Server-Side Nominatim Geocoding dengan Caching

**Files:**
- Modify: `app/Http/Controllers/Api/GeocodeController.php`
- Modify: `routes/api.php`
- Modify: `resources/js/Pages/SubmitSpot.tsx`
- Test: `tests/Feature/GeocodeControllerTest.php`

**Interfaces:**
- Consumes: Nominatim OpenStreetMap API.
- Produces: Endpoint `GET /api/geocode/search` dengan caching 24 jam.

- [ ] **Step 1: Tulis unit/feature test untuk geocoding server-side dan cache**

Create file `tests/Feature/GeocodeControllerTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeocodeControllerTest extends TestCase
{
    public function test_geocode_search_returns_coordinates_and_caches_result(): void
    {
        Cache::flush();

        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response([
                [
                    'lat' => '-6.9822',
                    'lon' => '110.4091',
                    'display_name' => 'Nakula Street, Semarang'
                ]
            ], 200)
        ]);

        $response = $this->getJson('/api/geocode/search?q=Nakula');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'latitude' => -6.9822,
                    'longitude' => 110.4091,
                ]
            ]);

        // Verifikasi hasil di-cache
        $this->assertTrue(Cache::has('geocode_' . md5('Nakula')));
    }
}
```

- [ ] **Step 2: Implementasikan Method `search` di `GeocodeController.php`**

Modify `app/Http/Controllers/Api/GeocodeController.php` untuk menambahkan method `search`:
```php
    public function search(Request $request)
    {
        $request->validate([
            'q' => ['required', 'string', 'min:3']
        ]);

        $address = strtolower(trim($request->q));
        $cacheKey = 'geocode_' . md5($address);

        $data = Cache::remember($cacheKey, now()->addDay(), function () use ($address) {
            $response = Http::withHeaders([
                'User-Agent' => 'SemarangFoodExplorer/1.0 (contact@semarangfoodexplorer.test)'
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1
            ]);

            if ($response->successful() && count($response->json()) > 0) {
                $result = $response->json()[0];
                return [
                    'latitude' => (float)$result['lat'],
                    'longitude' => (float)$result['lon'],
                    'display_name' => $result['display_name']
                ];
            }

            return null;
        });

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan atau API bermasalah'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
```

- [ ] **Step 3: Daftarkan Rute Baru di `routes/api.php`**

Modify `routes/api.php`:
```php
// Tambahkan rute pencarian geocode
Route::get('/geocode/search', [\App\Http\Controllers\Api\GeocodeController::class, 'search']);
```

- [ ] **Step 4: Jalankan dan Verifikasi Tes Geocoding**

Run: `php artisan test --filter=GeocodeControllerTest`
Expected: PASS

- [ ] **Step 5: Hubungkan Frontend `SubmitSpot.tsx` ke Endpoint Geocoding Internal**

Modify `resources/js/Pages/SubmitSpot.tsx` untuk mengganti fetch URL Nominatim langsung ke endpoint `/api/geocode/search?q=`.
```typescript
// Ganti pemanggilan Nominatim dari:
// fetch(`https://nominatim.openstreetmap.org/search?format=json&q=...`)
// Menjadi:
// axios.get(`/api/geocode/search?q=${encodeURIComponent(addressInput)}`)
```

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/Api/GeocodeController.php routes/api.php tests/Feature/GeocodeControllerTest.php resources/js/Pages/SubmitSpot.tsx
git commit -m "feat: implement server-side forward geocoding with 24-hour caching and integrate in submit spot form"
```

---

### Task 4: Seeder 20+ Kuliner Sekitar Kampus Udinus

**Files:**
- Modify: `database/seeders/RealSemarangDataSeeder.php`

**Interfaces:**
- Consumes: Model `Category` dan `CulinarySpot`.
- Produces: 20+ records kuliner dengan koordinat radius dekat Udinus (Lat: `-6.9822`, Lng: `110.4091`).

- [ ] **Step 1: Perbarui seeder `RealSemarangDataSeeder.php`**

Modify `database/seeders/RealSemarangDataSeeder.php` untuk menambahkan minimal 20 records kuliner di sekitar kampus:
```php
<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CulinarySpot;
use App\Models\User;
use Illuminate\Database\Seeder;

class RealSemarangDataSeeder extends Seeder
{
    public function run(): void
    {
        $merchant = User::firstOrCreate(
            ['email' => 'admin_legendaris@semarangfood.com'],
            [
                'name' => 'Admin Legendaris',
                'password' => bcrypt('password'),
                'role' => 'merchant'
            ]
        );

        $spots = [
            // 20+ spots around Udinus (-6.9822, 110.4091)
            [
                'cat' => 'Makanan Utama',
                'name' => 'Warteg Bahari Nakula',
                'desc' => 'Warteg andalan mahasiswa Udinus dengan beragam pilihan sayur dan lauk pauk harga ramah kantong.',
                'address' => 'Jl. Nakula I No. 10, Pendrikan Kidul, Semarang',
                'lat' => -6.9818,
                'lng' => 110.4088,
                'price' => 12000,
                'is_promoted' => true,
            ],
            [
                'cat' => 'Mie Khas Daerah',
                'name' => 'Mie Kopyok Pak Dhuwur',
                'desc' => 'Mie kopyok legendaris dengan potongan tahu pong, tauge, lontong dan taburan kerupuk gendar.',
                'address' => 'Jl. Imam Bonjol No. 182, Sekayu, Semarang',
                'lat' => -6.9815,
                'lng' => 110.4105,
                'price' => 15000,
                'is_promoted' => true,
            ],
            [
                'cat' => 'Restoran & Cafe',
                'name' => 'Bleu Chicken & Coffee Nakula',
                'desc' => 'Tempat nongkrong estetik mahasiswa dengan menu andalan olahan ayam mentega dan kopi susu gula aren.',
                'address' => 'Jl. Nakula Raya No. 45, Semarang',
                'lat' => -6.9825,
                'lng' => 110.4075,
                'price' => 25000,
                'is_promoted' => false,
            ],
            // Tambahkan data spot lain hingga mencapai total minimal 20 spot...
        ];

        foreach ($spots as $s) {
            $cat = Category::firstOrCreate(['name' => $s['cat']]);
            CulinarySpot::create([
                'category_id' => $cat->id,
                'owner_id' => $merchant->id,
                'name' => $s['name'],
                'description' => $s['desc'],
                'address' => $s['address'],
                'latitude' => $s['lat'],
                'longitude' => $s['lng'],
                'price' => $s['price'],
                'is_promoted' => $s['is_promoted'],
                'status' => 'approved',
            ]);
        }
    }
}
```

- [ ] **Step 2: Jalankan Seeder database ulang**

Run: `php artisan db:seed --class=RealSemarangDataSeeder`
Expected: Berhasil melakukan seeding tanpa error.

- [ ] **Step 3: Commit**

```bash
git add database/seeders/RealSemarangDataSeeder.php
git commit -m "seed: expand RealSemarangDataSeeder to seed 20+ spots near Udinus campus"
```

---

### Task 5: Proximity Filter (Haversine) in Explorer Peta

**Files:**
- Modify: `resources/js/Pages/Explorer.tsx`

**Interfaces:**
- Consumes: Endpoint `/api/nearby` bawaan.
- Produces: Nearby results dinamis di sisi frontend map explorer.

- [ ] **Step 1: Integrasikan Geolocation di `Explorer.tsx`**

Modify `resources/js/Pages/Explorer.tsx` untuk mengambil posisi user dari browser dan mengirim request ke `/api/nearby`:
```typescript
// Tambahkan state untuk nearbySpots hasil API
// Lakukan fetch data nearby:
// axios.get(`/api/nearby?lat=${userLat}&lng=${userLng}&radius=2000`)
// Hapus hardcoded `nearbyResults` dan ganti dengan `nearbySpots`
```

- [ ] **Step 2: Jalankan testing manual peta**

Verify: Halaman peta di Explorer menampilkan marker dari data seeder dinamis dan menampilkan daftar "Nearby Results" berdasarkan jarak koordinat yang dihitung.

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Explorer.tsx
git commit -m "feat: fetch and render actual nearby spots dynamically in explorer page using geolocation and api"
```

---

### Task 6: Fitur "Laporkan Tutup Permanen" (Report Closed)

**Files:**
- Modify: `app/Http/Controllers/CulinarySpotController.php`
- Modify: `routes/web.php`
- Modify: `resources/js/Pages/CulinarySpotDetail.tsx`
- Modify: `resources/js/Pages/Admin/Dashboard.tsx`
- Test: `tests/Feature/ReportClosedTest.php`

**Interfaces:**
- Consumes: Status spot kuliner.
- Produces: Status `pending_close` ketika dilaporkan, dan status `closed` ketika disetujui admin.

- [ ] **Step 1: Tulis unit/feature test untuk alur pelaporan tutup**

Create file `tests/Feature/ReportClosedTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\CulinarySpot;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReportClosedTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private User $admin;
    private CulinarySpot $spot;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::create(['name' => 'User', 'email' => 'user@test.com', 'password' => bcrypt('password'), 'role' => 'user']);
        $this->admin = User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => bcrypt('password'), 'role' => 'admin']);
        $category = Category::create(['name' => 'Restoran']);
        $this->spot = CulinarySpot::create([
            'category_id' => $category->id,
            'name' => 'Resto A',
            'latitude' => -6.9,
            'longitude' => 110.4,
            'price' => 50000,
            'status' => 'approved'
        ]);
    }

    public function test_user_can_report_closed(): void
    {
        $response = $this->actingAs($this->user)->post("/spot/{$this->spot->id}/report-closed", [
            'closed_reason' => 'Toko bangkrut'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('culinary_spots', [
            'id' => $this->spot->id,
            'status' => 'pending_close',
            'closed_reason' => 'Toko bangkrut'
        ]);
    }
}
```

- [ ] **Step 2: Implementasikan method `reportClosed` di `CulinarySpotController.php`**

Modify `app/Http/Controllers/CulinarySpotController.php`:
```php
    public function reportClosed(Request $request, int $id)
    {
        $spot = CulinarySpot::findOrFail($id);

        $validated = $request->validate([
            'closed_reason' => ['required', 'string', 'max:500']
        ]);

        $spot->update([
            'status' => 'pending_close',
            'closed_reason' => $validated['closed_reason']
        ]);

        return redirect()->back()->with('success', 'Laporan tutup permanen berhasil dikirim ke Admin untuk moderasi.');
    }
```

- [ ] **Step 3: Daftarkan Rute Baru di `routes/web.php`**

Modify `routes/web.php`:
```php
Route::post('/spot/{id}/report-closed', [\App\Http\Controllers\CulinarySpotController::class, 'reportClosed'])
    ->middleware('auth')
    ->name('spot.report-closed');
```

- [ ] **Step 4: Jalankan Tes Backend untuk Fitur Lapor Tutup**

Run: `php artisan test --filter=ReportClosedTest`
Expected: PASS

- [ ] **Step 5: Tambahkan Tombol Lapor di UI Frontend `CulinarySpotDetail.tsx`**

Modify `resources/js/Pages/CulinarySpotDetail.tsx` untuk menyertakan tombol "Laporkan Tutup Permanen" beserta dialog/modal untuk mengisi alasan. Kirim data via Inertia Form Helper.

- [ ] **Step 6: Tampilkan Laporan Tutup di `Admin/Dashboard.tsx`**

Modify `resources/js/Pages/Admin/Dashboard.tsx` untuk menampilkan daftar kuliner dengan status `pending_close` di tab Moderasi, lengkap dengan tombol "Setujui Tutup" (mengubah ke `closed`) dan "Tolak Laporan" (mengubah kembali ke `approved`).

- [ ] **Step 7: Commit**

```bash
git add app/Http/Controllers/CulinarySpotController.php routes/web.php tests/Feature/ReportClosedTest.php resources/js/Pages/CulinarySpotDetail.tsx resources/js/Pages/Admin/Dashboard.tsx
git commit -m "feat: implement report closure feature for contributors and moderation UI for admin"
```

---

### Task 7: Telegram Bot Payment Notifications

**Files:**
- Modify: `app/Http/Controllers/TransactionController.php`
- Modify: `.env.example`

**Interfaces:**
- Consumes: Rincian transaksi pembayaran.
- Produces: Pesan instan ke Bot API Telegram.

- [ ] **Step 1: Tulis unit/feature test untuk notifikasi Telegram**

Create file `tests/Feature/TelegramNotificationTest.php`:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\CulinarySpot;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TelegramNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_simulation_triggers_telegram_notification(): void
    {
        Http::fake([
            'api.telegram.org/*' => Http::response(['ok' => true], 200)
        ]);

        config(['services.telegram.bot_token' => 'mock-token']);
        config(['services.telegram.chat_id' => 'mock-chat-id']);

        $user = User::create(['name' => 'Owner', 'email' => 'owner@test.com', 'password' => bcrypt('password')]);
        $category = Category::create(['name' => 'Kafe']);
        $spot = CulinarySpot::create([
            'category_id' => $category->id,
            'name' => 'Warkop Udinus',
            'latitude' => -6.9,
            'longitude' => 110.4,
            'price' => 10000,
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'spot_id' => $spot->id,
            'order_id' => 'SFE-TESTING',
            'status' => 'pending',
            'amount' => 50000
        ]);

        $this->get("/api/webhook/payment/simulate/{$transaction->order_id}");

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.telegram.org/botmock-token/sendMessage') &&
                str_contains($request['text'], 'SFE-TESTING');
        });
    }
}
```

- [ ] **Step 2: Konfigurasi telegram token di config Laravel**

Modify `config/services.php` untuk memuat variabel token:
```php
    'telegram' => [
        'bot_token' => env('TELEGRAM_BOT_TOKEN'),
        'chat_id' => env('TELEGRAM_CHAT_ID'),
    ],
```

- [ ] **Step 3: Kirim notifikasi Telegram saat webhook simulasi sukses**

Modify `app/Http/Controllers/TransactionController.php` di dalam method `webhookSimulate`:
```php
        // Kirim notifikasi Telegram
        $botToken = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if ($botToken && $chatId) {
            $message = "💰 *Pembayaran Promosi Berhasil!* 💰\n\n" .
                       "📍 *Toko:* " . ($transaction->culinarySpot->name ?? 'Tidak diketahui') . "\n" .
                       "🆔 *Order ID:* " . $transaction->order_id . "\n" .
                       "💵 *Jumlah:* Rp " . number_format($transaction->amount, 0, ',', '.') . "\n" .
                       "✅ *Status:* PAID\n" .
                       "📅 *Tanggal:* " . now()->format('Y-m-d H:i:s');

            \Illuminate\Support\Facades\Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown'
            ]);
        }
```

- [ ] **Step 4: Jalankan dan Verifikasi Tes Notifikasi**

Run: `php artisan test --filter=TelegramNotificationTest`
Expected: PASS

- [ ] **Step 5: Update `.env.example`**

Modify `.env.example` untuk menambahkan placeholder konfigurasi bot Telegram:
```ini
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/TransactionController.php config/services.php tests/Feature/TelegramNotificationTest.php .env.example
git commit -m "feat: integrate telegram bot payment notifications triggered upon payment success simulation"
```
