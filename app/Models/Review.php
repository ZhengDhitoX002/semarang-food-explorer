<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Review extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $guarded = [];

    protected $appends = ['is_editable'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function culinarySpot()
    {
        return $this->belongsTo(CulinarySpot::class, 'spot_id');
    }

    /**
     * Check if review can still be edited (within 24 hours).
     */
    public function isEditable(): bool
    {
        return $this->created_at->diffInHours(now()) < 24;
    }

    public function getIsEditableAttribute(): bool
    {
        return $this->isEditable();
    }

    /**
     * Spatie Media Library: auto-convert review photos to WebP.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->format('webp');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('review_photos');
    }
}
