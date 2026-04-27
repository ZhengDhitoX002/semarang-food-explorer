<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'Halal',
            'Murah',
            'WiFi Gratis',
            'AC',
            'Area Parkir',
            'Outdoor',
            'Live Music',
            'Pet Friendly',
            '24 Jam',
            'Ramah Anak',
            'Takeaway',
            'Dine In',
            'Seafood',
            'Vegetarian',
            'Pedas',
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['slug' => Str::slug($tag)],
                ['name' => $tag]
            );
        }
    }
}
