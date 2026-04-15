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
});

/*
|--------------------------------------------------------------------------
| Merchant Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:merchant,admin'])->prefix('merchant')->group(function () {
    Route::get('/dashboard', [MerchantDashboardController::class, 'index'])->name('merchant.dashboard');
    Route::get('/promotion', function () {
        $spots = \App\Models\CulinarySpot::select('id', 'name')->get();
        return \Inertia\Inertia::render('Merchant/Promotion', [
            'spots' => $spots
        ]);
    })->name('merchant.promotion');
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
