import React from 'react';

export interface Review {
    id: number;
    name: string;
    avatarUrl: string;
    rating: number;
    comment: string;
    timeAgo: string;
    photoUrls?: string[];
    isVerified?: boolean;
}

interface ReviewItemProps {
    review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-primary/10">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div
                        className="w-12 h-12 rounded-full bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url("${review.avatarUrl}")` }}
                    ></div>
                    <div>
                        <p className="font-bold text-slate-900">{review.name}</p>
                        <div className="flex text-primary">
                            {Array.from({ length: 5 }, (_, i) => (
                                <span
                                    key={i}
                                    className={`material-symbols-outlined text-[16px] ${
                                        i < review.rating ? 'fill-icon' : ''
                                    }`}
                                >
                                    star
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-sm text-slate-500">{review.timeAgo}</span>
            </div>
            <p className="text-slate-600 mb-4">{review.comment}</p>
            {review.photoUrls && review.photoUrls.length > 0 && (
                <div className="flex gap-2">
                    {review.photoUrls.map((url, i) => (
                        <div
                            key={i}
                            className="w-16 h-16 rounded-lg bg-slate-100 bg-cover bg-center"
                            style={{ backgroundImage: `url("${url}")` }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
}
