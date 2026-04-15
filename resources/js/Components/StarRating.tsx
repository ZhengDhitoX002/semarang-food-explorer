import React from 'react';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export default function StarRating({ rating, maxStars = 5, size = 'sm', showValue = false }: StarRatingProps) {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }, (_, i) => {
                const starValue = i + 1;
                const isFull = starValue <= Math.floor(rating);
                const isHalf = !isFull && starValue <= Math.ceil(rating) && rating % 1 >= 0.3;
                return (
                    <span
                        key={i}
                        className={`material-symbols-outlined ${sizeClasses[size]} ${
                            isFull || isHalf ? 'text-primary fill-icon' : 'text-slate-300'
                        }`}
                    >
                        {isHalf ? 'star_half' : 'star'}
                    </span>
                );
            })}
            {showValue && (
                <span className={`ml-1 font-bold text-primary ${sizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
