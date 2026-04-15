<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = DB::table('users')->where('role', 'user')->pluck('id')->toArray();
        $spots = DB::table('culinary_spots')->pluck('id')->toArray();

        $reviews = [
            // Lumpia Gang Lombok (spot 1)
            ['user_id' => $users[0] ?? 4, 'spot_id' => $spots[0] ?? 1, 'rating' => 5, 'comment' => 'Lumpia terenak yang pernah saya coba! Kulitnya renyah, isinya melimpah. Wajib coba kalau ke Semarang.', 'is_verified' => true],
            ['user_id' => $users[1] ?? 5, 'spot_id' => $spots[0] ?? 1, 'rating' => 4, 'comment' => 'Rasanya otentik banget, tapi antrinya lumayan panjang di akhir pekan.', 'is_verified' => true],
            ['user_id' => $users[2] ?? 6, 'spot_id' => $spots[0] ?? 1, 'rating' => 5, 'comment' => 'Sudah turun temurun sejak nenek saya! Rasa tidak pernah berubah, tetap juara.', 'is_verified' => true],

            // Bandeng Presto (spot 2)
            ['user_id' => $users[0] ?? 4, 'spot_id' => $spots[1] ?? 2, 'rating' => 4, 'comment' => 'Bandeng prestonya empuk dan gurih. Cocok untuk oleh-oleh. Packaging rapi.', 'is_verified' => true],
            ['user_id' => $users[3] ?? 7, 'spot_id' => $spots[1] ?? 2, 'rating' => 5, 'comment' => 'Beli untuk keluarga besar di Jakarta, semua suka! Harga sangat bersahabat.', 'is_verified' => true],

            // Tahu Gimbal (spot 3)
            ['user_id' => $users[1] ?? 5, 'spot_id' => $spots[2] ?? 3, 'rating' => 5, 'comment' => 'Tahu gimbalnya mantap! Bumbu kacangnya pas, udangnya segar. Porsi besar.', 'is_verified' => true],
            ['user_id' => $users[4] ?? 8, 'spot_id' => $spots[2] ?? 3, 'rating' => 4, 'comment' => 'Tempatnya sederhana tapi rasanya luar biasa. Harga sangat terjangkau.', 'is_verified' => true],
            ['user_id' => $users[2] ?? 6, 'spot_id' => $spots[2] ?? 3, 'rating' => 3, 'comment' => 'Rasanya oke tapi hari itu kurang fresh udangnya. Mungkin kurang beruntung.', 'is_verified' => false],

            // Wingko Babat (spot 4)
            ['user_id' => $users[3] ?? 7, 'spot_id' => $spots[3] ?? 4, 'rating' => 4, 'comment' => 'Wingko babatnya legit! Rasa kelapa dan gula merahnya pas. Cocok buat oleh-oleh.', 'is_verified' => true],
            ['user_id' => $users[0] ?? 4, 'spot_id' => $spots[3] ?? 4, 'rating' => 5, 'comment' => 'Classic Semarang! Beli langsung di dekat Stasiun Tawang, masih hangat. Mantap!', 'is_verified' => true],

            // Seafood Pak Sangklak (spot 5)
            ['user_id' => $users[4] ?? 8, 'spot_id' => $spots[4] ?? 5, 'rating' => 5, 'comment' => 'View lautnya keren plus seafoodnya segar banget! Kepiting sausnya juara.', 'is_verified' => true],
            ['user_id' => $users[1] ?? 5, 'spot_id' => $spots[4] ?? 5, 'rating' => 4, 'comment' => 'Tempatnya luas dan bersih. Ikan bakarnya enak, sambalnya nampol. Recommended!', 'is_verified' => true],
            ['user_id' => $users[2] ?? 6, 'spot_id' => $spots[4] ?? 5, 'rating' => 4, 'comment' => 'Agak jauh dari pusat kota tapi worth it. Sunset dinner di sini romantis banget.', 'is_verified' => true],
        ];

        foreach ($reviews as $review) {
            DB::table('reviews')->insert(array_merge($review, [
                'created_at' => now()->subDays(rand(1, 90)),
                'updated_at' => now(),
            ]));
        }
    }
}
