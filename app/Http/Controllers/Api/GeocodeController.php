<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    /**
     * Reverse Geocoding via Nominatim
     *
     * Returns an address based on latitude and longitude coordinates.
     * Uses OpenStreetMap's Nominatim API.
     *
     * @queryParam lat required numeric The latitude coordinate. Example: -6.9932
     * @queryParam lng required numeric The longitude coordinate. Example: 110.4203
     */
    public function reverse(Request $request)
    {
        $request->validate([
            'lat' => ['required', 'numeric'],
            'lng' => ['required', 'numeric'],
        ]);

        $response = Http::withHeaders([
            'User-Agent' => 'SemarangFoodExplorer/1.0',
        ])->get('https://nominatim.openstreetmap.org/reverse', [
            'lat' => $request->lat,
            'lon' => $request->lng,
            'format' => 'json',
        ]);

        if ($response->successful()) {
            return response()->json([
                'success' => true,
                'data' => [
                    'address' => $response->json('display_name'),
                    'raw' => $response->json(),
                ],
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Geocoding failed'], 500);
    }
}
