<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\CulinarySpot;
use App\Notifications\PaymentConfirmationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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

        // In production, this would redirect to Midtrans/Xendit payment page.
        // For mock, we return the transaction data with a simulated payment URL.
        return redirect()->back()->with([
            'success' => 'Transaksi dibuat! Order ID: ' . $transaction->order_id,
            'transaction' => $transaction,
            'payment_url' => '/api/webhook/payment/simulate/' . $transaction->order_id,
        ]);
    }

    /**
     * Simulate payment webhook (mock for development).
     * In production, this would be called by Midtrans/Xendit.
     */
    public function webhookSimulate(string $orderId)
    {
        $transaction = Transaction::where('order_id', $orderId)->firstOrFail();

        if ($transaction->status === 'paid') {
            return response()->json(['message' => 'Already paid'], 200);
        }

        // Update transaction status
        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Update culinary spot to promoted
        CulinarySpot::where('id', $transaction->spot_id)
            ->update(['is_promoted' => true]);

        // Send notification (logs to laravel.log since MAIL_MAILER=log)
        $transaction->user->notify(new PaymentConfirmationNotification($transaction));

        return response()->json([
            'message' => 'Payment confirmed',
            'order_id' => $orderId,
            'status' => 'paid',
        ]);
    }
}
