<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\CulinarySpot;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Store a new review for a culinary spot.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spot_id' => ['required', 'exists:culinary_spots,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
            'photos.*' => ['nullable', 'image', 'max:5120'],
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'spot_id' => $validated['spot_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_verified' => true, // auto-verify for logged-in users
        ]);

        // Spatie Media: upload review photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $review->addMedia($photo)->toMediaCollection('review_photos');
            }
        }

        return redirect()->back()->with('success', 'Ulasan berhasil ditambahkan!');
    }
}
