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
                'address' => 'Jl. Gang Lombok No. 11, Purwodinatan, Semarang',
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
                'address' => 'Jl. Pemuda No. 52, Bangunharjo, Semarang',
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
                'address' => 'Jl. Brigjen Katamso No. 1, Karangtempel, Semarang',
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
                'address' => 'Jl. Tanjung No. 18A, Sekayu, Semarang',
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
                'address' => 'Jl. Dr. Cipto No. 12, Sarirejo, Semarang',
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
                'address' => 'Jl. Karanganyar No. 37, Brumbungan, Semarang',
                'lat' => -6.978589,
                'lng' => 110.426211,
                'price' => 15000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1519676864350-f8ecdf0b9858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Nasi & Lauk',
                'name' => 'Warteg Bahari Nakula',
                'desc' => 'Warteg andalan mahasiswa Udinus dengan beragam pilihan sayur dan lauk pauk harga ramah kantong.',
                'address' => 'Jl. Nakula I No. 10, Pendrikan Kidul, Semarang',
                'lat' => -6.9818,
                'lng' => 110.4088,
                'price' => 12000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1626200419111-3960a9f8cfa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Street Food',
                'name' => 'Tahu Gimbal Pak Edy Nakula',
                'desc' => 'Tahu gimbal premium dengan udang renyah berukuran besar dan kuah kacang kental yang wangi daun jeruk.',
                'address' => 'Jl. Nakula Raya No. 4, Pendrikan Kidul, Semarang',
                'lat' => -6.9825,
                'lng' => 110.4082,
                'price' => 20000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1519676864350-f8ecdf0b9858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Jajanan Tradisional',
                'name' => 'Ganjel Rel Pendrikan',
                'desc' => 'Roti tradisional khas Semarang bertekstur padat dengan wangi kayu manis dan taburan wijen melimpah.',
                'address' => 'Jl. Nakula II No. 8, Pendrikan Kidul, Semarang',
                'lat' => -6.9821,
                'lng' => 110.4098,
                'price' => 10000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1606525134707-88225585fe1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Restoran & Cafe',
                'name' => 'Bleu Chicken & Coffee Udinus',
                'desc' => 'Tempat nongkrong estetik mahasiswa dengan menu andalan olahan ayam mentega dan kopi susu gula aren.',
                'address' => 'Jl. Nakula Raya No. 45, Pendrikan Kidul, Semarang',
                'lat' => -6.9832,
                'lng' => 110.4075,
                'price' => 25000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1557142046-c704a3adf364?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Makanan Berkuah',
                'name' => 'Soto Ayam Khas Kudus Mbak Lin',
                'desc' => 'Soto Kudus otentik dengan mangkok kecil berisi kuah santan tipis gurih dan daging ayam suwir melimpah.',
                'address' => 'Jl. Imam Bonjol No. 175, Sekayu, Semarang',
                'lat' => -6.9810,
                'lng' => 110.4109,
                'price' => 18000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Mie Khas Daerah',
                'name' => 'Bakmi Jawa Nakula',
                'desc' => 'Bakmi jawa dimasak dengan anglo arang tradisional memberikan aroma smokey khas dengan kuah nyemek yang gurih.',
                'address' => 'Jl. Nakula Raya No. 12, Pendrikan Kidul, Semarang',
                'lat' => -6.9826,
                'lng' => 110.4089,
                'price' => 17000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Nasi & Lauk',
                'name' => 'Warmindo Imam Bonjol',
                'desc' => 'Tempat berkumpulnya mahasiswa Udinus 24 jam dengan sajian andalan Mie Dok-Dok pedas mantap.',
                'address' => 'Jl. Imam Bonjol No. 190, Sekayu, Semarang',
                'lat' => -6.9830,
                'lng' => 110.4115,
                'price' => 10000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1626200419111-3960a9f8cfa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Street Food',
                'name' => 'Penyetan Mas Ndut Nakula',
                'desc' => 'Aneka penyetan tempe, ayam, lele goreng dengan sambal korek pedas kemangi yang membakar lidah.',
                'address' => 'Jl. Nakula I No. 2, Pendrikan Kidul, Semarang',
                'lat' => -6.9815,
                'lng' => 110.4080,
                'price' => 15000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1519676864350-f8ecdf0b9858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Jajanan Tradisional',
                'name' => 'Lumpia Basah Nakula',
                'desc' => 'Lumpia isi rebung segar manis pedas gurih dengan saus kental khas Semarang, disajikan basah maupun goreng.',
                'address' => 'Jl. Nakula Raya No. 22, Pendrikan Kidul, Semarang',
                'lat' => -6.9829,
                'lng' => 110.4095,
                'price' => 12000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1606525134707-88225585fe1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Restoran & Cafe',
                'name' => 'Kopi Nakula',
                'desc' => 'Kedai kopi modern minimalist dengan area outdoor luas, andalan mahasiswa untuk mengerjakan tugas/project.',
                'address' => 'Jl. Nakula Raya No. 3A, Pendrikan Kidul, Semarang',
                'lat' => -6.9823,
                'lng' => 110.4079,
                'price' => 22000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1557142046-c704a3adf364?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Makanan Berkuah',
                'name' => 'Sop Empal Bu Hani',
                'desc' => 'Sop daging sapi berkuah kaldu gurih segar dengan potongan empal daging sapi bacem yang empuk manis.',
                'address' => 'Jl. Indraprasta No. 82, Pendrikan Lor, Semarang',
                'lat' => -6.9790,
                'lng' => 110.4070,
                'price' => 25000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Mie Khas Daerah',
                'name' => 'Bakmie Club Semarang',
                'desc' => 'Mie karet gurih dengan taburan daging ayam cincang madu merah dan kuah sup pangsit hangat.',
                'address' => 'Jl. Indraprasta No. 90, Pendrikan Lor, Semarang',
                'lat' => -6.9788,
                'lng' => 110.4082,
                'price' => 24000,
                'is_promoted' => true,
                'photo' => 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Nasi & Lauk',
                'name' => 'Nasi Pecel Yu Sri Indraprasta',
                'desc' => 'Pecel komplit dengan sayuran segar siram bumbu pecel manis gurih, disajikan dengan sate telur puyuh dan gorengan.',
                'address' => 'Jl. Indraprasta No. 64, Pendrikan Lor, Semarang',
                'lat' => -6.9795,
                'lng' => 110.4060,
                'price' => 14000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1626200419111-3960a9f8cfa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Street Food',
                'name' => 'Tahu Petis Prasojo Nakula',
                'desc' => 'Tahu pong goreng disajikan hangat dengan sisipan bumbu petis udang hitam manis yang gurih pekat.',
                'address' => 'Jl. Nakula Raya No. 1, Pendrikan Kidul, Semarang',
                'lat' => -6.9820,
                'lng' => 110.4072,
                'price' => 10000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1519676864350-f8ecdf0b9858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            [
                'cat' => 'Jajanan Tradisional',
                'name' => 'Roti Bakar Bandung Nakula',
                'desc' => 'Roti bakar porsi besar dengan berbagai rasa coklat, keju, tiramisu, andalan mahasiswa saat begadang kelompokan.',
                'address' => 'Jl. Nakula Raya No. 15, Pendrikan Kidul, Semarang',
                'lat' => -6.9825,
                'lng' => 110.4090,
                'price' => 16000,
                'is_promoted' => false,
                'photo' => 'https://images.unsplash.com/photo-1606525134707-88225585fe1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
        ];

        foreach ($spots as $s) {
            $cat = Category::firstOrCreate([
                'name' => $s['cat']
            ]);

            $spot = CulinarySpot::create([
                'category_id' => $cat->id,
                'owner_id' => $merchant->id,
                'name' => $s['name'],
                'description' => $s['desc'],
                'address' => $s['address'],
                'latitude' => $s['lat'],
                'longitude' => $s['lng'],
                'price' => $s['price'],
                'is_promoted' => $s['is_promoted'],
                'status' => 'approved',
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
