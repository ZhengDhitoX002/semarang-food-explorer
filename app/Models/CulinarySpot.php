<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CulinarySpot extends Model implements HasMedia
{
    use Searchable, InteractsWithMedia;

    protected $guarded = [];

    protected $appends = ['average_rating', 'review_count'];

    protected function casts(): array
    {
        return [
            'is_promoted' => 'boolean',
            'latitude' => 'float',
            'longitude' => 'float',
            'price' => 'float',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'spot_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'spot_id');
    }

    public function analytics()
    {
        return $this->hasMany(Analytic::class, 'spot_id');
    }

    /**
     * Computed average rating from reviews.
     */
    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    /**
     * Computed review count.
     */
    public function getReviewCountAttribute(): int
    {
        return $this->reviews()->count();
    }

    /**
     * Searchable array for Meilisearch.
     */
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
        ];
    }

    /**
     * Spatie Media Library: auto-convert to WebP + generate thumbnails.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->format('webp');

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(600)
            ->format('webp');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photos');
    }
}
