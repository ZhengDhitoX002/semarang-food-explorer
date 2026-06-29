<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeocodeControllerTest extends TestCase
{
    public function test_geocode_search_returns_coordinates_and_caches_result(): void
    {
        Cache::flush();

        Http::fake([
            'nominatim.openstreetmap.org/*' => Http::response([
                [
                    'lat' => '-6.9822',
                    'lon' => '110.4091',
                    'display_name' => 'Nakula Street, Semarang'
                ]
            ], 200)
        ]);

        $response = $this->getJson('/api/geocode/search?q=Nakula');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'latitude' => -6.9822,
                    'longitude' => 110.4091,
                ]
            ]);

        // Verifikasi hasil di-cache
        $this->assertTrue(Cache::has('geocode_' . md5('nakula')));
    }
}
