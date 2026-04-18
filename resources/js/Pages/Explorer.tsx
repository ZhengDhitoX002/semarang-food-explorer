import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SpotCard, { CulinarySpot } from '@/Components/SpotCard';
import PromoCard, { PromoSpot } from '@/Components/PromoCard';
import FilterSidebar from '@/Components/FilterSidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Category {
    id: number;
    name: string;
}

interface CulinarySpotDB {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    price: string;
    is_promoted: boolean;
    average_rating: number;
    review_count: number;
    category?: Category;
}

const nearbyResults = [
    {
        name: 'Lumpia Gang Lombok',
        area: 'Semarang Tengah • 0.8km',
        rating: 4.9,
        price: 'Rp 15k - 30k',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR0NJ2BXOgbgVJd2-n0b0t0Mal4At8tfkWyD4WMsSgvPgOSBrkfeS6YCHon__LUHNEQK-tm7BKVuyDpFeiS6YgczJZCXKT0XABIrMoYGj8eISKrfHaFJTYlhAj6F_tJPr7ke3bQDEdtDIGCwIG3mrzThCn5QVlyauCu6QbqlcvkI8aRcvdQfGTYh281MVsfVbLDt5E0R6gRQociOHZeFsy4aK6bHnWTHJuXjLsjUuvo1gBXTcy-K6IUX-zjZg5MC6uaRYYvqBeXlU3',
    },
    {
        name: 'Pesta Keboen',
        area: 'Jl. Veteran • 1.2km',
        rating: 4.7,
        price: 'Rp 50k - 150k',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvJcPLnS7eLGAkU1wp3_ujEzJJyT86iY7Gz5QMRrtVDSmISMtLOhbFk_6HOJQRp7Yp6p4kTgyN2JvfpVSmdmSwoUQqu6ajzEUVhQnaJGrfqnutR0jDl2kHVxKtAOKCiDjy6IRsanrj04V7fHbGaMT8ZDO_SCk0DgEtFbD5piuwhHmYntbWFMzONS93xeOrq_PaOSVrcQLtLiFA-AdhsAX9cNc6Xiyu8Tm647p3BC7rrsbzCJDkHLzwlGhnTzyi4ojPA4VKHXNSP973',
    },
];

export default function Explorer() {
    const { spots, filters, auth } = usePage<{ spots: CulinarySpotDB[], filters: { search?: string }, auth: { user?: { id: number; name: string; role: string }, favorite_spots?: number[] } }>().props;
    const filterTabs = ['Semua Kategori', ...Array.from(new Set(spots.map(s => s.category?.name).filter(Boolean))) as string[]];
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [activeFilter, setActiveFilter] = useState('Semua Kategori');

    // Filter states
    const [maxPrice, setMaxPrice] = useState<number>(300000);
    const [minRating, setMinRating] = useState<number>(0);
    const [showFilters, setShowFilters] = useState(false);

    // Favorites Logic
    const toggleFavorite = useCallback((e: React.MouseEvent, id: number) => {
        e.preventDefault(); // Prevent native navigation
        e.stopPropagation(); // Prevent Inertia Link bubbling
        if (!auth.user) {
            router.get('/login');
            return;
        }
        router.post(`/favorites/${id}`, {}, { preserveScroll: true, preserveState: true });
    }, [auth.user]);

    // Search: use local state, only send to server on Enter key
    const [searchInput, setSearchInput] = useState(filters?.search || '');
    const searchRef = useRef<HTMLInputElement>(null);

    const doSearch = useCallback(() => {
        if (searchInput.trim() === '') {
            router.get('/', {}, { preserveState: true, preserveScroll: true, replace: true });
        } else {
            router.get('/', { search: searchInput }, { preserveState: true, preserveScroll: true, replace: true });
        }
    }, [searchInput]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        }
    };

    const filteredSpotsDB = spots.filter(spot => {
        if (activeFilter !== 'Semua Kategori' && spot.category?.name !== activeFilter) return false;
        if (Number(spot.price) > maxPrice) return false;
        if ((spot.average_rating || 0) < minRating) return false;
        return true;
    });

    // Extract dynamic categories from DB
    const categories = ['All', ...Array.from(new Set(spots.map(s => s.category?.name).filter(Boolean))) as string[]];

    // Mapper from DB to Component Props
    const mappedSpots: CulinarySpot[] = filteredSpotsDB.map(spot => {
        const isKnownSpot = spot.name.match(/(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i);
        const folderName = spot.name.toUpperCase().replace(/\s+/g, '_');
        
        return {
            id: spot.id,
            name: spot.name,
            imageUrl: isKnownSpot ? `/images/merchants/${folderName}/unnamed.webp` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            imageAlt: spot.name,
            rating: spot.average_rating || 0,
            location: spot.description.substring(0, 30) + '...',
            tags: [spot.category?.name || 'Local'],
            priceLevel: Number(spot.price) > 50000 ? '$$$' : '$$',
            isVerified: spot.is_promoted,
        };
    });

    const promoSpots: PromoSpot[] = spots.filter(s => s.is_promoted).map(spot => {
        const isKnownSpot = spot.name.match(/(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i);
        const folderName = spot.name.toUpperCase().replace(/\s+/g, '_');
        
        return {
            id: spot.id,
            name: spot.name,
            imageUrl: isKnownSpot ? `/images/merchants/${folderName}/unnamed.webp` : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            imageAlt: spot.name,
            rating: 4.8,
            reviewCount: '1.2k',
            price: `Rp ${Number(spot.price).toLocaleString('id-ID')}`,
            badge: 'Featured',
        };
    });

    // Center of Semarang
    const mapCenter: [number, number] = [-6.9932, 110.4203];

    return (
        <>
            <Head title="Discover Authentic Tastes" />

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
                {/* Sidebar / List View */}
                {viewMode === 'list' && (
                    <>
                        <aside className="w-full md:w-[420px] lg:w-[480px] bg-background-light border-r border-slate-100 flex flex-col z-20 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
                            {/* Search Box */}
                            <div className="px-6 pt-5 pb-2">
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400" style={{ fontSize: '20px' }}>search</span>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder="Cari kuliner... (tekan Enter)"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '48px',
                                            paddingTop: '12px',
                                            paddingBottom: '12px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            outline: 'none',
                                        }}
                                    />
                                    <button
                                        onClick={doSearch}
                                        className="absolute right-2 bg-primary text-white rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-primary/90 transition-colors"
                                    >
                                        Cari
                                    </button>
                                </div>
                                {filters?.search && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Hasil untuk: <strong className="text-primary">"{filters.search}"</strong></span>
                                        <button
                                            onClick={() => {
                                                setSearchInput('');
                                                router.get('/', {}, { preserveState: true, preserveScroll: true, replace: true });
                                            }}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                )}
                                <div className="mt-2">
                                    <button 
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-1 text-sm text-slate-500 font-bold hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">tune</span>
                                        {showFilters ? 'Sembunyikan Filter Harga & Rating' : 'Filter Harga & Rating'}
                                    </button>
                                    
                                    {showFilters && (
                                        <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-700 flex justify-between">
                                                    <span>Harga Maks:</span>
                                                    <span className="text-primary">Rp {maxPrice.toLocaleString('id-ID')}</span>
                                                </label>
                                                <input 
                                                    type="range" min="0" max="300000" step="5000" 
                                                    value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                                                    className="w-full accent-primary cursor-pointer border hover:shadow-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-700 flex justify-between">
                                                    <span>Min Rating:</span>
                                                    <span className="text-primary flex items-center"><span className="material-symbols-outlined text-[14px]">star</span> {minRating.toFixed(1)}</span>
                                                </label>
                                                <input 
                                                    type="range" min="0" max="5" step="0.5" 
                                                    value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                                                    className="w-full accent-primary cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Filter Tabs */}
                            <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-100">
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                            activeFilter === tab
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-white border border-slate-200 font-semibold hover:border-primary/50'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {/* Feed Content */}
                            <div scroll-region="true" className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                {mappedSpots.length > 0 ? (
                                    mappedSpots.map((spot) => (
                                        <SpotCard 
                                            key={spot.id} 
                                            spot={spot} 
                                            isFavorite={auth.favorite_spots?.includes(spot.id)}
                                            onToggleFavorite={toggleFavorite}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">search_off</span>
                                        <p className="text-slate-500 font-medium">Tidak ada hasil ditemukan</p>
                                        <p className="text-slate-400 text-sm mt-1">Coba kata kunci lain</p>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Map View (Desktop) */}
                        <div className="hidden md:block flex-1 relative" style={{ height: 'calc(100vh - 64px)' }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={13}
                                scrollWheelZoom={true}
                                keyboard={false}
                                style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
                            >
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution="&copy; Google Maps"
                                />
                                {filteredSpotsDB.map((spot) => (
                                    <Marker key={spot.id} position={[Number(spot.latitude), Number(spot.longitude)]}>
                                        <Popup>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{spot.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{spot.category?.name}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </>
                )}

                {/* Mobile/Full Map View */}
                {viewMode === 'map' && (
                    <>
                        <div className="flex-1 relative" style={{ height: 'calc(100vh - 64px)' }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={14}
                                scrollWheelZoom={true}
                                keyboard={false}
                                style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
                            >
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution="&copy; Google Maps"
                                />
                                {filteredSpotsDB.map((spot) => (
                                    <Marker key={spot.id} position={[Number(spot.latitude), Number(spot.longitude)]}>
                                        <Popup>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{spot.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{spot.category?.name}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Filter Sidebar overlay on map for mobile/desktop layout switch */}
                        <aside className="w-full border-l border-primary/10 bg-white md:w-80 lg:w-96 flex flex-col overflow-hidden hidden md:flex">
                            <FilterSidebar categories={categories} />
                            {/* Nearby Results */}
                            <div className="px-6 pb-6 space-y-4">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Nearby Results
                                </h2>
                                {nearbyResults.map((result) => (
                                    <div
                                        key={result.name}
                                        className="group flex cursor-pointer gap-4 rounded-xl border border-transparent p-2 transition-all hover:border-primary/20 hover:bg-primary/5"
                                    >
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                                            <img
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                src={result.imageUrl}
                                                alt={result.name}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{result.name}</h3>
                                                <p className="text-xs text-slate-500">{result.area}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center text-xs font-bold text-primary">
                                                    <span className="material-symbols-outlined text-xs mr-0.5">
                                                        star
                                                    </span>
                                                    {result.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </>
                )}
            </div>

            {/* Promoted Culinary Section */}
            <section className="border-t border-primary/10 bg-white p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Promoted Culinary</h2>
                            <p className="text-slate-500">Handpicked featured spots for your food journey</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline">
                            View All Promotions
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {promoSpots.length > 0 ? (
                            promoSpots.map((spot) => <PromoCard key={spot.id} spot={spot} />)
                        ) : (
                            <p className="text-sm text-slate-500">No promoted spots found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Floating View Toggle — positioned at bottom-right above the nav bar for easy thumb access without blocking scroll */}
            <div className="md:hidden fixed bottom-[84px] right-4 z-40">
                <button
                    onClick={() => {
                        setViewMode(viewMode === 'list' ? 'map' : 'list');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 pl-4 pr-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 active:scale-95"
                    style={{
                        background: viewMode === 'list'
                            ? 'linear-gradient(135deg, #1a1a21 0%, #2d2d3a 100%)'
                            : 'linear-gradient(135deg, #e77e23 0%, #f4a261 100%)',
                        color: '#fff',
                        boxShadow: viewMode === 'list'
                            ? '0 8px 32px rgba(26, 26, 33, 0.35), 0 2px 8px rgba(0,0,0,0.15)'
                            : '0 8px 32px rgba(231, 126, 35, 0.35), 0 2px 8px rgba(231, 126, 35, 0.15)',
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {viewMode === 'list' ? 'map' : 'view_list'}
                    </span>
                    <span>{viewMode === 'list' ? 'Map' : 'List'}</span>
                </button>
            </div>
        </>
    );
}

Explorer.layout = (page: React.ReactNode) => <AppLayout showSearch={false} activeTab="explore">{page}</AppLayout>;

