import React from 'react';

interface FilterSidebarProps {
    categories: string[];
    activeCategory?: string;
    activeRating?: string;
}

export default function FilterSidebar({
    categories,
    activeCategory = 'All',
    activeRating = '4.5+',
}: FilterSidebarProps) {
    return (
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Categories */}
            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Culinary Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                                activeCategory === cat
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-primary/10 text-slate-700 hover:bg-primary/20'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Price Range
                </h2>
                <input
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-primary/20 accent-primary"
                    max="100"
                    min="0"
                    type="range"
                    defaultValue="50"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>$</span>
                    <span>$$$</span>
                </div>
            </div>

            {/* Minimum Rating */}
            <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Minimum Rating
                </h2>
                <div className="flex gap-2">
                    {['3+', '4+', '4.5+'].map((rating) => (
                        <button
                            key={rating}
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
