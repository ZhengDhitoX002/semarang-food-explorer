<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\CulinarySpot;
use App\Notifications\PaymentConfirmationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Create a new promotion payment (mock).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spot_id' => ['required', 'exists:culinary_spots,id'],
            'package' => ['required', 'in:basic,premium,ultra'],
        ]);

        $amounts = [
            'basic' => 50000,
            'premium' => 150000,
            'ultra' => 300000,
        ];

        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'spot_id' => $validated['spot_id'],
            'order_id' => 'SFE-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'amount' => $amounts[$validated['package']],
        ]);

        // Hit Midtrans API to get snap_token
        $serverKey = config('services.midtrans.server_key');
        $isProduction = config('services.midtrans.is_production');
        $snapToken = null;

        if ($serverKey) {
            $midtransUrl = $isProduction 
                ? 'https://app.midtrans.com/snap/v1/transactions' 
                : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
            
            $response = Http::withBasicAuth($serverKey, '')
                ->post($midtransUrl, [
                    'transaction_details' => [
                        'order_id' => $transaction->order_id,
                        'gross_amount' => $transaction->amount,
                    ],
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email' => $request->user()->email,
                    ],
                ]);

            if ($response->successful()) {
                $snapToken = $response->json('token');
            } else {
                Log::error('Midtrans Snap Error: ' . $response->body());
                return redirect()->back()->withErrors(['message' => 'Gagal membuat transaksi di Payment Gateway.']);
            }
        } else {
            // Fallback for development if no Midtrans key
            $snapToken = 'mock_snap_token';
        }

        return redirect()->back()->with([
            'success' => 'Transaksi dibuat! Order ID: ' . $transaction->order_id,
            'transaction' => $transaction,
            'snap_token' => $snapToken,
            'midtrans_client_key' => config('services.midtrans.client_key'),
            'midtrans_is_production' => $isProduction,
            'payment_url' => '/transactions/' . $transaction->order_id . '/simulate-paid', // For mock simulation if Midtrans is skipped
        ]);
    }

    /**
     * Simulate payment webhook (sandbox/dev testing shortcut - marks a
     * transaction paid without a real Midtrans callback).
     *
     * Locked down three ways so it can never be used to fake a real payment:
     * only works while Midtrans is in sandbox mode, requires the caller to
     * be logged in, and only lets a user "pay" their own transaction.
     */
    public function webhookSimulate(Request $request, string $orderId)
    {
        if (config('services.midtrans.is_production')) {
            abort(404);
        }

        $transaction = Transaction::where('order_id', $orderId)
            ->where('user_id', $request->user()?->id)
            ->firstOrFail();

        if ($transaction->status === 'paid') {
            return response()->json(['message' => 'Already paid'], 200);
        }

        $this->handleSuccessfulPayment($transaction);

        return response()->json([
            'message' => 'Payment confirmed',
            'order_id' => $orderId,
            'status' => 'paid',
        ]);
    }

    /**
     * Midtrans Webhook Handler
     */
    public function webhookMidtrans(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        
        // Midtrans webhook sends order_id, status_code, gross_amount, and signature_key
        $signature = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($signature !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $transaction = Transaction::with(['user', 'culinarySpot'])->where('order_id', $request->order_id)->first();
        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $transactionStatus = $request->transaction_status;
        
        if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
            if ($transaction->status !== 'paid') {
                $this->handleSuccessfulPayment($transaction);
            }
        } elseif ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            $transaction->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'Webhook received'], 200);
    }

    /**
     * Centralized method to handle successful payment logic
     */
    private function handleSuccessfulPayment(Transaction $transaction)
    {
        // Update transaction status
        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update culinary spot to promoted
        if ($transaction->spot_id) {
            CulinarySpot::where('id', $transaction->spot_id)
                ->update(['is_promoted' => true]);
        }

        // Send notification (logs to laravel.log since MAIL_MAILER=log)
        if ($transaction->user) {
            $transaction->user->notify(new PaymentConfirmationNotification($transaction));
        }

        // Send Telegram notification if token and chat ID are configured
        $botToken = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if ($botToken && $chatId) {
            $spotName = $transaction->culinarySpot->name ?? 'Unknown Spot';
            $amountFormatted = number_format($transaction->amount, 0, ',', '.');
            $message = "🔔 <b>Pembayaran Sukses!</b>\n\n"
                    . "🏷️ <b>Order ID:</b> <code>{$transaction->order_id}</code>\n"
                    . "🏪 <b>Kuliner:</b> {$spotName}\n"
                    . "💰 <b>Jumlah:</b> Rp {$amountFormatted}\n"
                    . "👤 <b>User:</b> " . ($transaction->user->name ?? 'Unknown') . "\n"
                    . "📅 <b>Tanggal:</b> " . now()->format('Y-m-d H:i:s') . " WIB\n\n"
                    . "Status promosi toko ini telah diaktifkan menjadi ⭐ <b>Promoted</b>!";

            try {
                Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]);
            } catch (\Exception $e) {
                Log::error("Failed to send Telegram notification: " . $e->getMessage());
            }
        }
    }
}
