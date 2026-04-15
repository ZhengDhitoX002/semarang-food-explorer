<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function culinarySpot()
    {
        return $this->belongsTo(CulinarySpot::class, 'spot_id');
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
