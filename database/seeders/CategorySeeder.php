<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Lumpia', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bandeng', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tahu Gimbal', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Wingko', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Seafood', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
