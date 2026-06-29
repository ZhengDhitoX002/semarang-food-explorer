<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Tag;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminTagControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);
    }

    public function test_admin_can_create_tag(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/tags', [
            'name' => 'WiFi Cepat'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tags', ['name' => 'WiFi Cepat']);
    }

    public function test_admin_can_delete_tag(): void
    {
        $tag = Tag::create(['name' => 'AC Dingin', 'slug' => 'ac-dingin']);
        $response = $this->actingAs($this->admin)->delete("/admin/tags/{$tag->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
    }
}
