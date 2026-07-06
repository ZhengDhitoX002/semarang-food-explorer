<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CulinarySpot;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CulinarySpotController extends Controller
{
    /**
     * Homepage: List all approved spots with search, filters, and pagination.
     */
    public function index(Request $request)
    {
        $query = CulinarySpot::with(['category', 'tags', 'media'])->approved()->active();

        // Search by name or description
        if ($request->has('search') && $request->search != '') {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category != '') {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // Filter by tags
        if ($request->has('tags') && !empty($request->tags)) {
            $tagSlugs = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            $query->whereHas('tags', function($q) use ($tagSlugs) {
                $q->whereIn('slug', $tagSlugs);
            });
        }

        // Filter by minimum rating
        if ($request->has('min_rating') && $request->min_rating != '') {
            $minRating = (float) $request->min_rating;
            $query->withAvg('reviews', 'rating')
                ->having('reviews_avg_rating', '>=', $minRating);
        }

        return Inertia::render('Explorer', [
            'spots' => $query->paginate(12)->withQueryString(),
            'filters' => $request->only('search', 'category', 'tags', 'min_rating'),
            'categories' => Category::all(['id', 'name']),
            'availableTags' => Tag::all(['id', 'name', 'slug']),
        ]);
    }

    /**
     * Show detail page for a single culinary spot.
     */
    public function show(string $id)
    {
        $spot = CulinarySpot::with(['category', 'tags', 'reviews.user', 'reviews.media', 'media'])->findOrFail($id);

        return Inertia::render('CulinarySpotDetail', [
            'spot' => $spot,
        ]);
    }

    /**
     * Show spot submission form for users.
     */
    public function createSubmission()
    {
        return Inertia::render('SubmitSpot', [
            'categories' => Category::all(['id', 'name']),
            'tags' => Tag::all(['id', 'name', 'slug']),
        ]);
    }

    /**
     * Store a user-submitted spot (pending approval).
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'address' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'price' => ['required', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'photos.*' => ['nullable', 'image', 'max:5120'],
        ]);

        $spot = CulinarySpot::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'address' => $validated['address'] ?? null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price' => $validated['price'],
            'status' => 'pending',
            'submitted_by' => $request->user()->id,
        ]);

        // Sync tags
        if (!empty($validated['tags'])) {
            $spot->tags()->sync($validated['tags']);
        }

        // Upload photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $spot->addMedia($photo)->toMediaCollection('photos');
            }
        }

        return redirect('/')->with('success', 'Tempat berhasil disubmit! Menunggu persetujuan admin.');
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
            'address' => ['nullable', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'price' => ['required', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
            'photos.*' => ['nullable', 'image', 'max:5120'], // 5MB max per photo
        ]);

        $spot = CulinarySpot::create([
            ...$validated,
            'status' => 'approved',
        ]);

        // Sync tags
        if (!empty($validated['tags'])) {
            $spot->tags()->sync($validated['tags']);
        }

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
            'address' => ['nullable', 'string', 'max:255'],
            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
        ]);

        // 'tags' isn't a real culinary_spots column - it must never reach
        // update()/create() directly (CulinarySpot::$guarded is empty, so
        // Eloquent would try to write it as a column and throw a
        // "column not found" SQL error). Sync it via the pivot instead.
        $spot->update(collect($validated)->except('tags')->all());

        if (isset($validated['tags'])) {
            $spot->tags()->sync($validated['tags']);
        }

        return redirect()->back()->with('success', 'Spot kuliner berhasil diperbarui!');
    }

    /**
     * Append photos to a spot's gallery (admin only), capped at 5 total.
     */
    public function addPhotos(Request $request, string $id)
    {
        $spot = CulinarySpot::findOrFail($id);

        $slotsLeft = max(0, 5 - $spot->getMedia('photos')->count());

        $request->validate([
            'photos' => ['required', 'array', 'min:1', 'max:' . max($slotsLeft, 1)],
            'photos.*' => ['image', 'max:5120'],
        ]);

        if ($slotsLeft === 0) {
            return redirect()->back()->withErrors(['photos' => 'Maksimal 5 foto per tempat. Hapus foto lama dulu untuk menambah yang baru.']);
        }

        foreach (array_slice($request->file('photos'), 0, $slotsLeft) as $photo) {
            $spot->addMedia($photo)->toMediaCollection('photos');
        }

        return redirect()->back()->with('success', 'Foto berhasil ditambahkan!');
    }

    /**
     * Remove a single photo from a spot's gallery (admin only).
     */
    public function deletePhoto(string $id, int $mediaId)
    {
        $spot = CulinarySpot::findOrFail($id);
        $spot->getMedia('photos')->firstWhere('id', $mediaId)?->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus!');
    }

    /**
     * Report a spot as closed (Contributor contribution).
     */
    public function reportClose(Request $request, string $id)
    {
        $spot = CulinarySpot::findOrFail($id);
        
        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:255'],
        ]);

        $spot->update([
            'status' => 'pending_close',
            'closed_reason' => $validated['reason'],
        ]);

        return redirect()->back()->with('success', 'Laporan penutupan berhasil dikirim! Menunggu konfirmasi admin.');
    }
}
