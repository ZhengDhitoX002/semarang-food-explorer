<?php

namespace App\Http\Controllers;

use App\Models\CulinarySpot;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()->favorites()
            ->with(['culinarySpot' => function($query) {
                $query->with('category')->withAvg('reviews', 'rating')->withCount('reviews');
            }])
            ->get()
            ->map(function($favorite) {
                $spot = $favorite->culinarySpot;
                $spot->average_rating = round($spot->reviews_avg_rating ?? 0, 1);
                $spot->review_count = $spot->reviews_count ?? 0;
                return $spot;
            });

        return Inertia::render('Favorites', [
            'favorites' => $favorites
        ]);
    }

    public function toggle(Request $request, $id)
    {
        $spot = CulinarySpot::findOrFail($id);
        $user = $request->user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('culinary_spot_id', $spot->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return back()->with('success', 'Dihapus dari Favorit');
        }

        Favorite::create([
            'user_id' => $user->id,
            'culinary_spot_id' => $spot->id
        ]);

        return back()->with('success', 'Ditambahkan ke Favorit');
    }
}
