<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytic extends Model
{
    protected $guarded = [];

    public function culinarySpot()
    {
        return $this->belongsTo(CulinarySpot::class, 'spot_id');
    }
}
