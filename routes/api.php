<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('throttle:api')->group(function () {
    // Analytics tracking (public, no auth needed)
    Route::post('/analytics', [AnalyticController::class, 'store']);

    // Reverse Geocode (Nominatim)
    Route::get('/geocode', [\App\Http\Controllers\Api\GeocodeController::class, 'reverse']);

    // Geofencing (Haversine Formula)
    Route::get('/nearby', [\App\Http\Controllers\Api\GeofenceController::class, 'nearby']);

    // Payment webhook simulation (mock)
    Route::get('/webhook/payment/simulate/{orderId}', [TransactionController::class, 'webhookSimulate']);
});

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // Collaborative Recommendation Engine
    Route::get('/recommendations', [\App\Http\Controllers\Api\RecommendationController::class, 'index']);
});
