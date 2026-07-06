<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\CulinarySpot;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;

class TelegramNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_telegram_notification_is_sent_on_successful_payment(): void
    {
        // Fake HTTP client to intercept Telegram API call
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true], 200),
        ]);

        // Configure Telegram config values mockingly
        config([
            'services.telegram.bot_token' => 'mock_bot_token',
            'services.telegram.chat_id' => 'mock_chat_id',
        ]);

        $merchant = User::factory()->create(['role' => 'merchant']);
        $category = Category::create(['name' => 'Restoran']);
        $spot = CulinarySpot::create([
            'name' => 'Lumpia Special',
            'latitude' => -6.9822,
            'longitude' => 110.4091,
            'price' => 25000,
            'category_id' => $category->id,
            'is_promoted' => false,
        ]);

        $transaction = Transaction::create([
            'user_id' => $merchant->id,
            'spot_id' => $spot->id,
            'order_id' => 'SFE-TESTING',
            'status' => 'pending',
            'amount' => 150000,
        ]);

        // Trigger the simulation webhook as the transaction's owner
        // (this endpoint now requires auth + ownership + sandbox mode).
        $response = $this->actingAs($merchant)->get("/transactions/SFE-TESTING/simulate-paid");
        $response->assertStatus(200);

        // Verify HTTP fake recorded a request to Telegram API
        Http::assertSent(function ($request) {
            return Str::startsWith($request->url(), 'https://api.telegram.org/botmock_bot_token/sendMessage')
                && $request['chat_id'] === 'mock_chat_id'
                && str_contains($request['text'], 'SFE-TESTING')
                && str_contains($request['text'], 'Lumpia Special')
                && str_contains($request['text'], 'Rp 150.000');
        });
    }
}
