<?php

namespace App\Http\Controllers;

use App\Models\Analytic;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{
    /**
     * Track a view or click event (called via API).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'spot_id' => ['required', 'exists:culinary_spots,id'],
            'event_type' => ['required', 'in:view,click'],
        ]);

        Analytic::create([
            'spot_id' => $validated['spot_id'],
            'event_type' => $validated['event_type'],
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['status' => 'ok']);
    }
}
