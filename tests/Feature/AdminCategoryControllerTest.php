<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminCategoryControllerTest extends TestCase
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

    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/categories', [
            'name' => 'Kopi Es'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', ['name' => 'Kopi Es']);
    }

    public function test_admin_can_update_category(): void
    {
        $category = Category::create(['name' => 'Minuman']);
        $response = $this->actingAs($this->admin)->put("/admin/categories/{$category->id}", [
            'name' => 'Minuman Dingin'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Minuman Dingin'
        ]);
    }

    public function test_admin_can_delete_category(): void
    {
        $category = Category::create(['name' => 'Cemilan']);
        $response = $this->actingAs($this->admin)->delete("/admin/categories/{$category->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
