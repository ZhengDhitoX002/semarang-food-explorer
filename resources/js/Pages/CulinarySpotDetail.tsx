import React, { FormEvent, useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Review {
    id: number;
    user: { id: number; name: string };
    rating: number;
    comment: string;
    is_verified: boolean;
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
    latitude: string;
    longitude: string;
    price: string;
    is_promoted: boolean;
    average_rating: number;
    review_count: number;
    category?: { id: number; name: string };
    reviews: Review[];
}

export default function CulinarySpotDetail() {
    const { spot, auth } = usePage<{ spot: SpotData; auth: { user?: { id: number; name: string; role: string }, favorite_spots?: number[] } }>().props;
    const [showReviewForm, setShowReviewForm] = useState(false);
    
    // Lightbox State
    const [lightboxImages, setLightboxImages] = useState<string[]>([]);
    const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

    const isFavorite = auth.favorite_spots?.includes(spot.id) || false;

    const reviewForm = useForm({
        spot_id: spot.id,
        rating: 5,
        comment: '',
        photos: [] as File[],
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);

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

    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images);
        setCurrentLightboxIndex(index);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeLightbox = () => {
        setLightboxImages([]);
        document.body.style.overflow = 'auto'; // Fix scrolling frozen issue
    };

    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    };

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
    }, [lightboxImages]);

    const lat = Number(spot.latitude);
    const lng = Number(spot.longitude);

    const isKnownSpot = spot.name.match(/(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i);
    const folderName = spot.name.toUpperCase().replace(/\s+/g, '_');

    const heroImages = isKnownSpot ? [
        `/images/merchants/${folderName}/unnamed.webp`,
        `/images/merchants/${folderName}/unnamed (1).webp`,
        `/images/merchants/${folderName}/unnamed (2).webp`,
    ] : [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLhWzNxGZHTXERnZjz0e7Qg76YTAM6IEyi_WQyEOTdjLiNPcGuNOs9WQ_H8vOV4TVC_0six0KCLGVmW78xnFYisTrkBh34c7TPu5xqBd4vG1IhuFdu3ugenuS_X3-ZrVnf5Lhx2l3Q5nwhiopQZf0uMzv639VHtS5SmMX0d0AW-Fd7TUGbxPzXWdfxratJF_l8MQbuoyliriK9GMEk9D2yJyilwXODOach5v8i2AGzw1K91_MoqAgpDpaKCWQ3I14xBESbuM35fnFh',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCuLCx98Fp0qcutnnwP2gcJhNatE8ezSC1w7vjcBl1bL4cndXJTpAvtSNyxhucKS4W7dD892XBL55HK5fBbYO71PE6ENRttf_3hBrUnwWI6wB1NmA0JhXKALRflUijpJFpqXtftwPDUDkflUVbYcmBCL67ZTcBTfHonPPTzJ6r04Y-I7wOYbemqxm9sXX49yinf5gRGdp2k6gYk147V1i03zhouo1c0KeUv789_v9Dmd5928hJSQgEPTfZ2Oebcmu_Xu8Dcn23SRcb9',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0RfkrjRd-q5Qm3RvGd82v_n2ksUV51tIEw5yaNlGPZSWVA5U0ms3kgZVBiw-dMdw346cBU4uRwpedL6wT5itNjXEfuuF9uDSIY0e9TCBzLvnHwk1GdPHVYpJTtqxRsPp7h7_SD_64mA1znSoxg_POvixRuHwBTaJwyMBC1MhN5OLBYElEHsKSDy6DHcLBQPOe2zuAdyYoDG7QsxKzSuG0o70P1tNI2Z4kBEtH0nhvmu5mShpClArfq9PydQ4u8QLvhNP9xoJSAJ7k',
    ];

    // Fix for absolute URLs from Spatie generating wrong domain
    const getMediaUrl = (url: string) => {
        if (!url) return '';
        return url.replace(/^https?:\/\/[^\/]+/, '');
    };

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
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900">
                {/* Top Navigation */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-20 py-3">
                    <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">restaurant</span>
                                </div>
                                <h2 className="text-lg font-bold leading-tight tracking-tight">
                                    {spot.name}
                                </h2>
                            </Link>
                        </div>
                        <div className="flex gap-3 items-center">
                            {auth.user ? (
                                <span className="text-sm text-slate-500">Hi, {auth.user.name}</span>
                            ) : (
                                <Link href="/login" className="text-sm font-bold text-primary hover:underline">Login</Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-[1200px] mx-auto w-full px-4 py-6">
                    {/* Hero Gallery */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[450px]">
                            <div
                                className="md:col-span-2 relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center cursor-pointer"
                                style={{ backgroundImage: `url("${heroImages[0]}")` }}
                                onClick={() => openLightbox(heroImages, 0)}
                            >
                                {spot.is_promoted && (
                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        ⭐ Promoted
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:grid grid-rows-2 gap-4">
                                <div className="relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center cursor-pointer"
                                    style={{ backgroundImage: `url("${heroImages[1]}")` }}
                                    onClick={() => openLightbox(heroImages, 1)}
                                ></div>
                                <div className="relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center cursor-pointer"
                                    style={{ backgroundImage: `url("${heroImages[2]}")` }}
                                    onClick={() => openLightbox(heroImages, 2)}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-4xl font-bold tracking-tight">{spot.name}</h1>
                                        <button
                                            onClick={toggleFavorite}
                                            className="bg-white border text-[24px] border-slate-200 w-12 h-12 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            <span className={`material-symbols-outlined leading-none m-0 p-0 ${isFavorite ? 'text-red-500 fill-icon' : 'text-slate-400'}`}>
                                                favorite
                                            </span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                            {spot.category?.name || 'Kuliner'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                {[
                                    { icon: 'star', value: spot.average_rating > 0 ? spot.average_rating.toString() : '-', label: 'Rating' },
                                    { icon: 'reviews', value: spot.review_count.toString(), label: 'Reviews' },
                                    { icon: 'payments', value: `Rp ${Number(spot.price).toLocaleString('id-ID')}`, label: 'Harga Rata-rata' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex-1 min-w-[140px] bg-white border border-primary/10 rounded-xl p-4 flex flex-col items-center text-center">
                                        <span className="material-symbols-outlined text-primary mb-1">{stat.icon}</span>
                                        <span className="text-2xl font-bold">{stat.value}</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold mb-4">Tentang Tempat Ini</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{spot.description}</p>
                            </div>

                            {/* Reviews Section */}
                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Ulasan ({spot.review_count})</h3>
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
                                    <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-200 shadow-sm mt-4">
                                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                            Pengalaman Anda di {spot.name}?
                                        </h4>
                                        <form onSubmit={submitReview} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Beri Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => reviewForm.setData('rating', star)}
                                                            className={`text-3xl transition-transform hover:scale-110 ${
                                                                star <= reviewForm.data.rating ? 'text-yellow-400' : 'text-slate-200'
                                                            }`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Cerita Anda</label>
                                                <textarea
                                                    value={reviewForm.data.comment}
                                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow bg-slate-50 focus:bg-white"
                                                    placeholder="Bagikan detil makanan, suasana, dan pelayanan toko ini..."
                                                    required
                                                />
                                                {reviewForm.errors.comment && <p className="text-red-500 text-xs mt-1 font-medium">{reviewForm.errors.comment}</p>}
                                            </div>

                                            {/* Photo Upload Section */}
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Tambah Foto</label>
                                                
                                                {/* Previews Array */}
                                                {previewImages.length > 0 && (
                                                    <div className="flex flex-wrap gap-3 mb-3">
                                                        {previewImages.map((src, idx) => (
                                                            <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
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
                                                    className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all focus:ring-4 focus:ring-slate-100"
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
                                            <div key={review.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold shadow-sm">
                                                            {review.user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-900">{review.user.name}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{timeAgo(review.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                                                        ))}
                                                        {review.is_verified && (
                                                            <span className="ml-2 text-[10px] bg-green-50 text-green-600 border border-green-200/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Terverifikasi</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                                                
                                                {/* Review Photos */}
                                                {review.media && review.media.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {review.media.map((image, idx) => {
                                                            const fixedUrl = getMediaUrl(image.original_url);
                                                            // We pass the full array to lightbox mapped to their original URLs
                                                            const allPhotoUrls = review.media!.map(m => getMediaUrl(m.original_url));
                                                            return (
                                                                <button
                                                                    key={image.id}
                                                                    type="button"
                                                                    onClick={() => openLightbox(allPhotoUrls, idx)}
                                                                    className="relative h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none group bg-slate-50"
                                                                >
                                                                    <img 
                                                                        src={fixedUrl} 
                                                                        alt={`Review photo ${idx + 1}`} 
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                                        loading="lazy"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">rate_review</span>
                                            <p className="text-slate-500 font-medium">Belum ada ulasan untuk tempat ini.</p>
                                            <p className="text-slate-400 text-sm mt-1">Jadilah yang pertama menceritakan pengalaman Anda!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Map */}
                            <div className="bg-white rounded-xl border border-primary/10 p-5 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    Lokasi
                                </h3>
                                <div className="w-full h-48 rounded-lg overflow-hidden relative mb-4 border border-slate-200">
                                    <MapContainer center={[lat, lng]} zoom={16} keyboard={false} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                        <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" attribution="&copy; Google Maps" />
                                        <Marker position={[lat, lng]}>
                                            <Popup>{spot.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <p className="font-bold text-slate-900">{spot.name}</p>
                                <p className="text-slate-500 text-sm mb-4">Semarang, Jawa Tengah</p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 bg-slate-100 rounded-lg font-bold text-slate-700 text-sm hover:bg-primary hover:text-white hover:shadow-md transition-all text-center focus:ring-4 focus:ring-primary/20"
                                >
                                    Dapatkan Arah Google Maps
                                </a>
                            </div>

                            {/* Info */}
                            <div className="bg-white rounded-xl border border-primary/10 p-5 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Info Singkat
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                        <span className="text-slate-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">category</span> Kategori</span>
                                        <span className="font-bold text-slate-800">{spot.category?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                        <span className="text-slate-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">payments</span> Harga Perkiraan</span>
                                        <span className="font-bold text-primary">Rp {Number(spot.price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 flex items-center gap-1.5 font-medium"><span className="material-symbols-outlined text-[16px]">verified</span> Status</span>
                                        <span className={`font-bold text-[11px] px-2 py-1 rounded-md uppercase tracking-wider ${spot.is_promoted ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                                            {spot.is_promoted ? 'Promoted' : 'Reguler'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-20 border-t border-primary/10 bg-white py-10 px-4">
                    <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary/20 rounded flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[18px]">restaurant</span>
                            </div>
                            <span className="font-bold">Semarang Food Explorer</span>
                        </div>
                        <div className="text-slate-500 text-sm">
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
