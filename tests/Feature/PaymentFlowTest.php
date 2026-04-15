<?php

use App\Models\User;
use App\Models\CulinarySpot;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('merchant can simulate payment via transaction endpoint', function () {
    $merchant = User::factory()->create(['role' => 'merchant']);
    $category = Category::create(['name' => 'Test']);
    $spot = CulinarySpot::create([
        'name' => 'Toko Test',
        'latitude' => -6,
        'longitude' => 110,
        'price' => 50000,
        'category_id' => $category->id,
        'is_promoted' => false,
    ]);

    $response = $this->actingAs($merchant)->post('/transactions', [
        'spot_id' => $spot->id,
        'package' => 'premium',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('payment_url');

    $paymentUrl = session('payment_url');

    // Call checkout simulation webhook
    $webhookResponse = $this->actingAs($merchant)->get($paymentUrl);
    $webhookResponse->assertStatus(200);

    // Verify promotion is active
    $spot->refresh();
    expect($spot->is_promoted)->toBeTrue();
});
