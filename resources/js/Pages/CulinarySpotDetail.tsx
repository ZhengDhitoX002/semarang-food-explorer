import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ReviewItem from '@/Components/ReviewItem';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface Review {
    id: number;
    user: { id: number; name: string };
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
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
    
    const isFavorite = auth.favorite_spots?.includes(spot.id) || false;

    const reviewForm = useForm({
        spot_id: spot.id,
        rating: 5,
        comment: '',
    });

    const submitReview = (e: FormEvent) => {
        e.preventDefault();
        reviewForm.post('/reviews', {
            preserveScroll: true,
            onSuccess: () => {
                setShowReviewForm(false);
                reviewForm.reset('comment', 'rating');
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
                                className="md:col-span-2 relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center"
                                style={{ backgroundImage: `url("${heroImages[0]}")` }}
                            >
                                {spot.is_promoted && (
                                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                        ⭐ Promoted
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:grid grid-rows-2 gap-4">
                                <div className="relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url("${heroImages[1]}")` }}
                                ></div>
                                <div className="relative overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url("${heroImages[2]}")` }}
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
                                            <span className={`material-symbols-outlined ${isFavorite ? 'text-red-500 fill-icon' : 'text-slate-400'}`}>
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
                                <p className="text-slate-600 leading-relaxed">{spot.description}</p>
                            </div>

                            {/* Reviews Section */}
                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Ulasan ({spot.review_count})</h3>
                                    {auth.user ? (
                                        <button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className="text-primary font-bold flex items-center gap-1 hover:underline"
                                        >
                                            Tulis Ulasan <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    ) : (
                                        <Link href="/login" className="text-primary font-bold flex items-center gap-1 hover:underline">
                                            Login untuk review <span className="material-symbols-outlined">login</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Review Form */}
                                {showReviewForm && auth.user && (
                                    <div className="bg-primary/5 rounded-xl p-6 mb-6 border border-primary/10">
                                        <form onSubmit={submitReview} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => reviewForm.setData('rating', star)}
                                                            className={`text-2xl transition-colors ${
                                                                star <= reviewForm.data.rating ? 'text-yellow-400' : 'text-slate-300'
                                                            }`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Komentar</label>
                                                <textarea
                                                    value={reviewForm.data.comment}
                                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                    placeholder="Ceritakan pengalaman Anda di sini..."
                                                    required
                                                />
                                                {reviewForm.errors.comment && <p className="text-red-500 text-xs mt-1">{reviewForm.errors.comment}</p>}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="submit"
                                                    disabled={reviewForm.processing}
                                                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                                                >
                                                    {reviewForm.processing ? 'Mengirim...' : 'Kirim Ulasan'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowReviewForm(false)}
                                                    className="px-6 py-2.5 border border-slate-200 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all"
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
                                            <div key={review.id} className="bg-white rounded-xl border border-slate-100 p-5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {review.user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{review.user.name}</p>
                                                            <p className="text-xs text-slate-400">{timeAgo(review.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                                                        ))}
                                                        {review.is_verified && (
                                                            <span className="ml-2 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">Verified</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">rate_review</span>
                                            <p>Belum ada ulasan. Jadilah yang pertama!</p>
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
                                <div className="w-full h-48 rounded-lg overflow-hidden relative mb-4">
                                    <MapContainer center={[lat, lng]} zoom={16} keyboard={false} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                        <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" attribution="&copy; Google Maps" />
                                        <Marker position={[lat, lng]}>
                                            <Popup>{spot.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <p className="font-bold">{spot.name}</p>
                                <p className="text-slate-500 text-sm mb-4">Semarang, Jawa Tengah</p>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 bg-slate-100 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all text-center"
                                >
                                    Dapatkan Arah
                                </a>
                            </div>

                            {/* Info */}
                            <div className="bg-white rounded-xl border border-primary/10 p-5 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Kategori</span>
                                        <span className="font-medium">{spot.category?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Harga Rata-rata</span>
                                        <span className="font-bold text-primary">Rp {Number(spot.price).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Status</span>
                                        <span className={`font-bold ${spot.is_promoted ? 'text-primary' : 'text-slate-400'}`}>
                                            {spot.is_promoted ? '⭐ Promoted' : 'Reguler'}
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
            </div>
        </>
    );
}
