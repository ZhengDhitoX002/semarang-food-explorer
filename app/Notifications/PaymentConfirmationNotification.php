<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmationNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Transaction $transaction
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     * (Will be logged to storage/logs/laravel.log since MAIL_MAILER=log)
     */
    public function toMail(object $notifiable): MailMessage
    {
        $spot = $this->transaction->culinarySpot;

        return (new MailMessage)
            ->subject('Pembayaran Promosi Berhasil — Semarang Food Explorer')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Pembayaran promosi untuk **' . ($spot->name ?? 'toko Anda') . '** telah berhasil diverifikasi.')
            ->line('Detail Transaksi:')
            ->line('- Order ID: ' . $this->transaction->order_id)
            ->line('- Jumlah: Rp ' . number_format($this->transaction->amount, 0, ',', '.'))
            ->line('- Status: **PAID** ✅')
            ->line('- Waktu Bayar: ' . $this->transaction->paid_at->format('d M Y H:i'))
            ->action('Lihat Dashboard', url('/merchant/dashboard'))
            ->line('Toko Anda kini tampil sebagai **Promoted** di halaman utama! Terima kasih telah menggunakan Semarang Food Explorer.');
    }

    /**
     * Get the array representation of the notification (stored in DB).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'order_id' => $this->transaction->order_id,
            'amount' => $this->transaction->amount,
            'spot_name' => $this->transaction->culinarySpot->name ?? '',
            'message' => 'Pembayaran promosi berhasil!',
        ];
    }
}
