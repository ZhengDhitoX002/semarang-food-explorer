import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SpotCard from '@/Components/SpotCard';

interface FavoriteSpot {
    id: number;
    name: string;
    description: string;
    price: number;
    latitude: string;
    longitude: string;
    category?: { name: string };
    average_rating: number;
    review_count: number;
    media?: any[];
    is_promoted?: boolean;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((spot) => {
                            const isKnownSpot = spot.name.match(/(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i);
                            const folderName = spot.name.toUpperCase().replace(/\s+/g, '_');
                            
                            const mappedSpot = {
                                id: spot.id,
                                name: spot.name,
                                imageUrl: isKnownSpot ? `/images/merchants/${folderName}/unnamed.webp` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                                imageAlt: spot.name,
                                rating: spot.average_rating || 0,
                                location: spot.description ? spot.description.substring(0, 30) + '...' : 'Semarang',
                                tags: [spot.category?.name || 'Local'],
                                priceLevel: Number(spot.price) > 50000 ? '$$$' : '$$',
                                isVerified: spot.is_promoted,
                            };

                            return (
                                <SpotCard 
                                    key={mappedSpot.id} 
                                    spot={mappedSpot} 
                                    isFavorite={true}
                                    onToggleFavorite={toggleFavorite}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

Favorites.layout = (page: React.ReactNode) => <AppLayout activeTab="favorites" showFooter={false}>{page}</AppLayout>;

