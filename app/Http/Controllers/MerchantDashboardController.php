<?php

namespace App\Http\Controllers;

use App\Models\Analytic;
use App\Models\Category;
use App\Models\CulinarySpot;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MerchantDashboardController extends Controller
{
    /**
     * Merchant analytics dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $spots = $this->getMerchantSpots($user);
        $spotIds = $spots->pluck('id');

        $analytics = Analytic::whereIn('spot_id', $spotIds)
            ->where('created_at', '>=', now()->subDays(30))
            ->select(DB::raw("DATE(created_at) as date"), 'event_type', DB::raw("COUNT(*) as count"))
            ->groupBy('date', 'event_type')
            ->orderBy('date')
            ->get();

        $totalViews = Analytic::whereIn('spot_id', $spotIds)->where('event_type', 'view')->count();
        $totalClicks = Analytic::whereIn('spot_id', $spotIds)->where('event_type', 'click')->count();

        $transactions = Transaction::where('user_id', $user->id)
            ->with('culinarySpot')
            ->orderByDesc('created_at')
            ->get();

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

    /**
     * List merchant's shops.
     */
    public function shops(Request $request)
    {
        $shops = $this->getMerchantSpots($request->user());

        return Inertia::render('Merchant/MyShops', [
            'shops' => $shops,
        ]);
    }

    /**
     * Show create shop form.
     */
    public function createShop()
    {
        return Inertia::render('Merchant/RegisterShop', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Store a new shop.
     */
    public function storeShop(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'operating_hours' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:5120',
        ]);

        $spot = CulinarySpot::create([
            'owner_id' => $request->user()->id,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price' => $validated['price'],
            'is_promoted' => false,
        ]);

        // Upload photo if provided
        if ($request->hasFile('photo')) {
            $spot->addMediaFromRequest('photo')
                ->toMediaCollection('photos');
        }

        return redirect()->route('merchant.shops')->with('success', 'Toko berhasil didaftarkan!');
    }

    /**
     * Show edit shop form.
     */
    public function editShop(Request $request, int $id)
    {
        $spot = CulinarySpot::where('id', $id)
            ->where('owner_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('Merchant/RegisterShop', [
            'categories' => Category::all(['id', 'name']),
            'shop' => $spot,
        ]);
    }

    /**
     * Update a shop.
     */
    public function updateShop(Request $request, int $id)
    {
        $spot = CulinarySpot::where('id', $id)
            ->where('owner_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price' => 'required|numeric|min:0',
            'address' => 'nullable|string|max:500',
            'operating_hours' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'photo' => 'nullable|image|max:5120',
        ]);

        $spot->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price' => $validated['price'],
        ]);

        if ($request->hasFile('photo')) {
            $spot->clearMediaCollection('photos');
            $spot->addMediaFromRequest('photo')
                ->toMediaCollection('photos');
        }

        return redirect()->route('merchant.shops')->with('success', 'Toko berhasil diperbarui!');
    }

    /**
     * Show promotion purchase page (show only merchant's own shops).
     */
    public function promotion(Request $request)
    {
        $spots = $this->getMerchantSpots($request->user(), ['id', 'name']);

        return Inertia::render('Merchant/Promotion', [
            'spots' => $spots,
        ]);
    }

    /**
     * Show payments history.
     */
    public function payments(Request $request)
    {
        $transactions = Transaction::where('user_id', $request->user()->id)
            ->with('culinarySpot')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Merchant/Payments', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get culinary spots owned by the merchant.
     * Falls back to spots linked via paid transactions for backward compatibility.
     */
    private function getMerchantSpots($user, array $columns = ['*'])
    {
        // Primary: spots directly owned by this merchant
        $ownedSpots = CulinarySpot::where('owner_id', $user->id);

        if ($ownedSpots->count() > 0) {
            return $ownedSpots->with('category')->get($columns);
        }

        // Fallback: spots linked via paid transactions (backward compat)
        $spotIds = Transaction::where('user_id', $user->id)
            ->where('status', 'paid')
            ->pluck('spot_id')
            ->unique();

        return CulinarySpot::with('category')
            ->whereIn('id', $spotIds)
            ->get($columns);
    }
}
