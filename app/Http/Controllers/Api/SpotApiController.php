<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CulinarySpot;
use Illuminate\Http\Request;

class SpotApiController extends Controller
{
    /**
     * Get all culinary spots
     */
    public function index()
    {
        $spots = CulinarySpot::with(['category', 'tags'])->paginate(10);
        
        return response()->json([
            'success' => true,
            'data' => $spots
        ]);
    }

    /**
     * Store a newly created culinary spot
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'price' => 'nullable|numeric'
        ]);

        $validated['owner_id'] = $request->user()->id;
        $validated['status'] = 'approved'; // Or pending, depending on business logic

        $spot = CulinarySpot::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Spot created successfully',
            'data' => $spot
        ], 201);
    }

    /**
     * Display the specified culinary spot
     */
    public function show($id)
    {
        $spot = CulinarySpot::with(['category', 'tags', 'reviews'])->find($id);

        if (!$spot) {
            return response()->json([
                'success' => false,
                'message' => 'Spot not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $spot
        ]);
    }

    /**
     * Update the specified culinary spot
     */
    public function update(Request $request, $id)
    {
        $spot = CulinarySpot::find($id);

        if (!$spot) {
            return response()->json([
                'success' => false,
                'message' => 'Spot not found'
            ], 404);
        }

        // Only allow owner or admin
        if ($spot->owner_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'address' => 'sometimes|required|string',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'price' => 'nullable|numeric'
        ]);

        $spot->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Spot updated successfully',
            'data' => $spot
        ]);
    }

    /**
     * Remove the specified culinary spot
     */
    public function destroy(Request $request, $id)
    {
        $spot = CulinarySpot::find($id);

        if (!$spot) {
            return response()->json([
                'success' => false,
                'message' => 'Spot not found'
            ], 404);
        }

        // Only allow owner or admin
        if ($spot->owner_id !== $request->user()->id && $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $spot->delete();

        return response()->json([
            'success' => true,
            'message' => 'Spot deleted successfully'
        ]);
    }
}
