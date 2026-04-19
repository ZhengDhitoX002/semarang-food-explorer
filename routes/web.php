<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CulinarySpotController;
use App\Http\Controllers\MerchantDashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [CulinarySpotController::class, 'index']);
Route::get('/spot/{id}', [CulinarySpotController::class, 'show']);

// Navigation pages (Favorites, Orders, Profile)
Route::get('/favorites', [\App\Http\Controllers\FavoriteController::class, 'index'])->name('favorites');

Route::get('/orders', function () {
    return \Inertia\Inertia::render('Orders');
})->name('orders');

Route::get('/profile', function () {
    return \Inertia\Inertia::render('Profile');
})->name('profile');

/*
|--------------------------------------------------------------------------
| Auth Routes (Guest Only)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Transactions (Promoted Culinary)
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');

    // Favorites
    Route::post('/favorites/{id}', [\App\Http\Controllers\FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Profile Management
    Route::get('/profile/edit', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/security', [\App\Http\Controllers\ProfileController::class, 'security'])->name('profile.security');
    Route::put('/profile/password', [\App\Http\Controllers\ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::get('/profile/notifications', [\App\Http\Controllers\ProfileController::class, 'notifications'])->name('profile.notifications');
    Route::get('/profile/help', [\App\Http\Controllers\ProfileController::class, 'help'])->name('profile.help');
});

/*
|--------------------------------------------------------------------------
| Merchant Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:merchant,admin'])->prefix('merchant')->group(function () {
    // Dashboard
    Route::get('/dashboard', [MerchantDashboardController::class, 'index'])->name('merchant.dashboard');

    // My Shops
    Route::get('/shops', [MerchantDashboardController::class, 'shops'])->name('merchant.shops');

    // Register New Shop
    Route::get('/shop/create', [MerchantDashboardController::class, 'createShop'])->name('merchant.shop.create');
    Route::post('/shop', [MerchantDashboardController::class, 'storeShop'])->name('merchant.shop.store');

    // Edit Shop
    Route::get('/shop/{id}/edit', [MerchantDashboardController::class, 'editShop'])->name('merchant.shop.edit');
    Route::put('/shop/{id}', [MerchantDashboardController::class, 'updateShop'])->name('merchant.shop.update');

    // Promotion
    Route::get('/promotion', [MerchantDashboardController::class, 'promotion'])->name('merchant.promotion');

    // Payments History
    Route::get('/payments', [MerchantDashboardController::class, 'payments'])->name('merchant.payments');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/spots', [CulinarySpotController::class, 'store'])->name('admin.spots.store');
    Route::put('/spots/{id}', [CulinarySpotController::class, 'update'])->name('admin.spots.update');
});
