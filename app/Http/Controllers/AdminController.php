<?php

namespace App\Http\Controllers;

use App\Models\CulinarySpot;
use App\Models\Review;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Admin dashboard with stats and moderation panels.
     */
    public function dashboard(Request $request)
    {
        $tab = $request->get('tab', 'overview');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalSpots' => CulinarySpot::approved()->count(),
                'totalReviews' => Review::count(),
                'pendingSubmissions' => CulinarySpot::where('status', 'pending')->count(),
            ],
            'pendingSpots' => CulinarySpot::where('status', 'pending')
                ->with(['category', 'submittedBy', 'tags'])
                ->orderByDesc('created_at')
                ->get(),
            'recentReviews' => Review::with(['user', 'culinarySpot'])
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(),
            'allSpots' => CulinarySpot::with(['category', 'tags'])
                ->orderByDesc('created_at')
                ->get(),
            'categories' => \App\Models\Category::all(),
            'tags' => \App\Models\Tag::all(),
            'closureReports' => CulinarySpot::where('status', 'pending_close')
                ->with(['category', 'submittedBy'])
                ->get(),
            'tab' => $tab,
        ]);
    }

    /**
     * Approve a pending spot submission.
     */
    public function approveSpot(int $id)
    {
        $spot = CulinarySpot::whereIn('status', ['pending', 'pending_close'])->findOrFail($id);
        $spot->update(['status' => 'approved']);

        return redirect()->back()->with('success', 'Tempat kuliner berhasil disetujui!');
    }

    /**
     * Reject a pending spot submission.
     */
    public function rejectSpot(int $id)
    {
        $spot = CulinarySpot::where('status', 'pending')->findOrFail($id);
        $spot->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Submission ditolak.');
    }

    /**
     * Mark a spot as permanently closed.
     */
    public function markClosed(Request $request, int $id)
    {
        $spot = CulinarySpot::findOrFail($id);

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $spot->update([
            'status' => 'closed',
            'closed_reason' => $validated['reason'] ?? 'Ditutup oleh admin',
        ]);

        return redirect()->back()->with('success', 'Tempat ditandai sebagai tutup permanen.');
    }

    /**
     * Delete a review (moderation).
     */
    public function deleteReview(int $id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return redirect()->back()->with('success', 'Review berhasil dihapus.');
    }
}
