import React from 'react';
import { Link } from '@inertiajs/react';

export interface CulinarySpot {
    id: number;
    name: string;
    imageUrl: string;
    imageAlt: string;
    rating: number;
    location: string;
    tags: string[];
    priceLevel: string;
    isVerified?: boolean;
}

interface SpotCardProps {
    spot: CulinarySpot;
}

export default function SpotCard({ spot }: SpotCardProps) {
    return (
        <Link
            href={`/spot/${spot.id}`}
            className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden block"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <img
                    alt={spot.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={spot.imageUrl}
                    loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-yellow-500 text-sm fill-icon">star</span>
                    <span className="text-xs font-bold">{spot.rating.toFixed(1)}</span>
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-bold text-lg">{spot.name}</h3>
                    {spot.isVerified && (
                        <span className="material-symbols-outlined text-blue-500 text-base fill-icon" title="Verified Spot">
                            verified
                        </span>
                    )}
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    {spot.location}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {spot.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 uppercase tracking-wider"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-primary font-bold text-sm">{spot.priceLevel}</span>
                </div>
            </div>
        </Link>
    );
}
