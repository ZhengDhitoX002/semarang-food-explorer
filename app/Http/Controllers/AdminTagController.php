<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminTagController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tags,name']
        ]);

        Tag::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', 'Tag berhasil ditambahkan!');
    }

    public function destroy(int $id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return redirect()->back()->with('success', 'Tag berhasil dihapus!');
    }
}
