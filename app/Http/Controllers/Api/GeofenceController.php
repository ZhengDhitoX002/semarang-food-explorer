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
         * Earth's radius in meters ~ 6371000
         */
        $haversine = "(6371000 * acos(cos(radians($lat)) 
            * cos(radians(latitude)) 
            * cos(radians(longitude) - radians($lng)) 
            + sin(radians($lat)) 
            * sin(radians(latitude))))";

        $spots = CulinarySpot::select('*')
            ->selectRaw("{$haversine} AS distance")
            ->whereRaw("{$haversine} < ?", [$radius])
            ->orderBy('distance')
            ->get();

        return response()->json([
            'success' => true,
            'count' => $spots->count(),
            'radius_meters' => $radius,
            'data' => $spots,
        ]);
    }
}
