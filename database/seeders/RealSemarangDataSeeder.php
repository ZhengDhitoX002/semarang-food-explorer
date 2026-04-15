<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CulinarySpot;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RealSemarangDataSeeder extends Seeder
{
    public function run(): void
    {
        // Setup Merchant User for assigning ownership
        $merchant = User::firstOrCreate(
            ['email' => 'admin_legendaris@semarangfood.com'],
            [
                'name' => 'Admin Legendaris',
                'password' => bcrypt('password'),
                'role' => 'merchant'
            ]
        );

        $spots = [
            [
                'cat' => 'Jajanan Tradisional',
                'name' => 'Lumpia Gang Lombok',
                'desc' => 'Salah satu pelopor lumpia di Semarang yang sudah ada sejak tahun 1870-an. Resep rahasia rebung yang tidak berbau pesing.',
                'lat' => -6.974911,
                'lng' => 110.428574,
                'price' => 20000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1606525134707-88225585fe1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Restoran Kolonial',
                'name' => 'Toko Oen Semarang',
                'desc' => 'Restoran dan toko roti bergaya kolonial Belanda yang berdiri sejak 1936, terkenal dengan es krim dan menu klasiknya.',
                'lat' => -6.978486,
                'lng' => 110.421528,
                'price' => 50000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1557142046-c704a3adf364?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Makanan Berkuah',
                'name' => 'Soto Bangkong',
                'desc' => 'Soto ayam dengan kuah bening yang legendaris dan sudah populer sejak tahun 1950-an. Memiliki keunikan kecap produksinya sendiri.',
                'lat' => -6.993043,
                'lng' => 110.435773,
                'price' => 25000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Mie Khas Daerah',
                'name' => 'Mie Kopyok Pak Dhuwur',
                'desc' => 'Kuliner mie khas dengan paduan tahu, tauge, lontong dan taburan kerupuk karak gendar yang sudah ada sejak tahun 1970.',
                'lat' => -6.985651,
                'lng' => 110.413200,
                'price' => 15000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Nasi & Lauk',
                'name' => 'Nasi Gandul Pak Memet',
                'desc' => 'Kuliner nasi khas Pati dengan kuah gurih dan potongan daging sapi yang empuk, beroperasi di Cipto, Semarang sejak tahun 1990.',
                'lat' => -6.986629,
                'lng' => 110.441031,
                'price' => 30000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1626200419111-3960a9f8cfa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Street Food',
                'name' => 'Lekker Paimo',
                'desc' => 'Jajanan lekker legendaris depan SMA Loyola dengan beragam varian topping unik seperti Sosis Mozarella yang sudah ada sejak 1978.',
                'lat' => -6.978589,
                'lng' => 110.426211,
                'price' => 15000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1519676864350-f8ecdf0b9858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
        ];

        foreach ($spots as $s) {
            $cat = Category::firstOrCreate([
                'name' => $s['cat']
            ]);

            $spot = CulinarySpot::create([
                'category_id' => $cat->id,
                'name' => $s['name'],
                'description' => $s['desc'],
                'latitude' => $s['lat'],
                'longitude' => $s['lng'],
                'price' => $s['price'],
                'is_promoted' => $s['is_promoted'],
            ]);

            // Using Spatie AddMediaFromUrl
            try {
                $spot->addMediaFromUrl($s['photo'])
                    ->toMediaCollection('photos');
            } catch (\Exception $e) {
                // If network fails downloading mock image, fallback silently.
            }
        }
    }
}
