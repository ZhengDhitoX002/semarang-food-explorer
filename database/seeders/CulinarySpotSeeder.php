<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CulinarySpotSeeder extends Seeder
{
    public function run(): void
    {
        $categories = DB::table('categories')->get();

        DB::table('culinary_spots')->insert([
            [
                'category_id' => $categories->where('name', 'Lumpia')->first()->id ?? 1,
                'name' => 'Lumpia Gang Lombok',
                'description' => 'Lumpia tertua dan legendaris di kawasan Pecinan, Semarang.',
                'latitude' => -6.974550,
                'longitude' => 110.428450,
                'price' => 20000.00,
                'is_promoted' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $categories->where('name', 'Bandeng')->first()->id ?? 2,
                'name' => 'Bandeng Presto Juwana Elrina',
                'description' => 'Pusat oleh-oleh khas Semarang di jalan Pandanaran.',
                'latitude' => -6.984090,
                'longitude' => 110.415080,
                'price' => 150000.00,
                'is_promoted' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $categories->where('name', 'Tahu Gimbal')->first()->id ?? 3,
                'name' => 'Tahu Gimbal Pak Edy',
                'description' => 'Tahu gimbal legendaris di sekitar Taman Indonesia Kaya / Menteri Supeno.',
                'latitude' => -6.992680,
                'longitude' => 110.421570,
                'price' => 25000.00,
                'is_promoted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $categories->where('name', 'Wingko')->first()->id ?? 4,
                'name' => 'Wingko Babat Cap Kereta Api',
                'description' => 'Wingko asli dari Semarang dekat stasiun Tawang.',
                'latitude' => -6.964400,
                'longitude' => 110.428310,
                'price' => 45000.00,
                'is_promoted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_id' => $categories->where('name', 'Seafood')->first()->id ?? 5,
                'name' => 'Seafood Pak Sangklak',
                'description' => 'Seafood segar terkenal di area Marina Semarang pinggir pantai.',
                'latitude' => -6.953040,
                'longitude' => 110.388830,
                'price' => 80000.00,
                'is_promoted' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
