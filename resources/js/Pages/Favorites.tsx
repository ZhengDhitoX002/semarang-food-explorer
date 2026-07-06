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
    media?: { id: number; original_url: string }[];
    is_promoted?: boolean;
}

// A handful of spots have curated local photos from the initial redesign
// (public/images/merchants/*); real uploaded media always takes priority.
const CURATED_SPOTS = /(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i;

function resolveSpotImageUrl(name: string, media?: { original_url: string }[]): string | null {
    if (media && media.length > 0) return media[0].original_url;
    if (CURATED_SPOTS.test(name)) {
        const folderName = name.toUpperCase().replace(/\s+/g, '_');
        return `/images/merchants/${folderName}/unnamed.webp`;
    }
    return null;
}

export default function Favorites({ favorites = [], suggestions = [] }: { favorites: FavoriteSpot[]; suggestions?: FavoriteSpot[] }) {
    const { auth } = usePage<any>().props;

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(`/favorites/${id}`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Favorites" />

            <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 pt-4 pb-20">
                <div className="mb-6 mt-2">
                    <h2 className="font-display text-2xl font-bold text-ink-900 tracking-tight">Favorit</h2>
                    <p className="text-sm text-ink-500 font-medium">Tempat yang sudah kamu simpan.</p>
                </div>

                {!auth?.user ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] py-20">
                        <div className="w-[74px] h-[74px] rounded-full flex items-center justify-center mb-4 bg-chip">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '34px' }}>lock</span>
                        </div>
                        <p className="text-ink-500 text-center max-w-sm mb-6 leading-relaxed text-[12.5px]">
                            Akses daftar favorit eksklusif Anda dengan masuk ke akun terlebih dahulu.
                        </p>
                        <Link href="/login" className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-primary hover:bg-primary/90 transition-colors">
                            Masuk Sekarang
                        </Link>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] py-10">
                        <div className="w-[74px] h-[74px] rounded-full flex items-center justify-center mb-4 bg-chip">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '34px' }}>favorite_border</span>
                        </div>
                        <h3 className="font-display text-[17px] font-bold text-ink-900 mb-2">Belum ada favorit tersimpan</h3>
                        <p className="text-ink-500 text-center text-[12.5px] max-w-xs mb-4 leading-relaxed">
                            Ketuk ikon hati di kartu tempat atau halaman detail buat nyimpen kuliner favoritmu di sini — biar gampang balik lagi lain kali.
                        </p>
                        <Link href="/" className="w-full max-w-xs px-6 py-2.5 rounded-full font-bold text-sm text-white bg-primary hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">explore</span>
                            Jelajahi Kuliner
                        </Link>

                        {suggestions.length > 0 && (
                            <div className="w-full max-w-xs mt-4 rounded-[18px] border border-dashed border-ink-300 p-4">
                                <p className="text-[12.5px] font-bold text-ink-500 mb-2">SARAN UNTUK KAMU</p>
                                {suggestions.map((spot) => (
                                    <Link
                                        key={spot.id}
                                        href={`/spot/${spot.id}`}
                                        className="flex items-center gap-3 py-2.5 border-t border-ink-300 first:border-t-0"
                                    >
                                        <div className="w-[38px] h-[38px] rounded-[11px] bg-chip text-primary flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[19px]">restaurant</span>
                                        </div>
                                        <div className="text-left">
                                            <b className="block text-sm font-bold text-ink-900">{spot.name}</b>
                                            <small className="text-xs text-ink-500">
                                                ★{spot.average_rating.toFixed(1)} · {spot.category?.name || 'Local'} · Rp {Math.round(Number(spot.price) / 1000)}rb
                                            </small>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((spot) => {
                            const mappedSpot = {
                                id: spot.id,
                                name: spot.name,
                                imageUrl: resolveSpotImageUrl(spot.name, spot.media),
                                imageAlt: spot.name,
                                rating: spot.average_rating || 0,
                                location: spot.description ? spot.description.substring(0, 30) + '...' : 'Semarang',
                                tags: [spot.category?.name || 'Local'],
                                priceLevel: `Rp ${Math.round(Number(spot.price) / 1000)}rb`,
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

