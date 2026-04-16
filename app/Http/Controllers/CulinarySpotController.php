<?php

namespace App\Http\Controllers;

use App\Models\CulinarySpot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CulinarySpotController extends Controller
{
    /**
     * Homepage: List all spots with search.
     */
    public function index(Request $request)
    {
        $query = CulinarySpot::with('category');

        if ($request->has('search') && $request->search != '') {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                // Pencarian aman untuk SQLite/PostgreSQL/MySQL tanpa case-sensitive constraints
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        return Inertia::render('Explorer', [
            'spots' => $query->get(),
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show detail page for a single culinary spot.
     */
    public function show(string $id)
    {
        $spot = CulinarySpot::with(['category', 'reviews.user', 'media'])->findOrFail($id);

        return Inertia::render('CulinarySpotDetail', [
            'spot' => $spot,
        ]);
    }

    /**
     * Store a new culinary spot (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'price' => ['required', 'numeric', 'min:0'],
            'photos.*' => ['nullable', 'image', 'max:5120'], // 5MB max per photo
        ]);

        $spot = CulinarySpot::create($validated);

        // Spatie Media: upload photos if provided
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $spot->addMedia($photo)->toMediaCollection('photos');
            }
        }

        return redirect()->back()->with('success', 'Spot kuliner berhasil ditambahkan!');
    }

    /**
     * Update an existing culinary spot (admin only).
     */
    public function update(Request $request, string $id)
    {
        $spot = CulinarySpot::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],
            'price' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $spot->update($validated);

        return redirect()->back()->with('success', 'Spot kuliner berhasil diperbarui!');
    }
}
