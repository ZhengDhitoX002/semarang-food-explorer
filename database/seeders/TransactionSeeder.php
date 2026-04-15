<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $merchants = DB::table('users')->where('role', 'merchant')->pluck('id')->toArray();
        $spots = DB::table('culinary_spots')->where('is_promoted', true)->pluck('id')->toArray();

        $packages = [
            ['name' => 'Basic Promo', 'amount' => 50000],
            ['name' => 'Premium Promo', 'amount' => 150000],
            ['name' => 'Ultra Promo', 'amount' => 300000],
        ];

        foreach ($spots as $index => $spotId) {
            $pkg = $packages[$index % count($packages)];
            DB::table('transactions')->insert([
                'user_id' => $merchants[$index % count($merchants)],
                'spot_id' => $spotId,
                'order_id' => 'SFE-' . strtoupper(Str::random(8)),
                'status' => 'paid',
                'amount' => $pkg['amount'],
                'paid_at' => now()->subDays(rand(1, 15)),
                'created_at' => now()->subDays(rand(15, 30)),
                'updated_at' => now(),
            ]);
        }

        // One pending transaction
        DB::table('transactions')->insert([
            'user_id' => $merchants[0] ?? 2,
            'spot_id' => $spots[0] ?? 1,
            'order_id' => 'SFE-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'amount' => 150000,
            'paid_at' => null,
            'created_at' => now()->subDays(1),
            'updated_at' => now(),
        ]);
    }
}
