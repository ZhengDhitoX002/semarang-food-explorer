<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\CulinarySpot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CulinarySpotClosureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_report_closure(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $category = Category::create(['name' => 'Restoran']);
        
        $spot = CulinarySpot::create([
            'name' => 'Toko Enak',
            'description' => 'Enak sekali',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 15000,
            'category_id' => $category->id,
            'status' => 'approved'
        ]);

        $response = $this->actingAs($user)->post("/spot/{$spot->id}/report-close", [
            'reason' => 'Ruko dibongkar dan tutup selamanya'
        ]);

        $response->assertRedirect();
        
        $spot->refresh();
        $this->assertEquals('pending_close', $spot->status);
        $this->assertEquals('Ruko dibongkar dan tutup selamanya', $spot->closed_reason);
    }

    public function test_admin_can_approve_closure_report(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Restoran']);
        
        $spot = CulinarySpot::create([
            'name' => 'Toko Bangkrut',
            'description' => 'Enak sekali',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 15000,
            'category_id' => $category->id,
            'status' => 'pending_close',
            'closed_reason' => 'Bangkrut karena sepi'
        ]);

        $response = $this->actingAs($admin)->post("/admin/spots/{$spot->id}/close", [
            'reason' => $spot->closed_reason
        ]);

        $response->assertRedirect();

        $spot->refresh();
        $this->assertEquals('closed', $spot->status);
        $this->assertEquals('Bangkrut karena sepi', $spot->closed_reason);
    }

    public function test_admin_can_reject_closure_report(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Restoran']);
        
        $spot = CulinarySpot::create([
            'name' => 'Toko Masih Buka',
            'description' => 'Enak sekali',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 15000,
            'category_id' => $category->id,
            'status' => 'pending_close',
            'closed_reason' => 'Laporan palsu'
        ]);

        // Rejects by approving (restoring to approved status)
        $response = $this->actingAs($admin)->post("/admin/spots/{$spot->id}/approve");

        $response->assertRedirect();

        $spot->refresh();
        $this->assertEquals('approved', $spot->status);
    }
}
