<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\CulinarySpot;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CulinarySpotAddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_save_spot_with_address(): void
    {
        $category = Category::create(['name' => 'Warteg']);
        $spot = CulinarySpot::create([
            'category_id' => $category->id,
            'name' => 'Warteg Udinus',
            'description' => 'Warteg murah dekat Udinus',
            'address' => 'Jl. Nakula I No. 5, Semarang',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 15000,
        ]);

        $this->assertDatabaseHas('culinary_spots', [
            'id' => $spot->id,
            'address' => 'Jl. Nakula I No. 5, Semarang'
        ]);
    }
}
