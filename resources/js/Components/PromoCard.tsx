import React from 'react';
import { Link } from '@inertiajs/react';
import StarRating from './StarRating';

export interface PromoSpot {
    id: number;
    name: string;
    imageUrl: string;
    imageAlt: string;
    rating: number;
    reviewCount: string;
    price: string;
    badge: string;
    badgeColor?: string;
}

interface PromoCardProps {
    spot: PromoSpot;
}

const badgeColors: Record<string, string> = {
    Featured: 'bg-primary',
    Popular: 'bg-primary',
    Classic: 'bg-slate-800/80 backdrop-blur-sm',
    New: 'bg-green-600',
};

export default function PromoCard({ spot }: PromoCardProps) {
    return (
        <Link
            href={`/spot/${spot.id}`}
            className="group overflow-hidden rounded-2xl bg-background-light transition-all hover:shadow-xl focus-visible:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 block"
        >
            <div className="relative aspect-video overflow-hidden">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={spot.imageUrl}
                    alt={spot.imageAlt}
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
                />
                <div
                    className={`absolute top-3 left-3 rounded-full ${
                        badgeColors[spot.badge] || 'bg-primary'
                    } px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest`}
                >
                    {spot.badge}
                </div>
            </div>
            <div className="p-4">
                <h3 className="mb-1 font-bold">{spot.name}</h3>
                <div className="mb-3 flex items-center gap-1">
                    <StarRating rating={spot.rating} size="sm" />
                    <span className="ml-1 text-xs text-slate-400">({spot.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{spot.price}</span>
                    <div className="rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
