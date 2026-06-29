<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name']
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id]
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(int $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus!');
    }
}
