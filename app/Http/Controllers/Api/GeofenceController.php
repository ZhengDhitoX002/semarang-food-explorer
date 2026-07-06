<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CulinarySpot;
use Illuminate\Http\Request;

class GeofenceController extends Controller
{
    /**
     * Geofencing Proximity Alerts
     *
     * Finds nearby culinary spots within a given radius using the Haversine formula.
     *
     * @queryParam lat required numeric User's current latitude. Example: -6.9822
     * @queryParam lng required numeric User's current longitude. Example: 110.4180
     * @queryParam radius numeric Search radius in meters. Default: 5000. Example: 3000
     */
    public function nearby(Request $request)
    {
        $request->validate([
            'lat' => ['required', 'numeric'],
            'lng' => ['required', 'numeric'],
            'radius' => ['nullable', 'numeric', 'max:50000'],
        ]);

        $lat = $request->lat;
        $lng = $request->lng;
        // Default radius 5km
        $radius = $request->radius ?? 5000;

        /**
         * Haversine query to calculate distances.
         */
        $haversine = \App\Libraries\GeofenceLibrary::getHaversineSql($lat, $lng);

        $spots = CulinarySpot::select('*')
            ->with(['media', 'category'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->selectRaw("{$haversine} AS distance")
            ->whereRaw("{$haversine} < ?", [$radius])
            ->orderBy('distance')
            ->get();

        // Use helper to format distance
        $spots->transform(function ($spot) {
            $spot->formatted_distance = \App\Helpers\FormatHelper::distance($spot->distance);
            $spot->average_rating = round($spot->reviews_avg_rating ?? 0, 1);
            $spot->review_count = $spot->reviews_count ?? 0;
            return $spot;
        });

        return response()->json([
            'success' => true,
            'count' => $spots->count(),
            'radius_meters' => $radius,
            'data' => $spots,
        ]);
    }
}
