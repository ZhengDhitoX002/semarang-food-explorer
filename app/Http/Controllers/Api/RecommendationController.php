<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CulinarySpot;
use App\Models\Review;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * AI-Powered Recommendations
     *
     * Collaborative filtering logic that analyzes user's high-rated
     * previous reviews to suggest new, unvisited spots in the same categories.
     * Requires authentication via Sanctum.
     *
     * @response {"success":true,"type":"collaborative","data":[{"id":1,"name":"Tahu Gimbal"}]}
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Get categories where user gave a rating of 4 or 5
        $highRatedReviews = Review::with('culinarySpot')
            ->where('user_id', $user->id)
            ->where('rating', '>=', 4)
            ->get();

        // If not enough data, fallback to generic highly rated spots
        if ($highRatedReviews->isEmpty()) {
            $genericRecommendations = CulinarySpot::with('category')
                ->where('average_rating', '>=', 4.5)
                ->orderByDesc('review_count')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'type' => 'generic',
                'data' => $genericRecommendations,
            ]);
        }

        $preferredCategoryIds = $highRatedReviews
            ->map(fn($r) => $r->culinarySpot->category_id)
            ->unique()
            ->values()
            ->toArray();

        // 2. Find spots in preferred categories that the user hasn't reviewed yet
        $reviewedSpotIds = Review::where('user_id', $user->id)->pluck('culinary_spot_id')->toArray();

        $recommendations = CulinarySpot::with('category')
            ->whereIn('category_id', $preferredCategoryIds)
            ->whereNotIn('id', $reviewedSpotIds)
            ->orderByDesc('average_rating')
            ->orderByDesc('review_count')
            ->limit(5)
            ->get();

        // Fallback to generic if still empty
        if ($recommendations->isEmpty()) {
            $genericRecommendations = CulinarySpot::with('category')
                ->where('average_rating', '>=', 4.5)
                ->orderByDesc('review_count')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'type' => 'generic',
                'data' => $genericRecommendations,
            ]);
        }

        return response()->json([
            'success' => true,
            'type' => 'collaborative',
            'data' => $recommendations,
        ]);
    }
}
