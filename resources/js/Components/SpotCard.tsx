import React from 'react';
import { Link } from '@inertiajs/react';

export interface CulinarySpot {
    id: number;
    name: string;
    imageUrl: string | null;
    imageAlt: string;
    rating: number;
    location: string;
    tags: string[];
    priceLevel: string;
    isVerified?: boolean;
}

interface SpotCardProps {
    spot: CulinarySpot;
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export default function SpotCard({ spot, isFavorite = false, onToggleFavorite }: SpotCardProps) {
    return (
        <Link
            href={`/spot/${spot.id}`}
            className="group relative bg-surface rounded-[18px] border border-ink-300 hover:shadow-lg focus-visible:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                {spot.imageUrl ? (
                    <>
                        <div className="absolute inset-0 shimmer"></div>
                        <img
                            alt={spot.imageAlt}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            src={spot.imageUrl}
                            loading="lazy"
                            onLoad={(e) => e.currentTarget.classList.add('loaded')}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-chip flex items-center justify-center">
                        <span className="material-symbols-outlined text-chip-ink text-4xl">restaurant</span>
                    </div>
                )}
                <div className="absolute top-2.5 left-2.5 bg-surface text-ink-900 px-2 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <span className="material-symbols-outlined text-primary text-sm fill-icon">star</span>
                    <span className="text-[11px] font-bold">{spot.rating > 0 ? spot.rating.toFixed(1) : 'Baru'}</span>
                </div>
                {onToggleFavorite && (
                    <button
                        onClick={(e) => onToggleFavorite(e, spot.id)}
                        className="absolute top-2.5 right-2.5 bg-surface w-[30px] h-[30px] rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
                    >
                        <span className={`material-symbols-outlined text-[17px] leading-none m-0 p-0 ${isFavorite ? 'text-primary fill-icon' : 'text-ink-400'}`}>
                            favorite
                        </span>
                    </button>
                )}
                {spot.isVerified && (
                    <span className="absolute bottom-2.5 left-2.5 bg-secondary text-[#241a06] text-[9.5px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg">
                        Pilihan
                    </span>
                )}
            </div>
            <div className="p-3">
                <h3 className="font-display font-bold text-[14.5px] leading-tight tracking-tight text-ink-900">{spot.name}</h3>
                <p className="text-ink-500 text-[11px] font-medium flex items-center gap-1 mt-1.5">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {spot.location}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                    {spot.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-chip rounded-md text-[10px] font-semibold text-chip-ink"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-2.5">
                    <span className="text-ink-900 font-bold text-[12.5px]">{spot.priceLevel}</span>
                </div>
            </div>
        </Link>
    );
}
