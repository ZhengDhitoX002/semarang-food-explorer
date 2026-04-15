<?php

namespace App\Http\Controllers;

use App\Models\Analytic;
use App\Models\CulinarySpot;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MerchantDashboardController extends Controller
{
    /**
     * Show merchant analytics dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get spots owned by this merchant (through transactions)
        $spotIds = Transaction::where('user_id', $user->id)
            ->where('status', 'paid')
            ->pluck('spot_id')
            ->unique();

        $spots = CulinarySpot::with('category')
            ->whereIn('id', $spotIds)
            ->get();

        // Analytics: views and clicks per day for last 30 days
        $analytics = Analytic::whereIn('spot_id', $spotIds)
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw("DATE(created_at) as date"),
                'event_type',
                DB::raw("COUNT(*) as count")
            )
            ->groupBy('date', 'event_type')
            ->orderBy('date')
            ->get();

        // Total stats
        $totalViews = Analytic::whereIn('spot_id', $spotIds)->where('event_type', 'view')->count();
        $totalClicks = Analytic::whereIn('spot_id', $spotIds)->where('event_type', 'click')->count();

        // Transaction history
        $transactions = Transaction::where('user_id', $user->id)
            ->with('culinarySpot')
            ->orderByDesc('created_at')
            ->get();

        // Average rating across all merchant spots
        $avgRating = CulinarySpot::whereIn('id', $spotIds)
            ->withAvg('reviews', 'rating')
            ->get()
            ->avg('reviews_avg_rating') ?? 0;

        return Inertia::render('Merchant/Dashboard', [
            'spots' => $spots,
            'analytics' => $analytics,
            'totalViews' => $totalViews,
            'totalClicks' => $totalClicks,
            'transactions' => $transactions,
            'avgRating' => round($avgRating, 1),
        ]);
    }
}
