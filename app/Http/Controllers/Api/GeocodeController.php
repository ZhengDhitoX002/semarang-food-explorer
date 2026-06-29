<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeocodeController extends Controller
{
    /**
     * Forward Geocoding via Nominatim
     *
     * Returns coordinates based on a query string address.
     * Uses OpenStreetMap's Nominatim API.
     *
     * @queryParam q required string The address search query. Example: Nakula
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => ['required', 'string', 'min:3']
        ]);

        $address = strtolower(trim($request->q));
        $cacheKey = 'geocode_' . md5($address);

        $data = Cache::remember($cacheKey, now()->addDay(), function () use ($address) {
            $response = Http::withHeaders([
                'User-Agent' => 'SemarangFoodExplorer/1.0 (contact@semarangfoodexplorer.test)'
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1
            ]);

            if ($response->successful() && count($response->json()) > 0) {
                $result = $response->json()[0];
                return [
                    'latitude' => (float)$result['lat'],
                    'longitude' => (float)$result['lon'],
                    'display_name' => $result['display_name']
                ];
            }

            return null;
        });

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan atau API bermasalah'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

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

        $cacheKey = 'reverse_geocode_' . md5($request->lat . '_' . $request->lng);

        $data = Cache::remember($cacheKey, now()->addDay(), function () use ($request) {
            $response = Http::withHeaders([
                'User-Agent' => 'SemarangFoodExplorer/1.0',
            ])->get('https://nominatim.openstreetmap.org/reverse', [
                'lat' => $request->lat,
                'lon' => $request->lng,
                'format' => 'json',
            ]);

            if ($response->successful()) {
                return [
                    'address' => $response->json('display_name'),
                    'raw' => $response->json(),
                ];
            }

            return null;
        });

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Geocoding failed'], 500);
    }
}
