<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnalyticSeeder extends Seeder
{
    public function run(): void
    {
        $spots = DB::table('culinary_spots')->pluck('id')->toArray();
        $events = ['view', 'click', 'view', 'view', 'click']; // views more common
        $ips = ['103.28.12.1', '36.72.15.20', '180.244.128.5', '114.124.200.10', '202.152.30.88'];

        foreach ($spots as $spotId) {
            // Generate 20-50 random events per spot over last 30 days
            $count = rand(20, 50);
            for ($i = 0; $i < $count; $i++) {
                DB::table('analytics')->insert([
                    'spot_id' => $spotId,
                    'event_type' => $events[array_rand($events)],
                    'ip_address' => $ips[array_rand($ips)],
                    'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
