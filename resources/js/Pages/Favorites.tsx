import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface FavoriteSpot {
    id: number;
    name: string;
    description: string;
    price: number;
    latitude: number;
    longitude: number;
    category?: { name: string };
    average_rating: number;
    review_count: number;
    media?: any[];
}

export default function Favorites({ favorites = [] }: { favorites: FavoriteSpot[] }) {
    const { auth } = usePage<any>().props;

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/favorites/${id}`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Favorites" />

            <div className="flex-1 flex flex-col px-4 pt-4 pb-20">
                <div className="mb-6 mt-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tempat Favorit Kamu</h2>
                    <p className="text-sm text-slate-500 font-medium">Koleksi kuliner terbaik yang kamu simpan.</p>
                </div>

                {!auth?.user ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-slate-100">
                            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '48px' }}>lock</span>
                        </div>
                        <p className="text-slate-500 text-center max-w-sm mb-6 leading-relaxed">
                            Akses daftar favorit eksklusif Anda dengan masuk ke akun terlebih dahulu.
                        </p>
                        <Link href="/login" className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-colors">
                            Masuk Sekarang
                        </Link>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10">
                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 bg-orange-50">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>favorite</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada favorit</h3>
                        <p className="text-slate-500 text-center text-sm max-w-xs mb-6">
                            Jelajahi peta dan simpan tempat kuliner yang menarik perhatianmu ke daftar ini.
                        </p>
                        <Link href="/" className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-dark transition-colors">
                            Cari Kuliner
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((spot) => (
                            <Link key={spot.id} href={`/spot/${spot.id}`} className="group relative bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300">
                                {/* Thumbnail Image */}
                                <div className="h-40 w-full bg-slate-100 overflow-hidden relative">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(spot.name)}&background=f8fafc&color=94a3b8`} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {/* Unfavorite Button overlay */}
                                    <button 
                                        onClick={(e) => toggleFavorite(e, spot.id)}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-red-500 font-[800]">favorite</span>
                                    </button>
                                </div>
                                {/* Content Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">{spot.name}</h3>
                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-600">
                                            <span className="material-symbols-outlined text-[14px]">star</span>
                                            <span className="text-xs font-bold">{spot.average_rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium mb-3">{spot.category?.name || 'Kuliner'}</p>
                                    <p className="text-primary font-bold text-sm">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(spot.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Favorites.layout = (page: React.ReactNode) => <AppLayout activeTab="favorites" showFooter={false}>{page}</AppLayout>;

