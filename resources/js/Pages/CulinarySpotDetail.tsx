import React, { FormEvent, useState, useEffect, useCallback, useRef } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Review {
    id: number;
    user: { id: number; name: string };
    rating: number;
    comment: string;
    is_verified: boolean;
    is_editable: boolean;
    created_at: string;
    media?: {
        id: number;
        original_url: string;
        preview_url?: string;
    }[];
}

interface SpotData {
    id: number;
    name: string;
    description: string;
    address?: string;
    latitude: string;
    longitude: string;
    price: string;
    is_promoted: boolean;
    average_rating: number;
    review_count: number;
    status?: string;
    closed_reason?: string;
    category?: { id: number; name: string };
    tags?: { id: number; name: string; slug: string }[];
    reviews: Review[];
    media?: { id: number; original_url: string }[];
}

export default function CulinarySpotDetail() {
    const { spot, auth } = usePage<{ spot: SpotData; auth: { user?: { id: number; name: string; role: string }, favorite_spots?: number[] } }>().props;
    const [showReviewForm, setShowReviewForm] = useState(false);
    
    // Edit Review State
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState('');
    
    // Lightbox State
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

    // Closure Report State
    const [isReportingClose, setIsReportingClose] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const isFavorite = auth.favorite_spots?.includes(spot.id) || false;

    const reviewForm = useForm({
        spot_id: spot.id,
        rating: 5,
        comment: '',
        photos: [] as File[],
    });

    const editForm = useForm({
        rating: 5,
        comment: '',
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);
    const reviewSectionRef = useRef<HTMLDivElement>(null);

    const scrollToReviews = () => {
        setShowReviewForm(true);
        reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            reviewForm.setData('photos', [...reviewForm.data.photos, ...filesArray]);
            
            // Create preview URLs
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...reviewForm.data.photos];
        newPhotos.splice(index, 1);
        reviewForm.setData('photos', newPhotos);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]); // Free memory
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const submitReview = (e: FormEvent) => {
        e.preventDefault();
        reviewForm.post('/reviews', {
            preserveScroll: true,
            onSuccess: () => {
                setShowReviewForm(false);
                reviewForm.reset('comment', 'rating', 'photos');
                previewImages.forEach(url => URL.revokeObjectURL(url));
                setPreviewImages([]);
            },
        });
    };

    const toggleFavorite = () => {
        if (!auth.user) {
            window.location.href = '/login';
            return;
        }
        reviewForm.post(`/favorites/${spot.id}`, { preserveScroll: true, preserveState: true });
    };

    const handleReportCloseSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post(`/spot/${spot.id}/report-close`, { reason: reportReason }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsReportingClose(false);
                setReportReason('');
            }
        });
    };

    const startEditReview = (review: Review) => {
        setEditingReviewId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
        editForm.setData({ rating: review.rating, comment: review.comment });
    };

    const submitEditReview = (e: FormEvent) => {
        e.preventDefault();
        if (editingReviewId === null) return;
        editForm.put(`/reviews/${editingReviewId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingReviewId(null),
        });
    };

    const openLightbox = useCallback((images: string[], index: number) => {
        setLightboxImages(images);
        setCurrentLightboxIndex(index);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxImages([]);
        setCurrentLightboxIndex(0);
        document.body.style.removeProperty('overflow');
    }, []);

    const nextImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
    }, [lightboxImages.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    }, [lightboxImages.length]);

    // Keyboard support for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxImages.length === 0) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxImages, closeLightbox, nextImage, prevImage]);

    // Safety net: always restore scroll when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.removeProperty('overflow');
        };
    }, []);

    const lat = Number(spot.latitude);
    const lng = Number(spot.longitude);

    // A handful of spots have curated local photos from the initial redesign
    // (public/images/merchants/*); real uploaded media always takes priority.
    // Spots with neither show an honest "no photo" placeholder instead of a
    // fake stock image.
    const isKnownSpot = spot.name.match(/(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i);
    const folderName = spot.name.toUpperCase().replace(/\s+/g, '_');

    const heroImages: string[] = spot.media && spot.media.length > 0
        ? spot.media.map(m => m.original_url)
        : isKnownSpot
            ? [
                `/images/merchants/${folderName}/unnamed.webp`,
                `/images/merchants/${folderName}/unnamed (1).webp`,
                `/images/merchants/${folderName}/unnamed (2).webp`,
            ]
            : [];

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Kemarin';
        if (days < 7) return `${days} hari lalu`;
        if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
        return `${Math.floor(days / 30)} bulan lalu`;
    };

    return (
        <>
            <Head title={spot.name} />
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-ink-900">
                {/* Mobile-native hero — swipeable gallery, floating back/share/favorite, overlapping meta sheet */}
                <div className="md:hidden relative">
                    <div
                        className="relative h-[280px] overflow-x-auto no-scrollbar flex snap-x snap-mandatory"
                        onScroll={(e) => {
                            const el = e.currentTarget;
                            setMobilePhotoIndex(Math.round(el.scrollLeft / el.clientWidth));
                        }}
                    >
                        {(heroImages.length > 0 ? heroImages : [null]).map((src, idx) => (
                            <div key={idx} className="relative h-full w-full flex-none snap-start bg-ink-300 bg-cover bg-center flex items-center justify-center" style={src ? { backgroundImage: `url("${src}")` } : undefined}>
                                {!src && <span className="material-symbols-outlined text-ink-400 text-6xl">restaurant</span>}
                            </div>
                        ))}
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,20,12,.32)_0%,transparent_26%,transparent_62%,rgba(30,20,12,.28)_100%)]" />
                    </div>

                    {heroImages.length > 1 && (
                        <div className="absolute right-4 top-[220px] z-20 bg-black/50 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                            {mobilePhotoIndex + 1} / {heroImages.length}
                        </div>
                    )}

                    <div className="absolute top-3 left-0 right-0 z-20 flex items-center justify-between px-4">
                        <Link href="/" className="h-10 w-10 rounded-xl bg-surface/90 backdrop-blur-sm flex items-center justify-center text-ink-900 shadow-sm">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigator.share ? navigator.share({ title: spot.name, url: window.location.href }) : navigator.clipboard.writeText(window.location.href)}
                                className="h-10 w-10 rounded-xl bg-surface/90 backdrop-blur-sm flex items-center justify-center text-ink-900 shadow-sm"
                                aria-label="Bagikan"
                            >
                                <span className="material-symbols-outlined">ios_share</span>
                            </button>
                            <button
                                onClick={toggleFavorite}
                                className="h-10 w-10 rounded-xl bg-surface/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                                aria-label="Favorit"
                            >
                                <span className={`material-symbols-outlined ${isFavorite ? 'text-primary fill-icon' : 'text-ink-900'}`}>favorite</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta sheet — overlaps the hero */}
                    <div className="relative -mt-6 bg-background-light rounded-t-[26px] px-[18px] pt-5 pb-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-chip text-chip-ink text-[11px] font-semibold px-2.5 py-1.5 rounded-full">
                                {spot.category?.name || 'Kuliner'}
                            </span>
                            {spot.status === 'closed' && (
                                <span className="bg-red-100 text-red-600 text-[10.5px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                    🚫 Tutup Permanen
                                </span>
                            )}
                        </div>
                        <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight flex items-center gap-2">
                            {spot.name}
                            {spot.is_promoted && <span className="material-symbols-outlined text-primary fill-icon text-xl">verified</span>}
                        </h1>
                        <p className="flex items-center gap-1.5 mt-2 text-[12.5px] font-medium text-ink-500">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {spot.address || 'Semarang'}
                        </p>

                        <div className="flex mt-4 bg-surface border border-ink-300 rounded-[18px] overflow-hidden">
                            <div className="flex-1 py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-r border-ink-300">
                                <b className="font-display text-[16px] font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-primary text-base fill-icon">star</span>
                                    {spot.average_rating > 0 ? spot.average_rating.toString() : '-'}
                                </b>
                                <span className="text-[10.5px] font-medium text-ink-500">{spot.review_count} ulasan</span>
                            </div>
                            <div className="flex-1 py-3.5 px-2 text-center flex flex-col items-center gap-1.5 border-r border-ink-300">
                                <b className="font-display text-[16px] font-bold">Rp {Math.round(Number(spot.price) / 1000)}rb</b>
                                <span className="text-[10.5px] font-medium text-ink-500">rata-rata</span>
                            </div>
                            <div className="flex-1 py-3.5 px-2 text-center flex flex-col items-center gap-1.5">
                                <b className="font-display text-[16px] font-bold">{spot.is_promoted ? 'Promoted' : 'Reguler'}</b>
                                <span className="text-[10.5px] font-medium text-ink-500">status</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Navigation — desktop only */}
                <header className="hidden md:block sticky top-0 z-50 bg-surface/85 backdrop-blur-md border-b border-primary/10 px-4 md:px-20 py-3">
                    <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">restaurant</span>
                                </div>
                                <h2 className="font-display text-lg font-bold leading-tight tracking-tight">
                                    {spot.name}
                                </h2>
                            </Link>
                        </div>
                        <div className="flex gap-3 items-center">
                            {auth.user ? (
                                <span className="text-sm text-ink-500">Hi, {auth.user.name}</span>
                            ) : (
                                <Link href="/login" className="text-sm font-bold text-primary hover:underline">Login</Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-[1200px] mx-auto w-full px-4 py-6 pb-28 md:pb-6">
                    {/* Hero Gallery — desktop only */}
                    <div className="hidden md:block mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[450px]">
                            <div
                                className="md:col-span-2 relative overflow-hidden rounded-2xl bg-ink-300 bg-cover bg-center cursor-pointer flex items-center justify-center"
                                style={heroImages[0] ? { backgroundImage: `url("${heroImages[0]}")` } : undefined}
                                onClick={() => heroImages.length > 0 && openLightbox(heroImages, 0)}
                            >
                                {!heroImages[0] && (
                                    <span className="material-symbols-outlined text-ink-400 text-6xl">restaurant</span>
                                )}
                                {spot.is_promoted && (
                                    <div className="absolute top-4 left-4 bg-secondary text-[#241a06] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                        Pilihan
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:grid grid-rows-2 gap-4">
                                <div className="relative overflow-hidden rounded-2xl bg-ink-300 bg-cover bg-center cursor-pointer flex items-center justify-center"
                                    style={heroImages[1] ? { backgroundImage: `url("${heroImages[1]}")` } : undefined}
                                    onClick={() => heroImages[1] && openLightbox(heroImages, 1)}
                                >
                                    {!heroImages[1] && <span className="material-symbols-outlined text-ink-400 text-3xl">restaurant</span>}
                                </div>
                                <div className="relative overflow-hidden rounded-2xl bg-ink-300 bg-cover bg-center cursor-pointer flex items-center justify-center"
                                    style={heroImages[2] ? { backgroundImage: `url("${heroImages[2]}")` } : undefined}
                                    onClick={() => heroImages[2] && openLightbox(heroImages, 2)}
                                >
                                    {!heroImages[2] && <span className="material-symbols-outlined text-ink-400 text-3xl">restaurant</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="hidden md:flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="font-display text-4xl font-bold tracking-tight">{spot.name}</h1>
                                        {spot.status === 'closed' && (
                                            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">
                                                🚫 Tutup Permanen
                                            </span>
                                        )}
                                        <button
                                            onClick={toggleFavorite}
                                            className="bg-surface border text-[24px] border-ink-300 w-12 h-12 rounded-full flex items-center justify-center hover:bg-ink-100 transition-colors shadow-sm"
                                        >
                                            <span className={`material-symbols-outlined leading-none m-0 p-0 ${isFavorite ? 'text-primary fill-icon' : 'text-ink-400'}`}>
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    {spot.status === 'closed' && spot.closed_reason && (
                                        <p className="text-sm text-red-500 mt-1">Alasan: {spot.closed_reason}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className="bg-chip text-chip-ink text-xs font-bold px-3 py-1 rounded-full">
                                            {spot.category?.name || 'Kuliner'}
                                        </span>
                                        {spot.tags && spot.tags.map(tag => (
                                            <span key={tag.id} className="bg-secondary/15 text-secondary-700 text-xs font-medium px-2.5 py-1 rounded-full border border-secondary/30">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Bar — desktop only, mobile has its own compact stats row in the hero sheet */}
                            <div className="hidden md:flex flex-wrap gap-4 mb-8">
                                {[
                                    { icon: 'star', value: spot.average_rating > 0 ? spot.average_rating.toString() : '-', label: 'Rating' },
                                    { icon: 'reviews', value: spot.review_count.toString(), label: 'Reviews' },
                                    { icon: 'payments', value: `Rp ${Number(spot.price).toLocaleString('id-ID')}`, label: 'Harga Rata-rata' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex-1 min-w-[140px] bg-surface border border-ink-300 rounded-2xl p-4 flex flex-col items-center text-center">
                                        <span className="material-symbols-outlined text-primary mb-1">{stat.icon}</span>
                                        <span className="font-display text-2xl font-bold">{stat.value}</span>
                                        <span className="text-xs text-ink-500 uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-12">
                                <h3 className="font-display text-xl font-bold mb-4">Tentang Tempat Ini</h3>
                                <p className="text-ink-600 leading-relaxed whitespace-pre-wrap">{spot.description}</p>
                            </div>

                            {/* Reviews Section */}
                            <div className="mb-12" ref={reviewSectionRef}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-display text-2xl font-bold">Ulasan ({spot.review_count})</h3>
                                    {auth.user ? (
                                        <button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="text-primary font-bold flex items-center gap-1 hover:underline px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                                            Tulis Ulasan
                                        </button>
                                    ) : (
                                        <Link href="/login" className="text-primary font-bold flex items-center gap-1 hover:underline">
                                            Login untuk review <span className="material-symbols-outlined">login</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && auth.user && (
                                    <div className="bg-surface rounded-2xl p-6 mb-8 border border-ink-200 shadow-sm mt-4">
                                        <h4 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                            Pengalaman Anda di {spot.name}?
                                        </h4>
                                        <form onSubmit={submitReview} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-bold text-ink-700 mb-2">Beri Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => reviewForm.setData('rating', star)}
                                                            className={`text-3xl transition-transform hover:scale-110 ${
                                                                star <= reviewForm.data.rating ? 'text-yellow-400' : 'text-ink-200'
                                                            }`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-ink-700 mb-2">Cerita Anda</label>
                                                <textarea
                                                    value={reviewForm.data.comment}
                                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow bg-ink-50 focus:bg-surface"
                                                    placeholder="Bagikan detil makanan, suasana, dan pelayanan toko ini..."
                                                    required
                                                />
                                                {reviewForm.errors.comment && <p className="text-red-500 text-xs mt-1 font-medium">{reviewForm.errors.comment}</p>}
                                            </div>

                                            {/* Photo Upload Section */}
                                            <div>
                                                <label className="block text-sm font-bold text-ink-700 mb-2">Tambah Foto</label>
                                                
                                                {/* Previews Array */}
                                                {previewImages.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 mb-3">
                                                        {previewImages.map((src, idx) => (
                                                            <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border border-ink-200 shadow-sm group">
                                                                <img src={src} alt="preview" className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePhoto(idx)}
                                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <span className="material-symbols-outlined text-white text-[20px]">delete</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-primary/30 rounded-lg text-primary hover:bg-primary/5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors cursor-pointer group">
                                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_photo_alternate</span>
                                                    <span className="text-sm font-bold">{previewImages.length > 0 ? 'Tambah Foto Lain' : 'Upload Foto'}</span>
                                                    <input 
                                                        type="file" 
                                                        multiple 
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                                {reviewForm.errors.photos && <p className="text-red-500 text-xs mt-1 font-medium">{reviewForm.errors.photos}</p>}
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={reviewForm.processing}
                                                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm tracking-wide hover:bg-primary/90 transition-all focus:ring-4 focus:ring-primary/20 disabled:bg-primary/50"
                                                >
                                                    {reviewForm.processing ? 'Mengirim...' : 'Posting Ulasan'}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={reviewForm.processing}
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="px-6 py-2.5 border border-ink-200 text-ink-600 rounded-lg font-bold text-sm hover:bg-ink-50 transition-all focus:ring-4 focus:ring-ink-100"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Review List */}
                                <div className="space-y-6">
                                    {spot.reviews.length > 0 ? (
                                        spot.reviews.map((review) => (
                                            <div key={review.id} className="bg-surface rounded-xl border border-ink-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold shadow-sm">
                                                            {review.user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-ink-900">{review.user.name}</p>
                                                            <p className="text-xs text-ink-400 font-medium">{timeAgo(review.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`text-lg md:text-xl leading-none ${i < review.rating ? 'text-yellow-400' : 'text-ink-200'}`}>★</span>
                                                        ))}
                                                        {review.is_verified && (
                                                            <span className="ml-2 text-[10px] bg-green-50 text-green-600 border border-green-200/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Terverifikasi</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-ink-600 text-sm leading-relaxed mb-4">{review.comment}</p>

                                                {/* Edit Review Button & Form */}
                                                {auth.user && auth.user.id === review.user.id && review.is_editable && (
                                                    editingReviewId === review.id ? (
                                                        <form onSubmit={submitEditReview} className="bg-ink-50 rounded-xl p-4 mb-4 border border-ink-200">
                                                            <div className="flex items-center gap-1 mb-3">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => editForm.setData('rating', star)}
                                                                        className={`text-lg ${star <= editForm.data.rating ? 'text-yellow-400' : 'text-ink-200'}`}
                                                                    >★</button>
                                                                ))}
                                                            </div>
                                                            <textarea
                                                                value={editForm.data.comment}
                                                                onChange={e => editForm.setData('comment', e.target.value)}
                                                                className="w-full p-3 text-sm border border-ink-200 rounded-lg resize-none"
                                                                rows={3}
                                                            />
                                                            <div className="flex gap-2 mt-2">
                                                                <button type="submit" disabled={editForm.processing} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg">
                                                                    {editForm.processing ? '⏳...' : '💾 Simpan'}
                                                                </button>
                                                                <button type="button" onClick={() => setEditingReviewId(null)} className="px-4 py-2 text-xs font-bold bg-ink-200 text-ink-600 rounded-lg">
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditReview(review)}
                                                            className="text-xs text-blue-500 font-medium hover:underline mb-4"
                                                        >
                                                            ✏️ Edit Review (tersedia 24 jam)
                                                        </button>
                                                    )
                                                )}
                                                
                                                {/* Review Photos */}
                                                {review.media && review.media.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {review.media.map((image: any, idx: number) => {
                                                            const photoUrl = image.original_url || '';
                                                            const allPhotoUrls = review.media!.map((m: any) => m.original_url || '');
                                                            return (
                                                                <button
                                                                    key={image.id}
                                                                    type="button"
                                                                    onClick={() => openLightbox(allPhotoUrls, idx)}
                                                                    className="relative h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden border-2 border-ink-200/60 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none group bg-ink-100 shadow-sm hover:shadow-md transition-all"
                                                                >
                                                                    <img 
                                                                        src={photoUrl}
                                                                        alt={`Foto ulasan ${idx + 1}`}
                                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <span className="material-symbols-outlined text-white text-[16px] drop-shadow-lg">zoom_in</span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-ink-50/50 border border-dashed border-ink-200 rounded-2xl">
                                            <span className="material-symbols-outlined text-5xl text-ink-300 mb-3 block">rate_review</span>
                                            <p className="text-ink-500 font-medium">Belum ada ulasan untuk tempat ini.</p>
                                            <p className="text-ink-400 text-sm mt-1">Jadilah yang pertama menceritakan pengalaman Anda!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Map */}
                            <div className="bg-surface rounded-xl border border-primary/10 p-5 shadow-sm">
                                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    Lokasi
                                </h3>
                                <div className="w-full h-48 rounded-lg overflow-hidden relative mb-4 border border-ink-200">
                                    <MapContainer center={[lat, lng]} zoom={16} keyboard={false} preferCanvas style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                        <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" attribution="&copy; Google Maps" />
                                        <Marker position={[lat, lng]}>
                                            <Popup>{spot.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <p className="font-bold text-ink-900">{spot.name}</p>
                                <p className="text-ink-500 text-sm mb-4">Semarang, Jawa Tengah</p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 bg-ink-100 rounded-lg font-bold text-ink-700 text-sm hover:bg-primary hover:text-white hover:shadow-md transition-all text-center focus:ring-4 focus:ring-primary/20"
                                >
                                    Dapatkan Arah Google Maps
                                </a>
                            </div>

                            {/* Info */}
                            <div className="bg-surface rounded-xl border border-primary/10 p-5 shadow-sm">
                                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Info Singkat
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center pb-3 border-b border-ink-100">
                                        <span className="text-ink-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">category</span> Kategori</span>
                                        <span className="font-bold text-ink-800">{spot.category?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-ink-100">
                                        <span className="text-ink-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">payments</span> Harga Perkiraan</span>
                                        <span className="font-bold text-primary">Rp {Number(spot.price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-ink-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">verified</span> Status</span>
                                        <span className={`font-bold text-[11px] px-2 py-1 rounded-md uppercase tracking-wider ${spot.is_promoted ? 'bg-primary/10 text-primary' : 'bg-ink-100 text-ink-500'}`}>
                                            {spot.is_promoted ? 'Promoted' : 'Reguler'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Laporkan Tutup Card */}
                            {spot.status !== 'closed' && spot.status !== 'pending_close' && (
                                <div className="bg-surface rounded-xl border border-red-100 p-5 shadow-sm">
                                    <h3 className="font-display font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
                                        <span className="material-symbols-outlined">report</span>
                                        Toko Tutup Permanen?
                                    </h3>
                                    <p className="text-xs text-ink-500 mb-4 leading-relaxed">
                                        Jika Anda mengetahui bahwa tempat kuliner ini sudah tutup secara permanen, harap laporkan agar kami dapat memverifikasi.
                                    </p>
                                    {auth.user ? (
                                        isReportingClose ? (
                                            <form onSubmit={handleReportCloseSubmit} className="space-y-3">
                                                <textarea
                                                    value={reportReason}
                                                    onChange={e => setReportReason(e.target.value)}
                                                    placeholder="Alasan penutupan (misal: Ruko disewakan / pindah kota)..."
                                                    rows={3}
                                                    className="w-full px-3 py-2 text-xs border border-ink-200 rounded-lg outline-none focus:ring-1 focus:ring-red-500"
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700, borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
                                                        Kirim Laporan
                                                    </button>
                                                    <button type="button" onClick={() => setIsReportingClose(false)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700, borderRadius: 8, background: '#e2e8f0', color: '#475569', border: 'none', cursor: 'pointer' }}>
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                onClick={() => setIsReportingClose(true)}
                                                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-bold text-xs transition-all text-center"
                                            >
                                                🚫 Laporkan Tutup Permanen
                                            </button>
                                        )
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="block w-full py-2 bg-ink-50 text-ink-500 border border-ink-200 rounded-lg font-semibold text-xs text-center text-decoration-none"
                                        >
                                            Login untuk melaporkan tutup
                                        </Link>
                                    )}
                                </div>
                            )}

                            {spot.status === 'pending_close' && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
                                    <span className="material-symbols-outlined text-orange-500 text-3xl mb-2">hourglass_empty</span>
                                    <h4 className="font-bold text-orange-800 text-sm mb-1">Laporan Penutupan Diproses</h4>
                                    <p className="text-xs text-orange-600 leading-relaxed">
                                        Tempat ini telah dilaporkan tutup permanen. Tim admin sedang memverifikasi laporan ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Sticky action bar — mobile only */}
                <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface border-t border-ink-300 px-4 pt-3 flex gap-2.5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[52px] h-[50px] rounded-2xl border-[1.5px] border-ink-300 bg-background-light flex items-center justify-center text-ink-900 shrink-0"
                        aria-label="Rute"
                    >
                        <span className="material-symbols-outlined text-2xl">directions</span>
                    </a>
                    {auth.user ? (
                        <button
                            onClick={scrollToReviews}
                            className="flex-1 h-[50px] rounded-2xl bg-primary text-white font-bold text-[15px] flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">rate_review</span>
                            Tulis Ulasan
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex-1 h-[50px] rounded-2xl bg-primary text-white font-bold text-[15px] flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">login</span>
                            Login untuk Ulasan
                        </Link>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-20 border-t border-primary/10 bg-surface py-10 px-4">
                    <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary/20 rounded flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[18px]">restaurant</span>
                            </div>
                            <span className="font-bold">Semarang Food Explorer</span>
                        </div>
                        <div className="text-ink-500 text-sm">
                            © {new Date().getFullYear()} Semarang Food Explorer. All rights reserved.
                        </div>
                    </div>
                </footer>

                {/* Fullscreen Full-width Lightbox overlay */}
                {lightboxImages.length > 0 && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-2 rounded-full backdrop-blur-md transition-all z-10"
                        >
                            <span className="material-symbols-outlined text-3xl leading-none">close</span>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/90 font-medium text-sm bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                            {currentLightboxIndex + 1} / {lightboxImages.length}
                        </div>

                        {/* Prev button */}
                        {lightboxImages.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-2 md:left-8 text-white/50 hover:text-white bg-black/20 hover:bg-black/60 p-3 md:p-4 rounded-full backdrop-blur-md transition-all drop-shadow-lg z-[110] hidden md:flex"
                            >
                                <span className="material-symbols-outlined text-4xl leading-none">chevron_left</span>
                            </button>
                        )}

                        {/* Clickable Image Area container (Click left half for prev, right half for next on mobile) */}
                        <div 
                            className="relative w-full h-[85vh] flex items-center justify-center px-0 md:px-24"
                            onClick={closeLightbox}
                        >
                            <img
                                src={lightboxImages[currentLightboxIndex]}
                                alt="Galeri Ulasan"
                                className="max-w-full max-h-full object-contain drop-shadow-2xl select-none animate-in zoom-in-95 duration-300"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent close on image click
                                    if (lightboxImages.length > 1) {
                                        // Allow clicking right half of image to go next
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        if (x > rect.width / 2) nextImage(e);
                                        else prevImage(e);
                                    }
                                }} 
                            />

                            {/* Mobile tap areas for Prev/Next */}
                            {lightboxImages.length > 1 && (
                                <>
                                    <div className="absolute top-0 bottom-0 left-0 w-1/3 z-20 md:hidden" onClick={prevImage}></div>
                                    <div className="absolute top-0 bottom-0 right-0 w-1/3 z-20 md:hidden" onClick={nextImage}></div>
                                </>
                            )}
                        </div>

                        {/* Next button */}
                        {lightboxImages.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-2 md:right-8 text-white/50 hover:text-white bg-black/20 hover:bg-black/60 p-3 md:p-4 rounded-full backdrop-blur-md transition-all drop-shadow-lg z-[110] hidden md:flex"
                            >
                                <span className="material-symbols-outlined text-4xl leading-none">chevron_right</span>
                            </button>
                        )}
                        
                        {/* Filmstrip at bottom */}
                        {lightboxImages.length > 1 && (
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
                                {lightboxImages.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentLightboxIndex(idx); }}
                                        className={`relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-md overflow-hidden transition-all ${
                                            idx === currentLightboxIndex ? 'ring-2 ring-white scale-110 shadow-lg opacity-100' : 'opacity-40 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={src} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
