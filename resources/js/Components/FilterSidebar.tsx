import React from 'react';
import { router } from '@inertiajs/react';

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface FilterSidebarProps {
    categories: { id: number; name: string }[];
    tags: Tag[];
    activeCategory?: string;
    activeRating?: string;
    activeTags?: string[];
}

export default function FilterSidebar({
    categories = [],
    tags = [],
    activeCategory = '',
    activeRating = '',
    activeTags = [],
}: FilterSidebarProps) {

    const applyFilter = (params: Record<string, string | string[]>) => {
        const currentParams = new URLSearchParams(window.location.search);

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                currentParams.delete(key);
                if (value.length > 0) {
                    currentParams.set(key, value.join(','));
                }
            } else if (value === '') {
                currentParams.delete(key);
            } else {
                currentParams.set(key, value);
            }
        });

        // Reset to page 1 when filtering
        currentParams.delete('page');

        router.get(`/?${currentParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryClick = (catName: string) => {
        applyFilter({ category: activeCategory === catName ? '' : catName });
    };

    const handleRatingClick = (rating: string) => {
        const value = rating.replace('+', '');
        applyFilter({ min_rating: activeRating === rating ? '' : value });
    };

    const handleTagClick = (slug: string) => {
        const current = [...activeTags];
        const idx = current.indexOf(slug);
        if (idx >= 0) {
            current.splice(idx, 1);
        } else {
            current.push(slug);
        }
        applyFilter({ tags: current });
    };

    const clearAll = () => {
        router.get('/', {}, { preserveState: true });
    };

    const hasActiveFilters = activeCategory || activeRating || activeTags.length > 0;

    return (
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAll}
                    className="mb-4 w-full rounded-lg border border-primary/30 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-all"
                >
                    ✕ Hapus Semua Filter
                </button>
            )}

            {/* Categories */}
            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Culinary Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                                activeCategory === cat.name
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-primary/10 text-slate-700 hover:bg-primary/20'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="mb-6">
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag.slug)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                                    activeTags.includes(tag.slug)
                                        ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Minimum Rating */}
            <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Minimum Rating
                </h2>
                <div className="flex gap-2">
                    {['3+', '4+', '4.5+'].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleRatingClick(rating)}
                            className={`flex flex-1 items-center justify-center rounded-lg border py-2 text-xs font-medium transition-all ${
                                activeRating === rating
                                    ? 'border-2 border-primary bg-primary/5 font-bold text-primary'
                                    : 'border-primary/20 hover:bg-primary/5'
                            }`}
                        >
                            {rating}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
