<?php

use App\Models\User;
use App\Models\Category;
use App\Models\CulinarySpot;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('average rating and review count is computed correctly', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $category = Category::create(['name' => 'Test']);
    $spot = CulinarySpot::create([
        'name' => 'Toko',
        'latitude' => -6,
        'longitude' => 110,
        'price' => 50000,
        'category_id' => $category->id,
        'is_promoted' => false,
    ]);

    Review::create([
        'spot_id' => $spot->id,
        'user_id' => $user1->id,
        'rating' => 4,
        'content' => 'Great!',
    ]);

    Review::create([
        'spot_id' => $spot->id,
        'user_id' => $user2->id,
        'rating' => 5,
        'content' => 'Perfect!',
    ]);

    $spot->refresh();

    expect($spot->review_count)->toBe(2);
    expect((float) $spot->average_rating)->toBe(4.5);
});
