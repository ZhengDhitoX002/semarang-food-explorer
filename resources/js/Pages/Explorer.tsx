import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SpotCard, { CulinarySpot } from '@/Components/SpotCard';
import PromoCard, { PromoSpot } from '@/Components/PromoCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Warm, price-pill map marker matching the Rempah design (replaces the default blue pin)
const createPricePin = (price: number) => L.divIcon({
    className: '',
    html: `<div class="map-pin"><span class="dot"></span>Rp ${Math.round(price / 1000)}rb</div>`,
    iconSize: undefined,
    iconAnchor: [30, 14],
});

interface Category {
    id: number;
    name: string;
}

interface TagData {
    id: number;
    name: string;
    slug: string;
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
    tags?: TagData[];
    media?: { id: number; original_url: string }[];
}

// A handful of spots have curated local photos from the initial redesign
// (public/images/merchants/*); everything else must use its real uploaded
// photo. No spot should ever fall back to a generic stock image - that
// silently hides missing photos instead of showing an honest empty state.
const CURATED_SPOTS = /(Lekker Paimo|Lumpia Gang Lombok|Mie Kopyok Pak Dhuwur|Nasi Gandul Pak Memet|Soto Bangkong|Toko Oen Semarang)/i;

function resolveSpotImageUrl(name: string, media?: { original_url: string }[]): string | null {
    if (media && media.length > 0) return media[0].original_url;
    if (CURATED_SPOTS.test(name)) {
        const folderName = name.toUpperCase().replace(/\s+/g, '_');
        return `/images/merchants/${folderName}/unnamed.webp`;
    }
    return null;
}

interface PaginatedData {
    data: CulinarySpotDB[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Explorer() {
    const { spots, filters, auth, categories: serverCategories, availableTags } = usePage<{ spots: PaginatedData, filters: { search?: string; category?: string; tags?: string; min_rating?: string }, auth: { user?: { id: number; name: string; role: string }, favorite_spots?: number[] }, categories: Category[], availableTags: TagData[] }>().props;
    const spotsData = spots.data || [];
    const filterTabs = ['Semua Kategori', ...serverCategories.map(c => c.name)];
    // Mobile defaults to the map-first Rempah layout; desktop always shows
    // the list+map split regardless of this state.
    const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
    const [activeFilter, setActiveFilter] = useState('Semua Kategori');

    // Desktop and mobile render entirely different map panes. Gating them
    // with a JS breakpoint check (rather than just CSS `hidden md:...`)
    // ensures only ONE Leaflet map instance ever mounts at a time — two
    // live maps (even with one display:none) means double tile requests
    // and double memory for no benefit.
    const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);
    useEffect(() => {
        const mql = window.matchMedia('(min-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    // Geolocation and Proximity States
    const [nearbySpots, setNearbySpots] = useState<any[]>([]);
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: -6.9822, lng: 110.4091 });

    useEffect(() => {
        const fetchNearby = async (lat: number, lng: number) => {
            try {
                const response = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=2000`);
                const res = await response.json();
                if (res.success) {
                    setNearbySpots(res.data || []);
                }
            } catch (err) {
                console.error("Gagal mengambil data nearby:", err);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserCoords({ lat, lng });
                    fetchNearby(lat, lng);
                },
                () => {
                    fetchNearby(-6.9822, 110.4091);
                }
            );
        } else {
            fetchNearby(-6.9822, 110.4091);
        }
    }, []);

    // Filter states
    const [maxPrice, setMaxPrice] = useState<number>(300000);
    const [minRating, setMinRating] = useState<number>(0);
    const [showFilters, setShowFilters] = useState(false);

    // Scroll-to-top visibility
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Favorites Logic
    const toggleFavorite = useCallback((e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.user) {
            router.get('/login');
            return;
        }
        router.post(`/favorites/${id}`, {}, { preserveScroll: true, preserveState: true });
    }, [auth.user]);

    // Search: use local state, only send to server on Enter key
    const [searchInput, setSearchInput] = useState(filters?.search || '');
    const searchRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<L.Map | null>(null);

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

    const filteredSpotsDB = spotsData.filter(spot => {
        if (activeFilter !== 'Semua Kategori' && spot.category?.name !== activeFilter) return false;
        if (Number(spot.price) > maxPrice) return false;
        if ((spot.average_rating || 0) < minRating) return false;
        return true;
    });

    const mappedSpots: CulinarySpot[] = filteredSpotsDB.map(spot => ({
        id: spot.id,
        name: spot.name,
        imageUrl: resolveSpotImageUrl(spot.name, spot.media),
        imageAlt: spot.name,
        rating: spot.average_rating || 0,
        location: spot.description?.substring(0, 30) + '...',
        tags: [spot.category?.name || 'Local', ...(spot.tags?.map(t => t.name) || [])],
        priceLevel: `Rp ${Math.round(Number(spot.price) / 1000)}rb`,
        isVerified: spot.is_promoted,
    }));

    const promoSpots: PromoSpot[] = spotsData.filter(s => s.is_promoted).map(spot => ({
        id: spot.id,
        name: spot.name,
        imageUrl: resolveSpotImageUrl(spot.name, spot.media),
        imageAlt: spot.name,
        rating: 4.8,
        reviewCount: '1.2k',
        price: `Rp ${Number(spot.price).toLocaleString('id-ID')}`,
        badge: 'Featured',
    }));

    const mapCenter: [number, number] = [userCoords.lat, userCoords.lng];

    // Shared between the desktop sidebar (always visible) and the mobile
    // list mode (toggled via viewMode) so the two don't drift apart.
    const listPane: ReactNode = (
        <>
            {/* Search & Filters — sticky on desktop */}
                        <div className="md:sticky md:top-[64px] z-30 bg-background-light">
                            <div className="px-6 pt-5 pb-2">
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-primary/70" style={{ fontSize: '20px' }}>search</span>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder="Cari kuliner di Semarang…"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '64px',
                                            paddingTop: '13px',
                                            paddingBottom: '13px',
                                            backgroundColor: 'var(--color-surface)',
                                            border: '1px solid var(--color-ink-300)',
                                            borderRadius: 'var(--radius-card)',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            color: 'var(--color-ink-900)',
                                            outline: 'none',
                                            boxShadow: '0 10px 26px -12px rgba(20,12,4,.2)',
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
                                        <span className="text-xs text-ink-500">Hasil untuk: <strong className="text-primary">"{filters.search}"</strong></span>
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
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-display text-sm font-bold text-ink-900">Kategori</span>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-1 text-xs text-primary font-bold hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">tune</span>
                                        {showFilters ? 'Tutup Filter' : 'Filter Harga'}
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="mt-3 p-4 bg-surface border border-ink-300 rounded-xl flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-ink-700 flex justify-between">
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
                                            <label className="text-xs font-bold text-ink-700 flex justify-between">
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
                            {/* Filter Tabs */}
                            <div
                                className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-ink-300"
                                onWheel={(e) => {
                                    if (e.deltaY === 0) return;
                                    e.currentTarget.scrollLeft += e.deltaY;
                                    e.preventDefault();
                                }}
                            >
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveFilter(tab)}
                                        className={`whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                                            activeFilter === tab
                                                ? 'bg-ink-900 text-ink-50 border-ink-900 shadow-sm'
                                                : 'bg-surface border-ink-300 text-ink-900 hover:border-ink-500'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Spot Button */}
                        {auth.user && (
                            <div className="px-6 pt-3">
                                <a
                                    href="/spot/submit"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-secondary-600), var(--color-secondary-500))',
                                        color: '#fff',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_location</span>
                                    Submit Tempat Kuliner
                                </a>
                            </div>
                        )}

                        {/* Feed Content — scrolls naturally with the page */}
                        <div className="p-6 space-y-6">
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
                                    <span className="material-symbols-outlined text-5xl text-ink-300 mb-3">search_off</span>
                                    <p className="text-ink-500 font-medium">Tidak ada hasil ditemukan</p>
                                    <p className="text-ink-400 text-sm mt-1">Coba kata kunci lain</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {spots.last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                                    {spots.links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                link.active
                                                    ? 'bg-primary text-white shadow-md'
                                                    : link.url
                                                        ? 'bg-ink-100 text-ink-600 hover:bg-primary/10'
                                                        : 'text-ink-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                            <p className="text-center text-xs text-ink-400">
                                Menampilkan {spotsData.length} dari {spots.total} tempat kuliner
                            </p>
                        </div>
        </>
    );

    return (
        <>
            <Head title="Discover Authentic Tastes" />

            <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
              {isDesktop ? (
                <>
                {/* Desktop: sidebar list + sticky map split */}
                <aside className="flex md:w-[420px] lg:w-[480px] bg-background-light border-r border-ink-300 flex-col z-20 flex-shrink-0">
                    {listPane}
                </aside>
                <div className="flex-1 relative">
                    <div className="sticky top-[64px]" style={{ height: 'calc(100vh - 64px)' }}>
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={true}
                            keyboard={false}
                            preferCanvas
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                attribution="&copy; Google Maps"
                            />
                            {filteredSpotsDB.map((spot) => (
                                <Marker key={spot.id} position={[Number(spot.latitude), Number(spot.longitude)]} icon={createPricePin(Number(spot.price))}>
                                    <Popup>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{spot.name}</div>
                                        <div style={{ fontSize: '12px', color: '#98836c' }}>{spot.category?.name}</div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
                </>
              ) : (
                /* Mobile: map-first (default) or full list, toggled by viewMode */
                <div className="w-full">
                    {viewMode === 'list' ? (
                        <div className="w-full flex flex-col">{listPane}</div>
                    ) : (
                        <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
                            <MapContainer
                                ref={mapRef}
                                center={mapCenter}
                                zoom={14}
                                scrollWheelZoom={true}
                                keyboard={false}
                                zoomControl={false}
                                preferCanvas
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution="&copy; Google Maps"
                                />
                                {filteredSpotsDB.map((spot) => (
                                    <Marker key={spot.id} position={[Number(spot.latitude), Number(spot.longitude)]} icon={createPricePin(Number(spot.price))}>
                                        <Popup>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{spot.name}</div>
                                            <div style={{ fontSize: '12px', color: '#98836c' }}>{spot.category?.name}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>

                            {/* Search bar + category pills, overlaid on the map */}
                            <div className="absolute top-3 left-0 right-0 z-30 px-4">
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-primary/70 pointer-events-none" style={{ fontSize: '20px' }}>search</span>
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder="Cari kuliner di Semarang…"
                                        className="w-full pl-11 pr-11 py-3.5 rounded-[22px] bg-surface border border-ink-300 text-sm font-medium text-ink-900 outline-none shadow-[0_10px_26px_-12px_rgba(20,12,4,.35)]"
                                    />
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="absolute right-2 w-9 h-9 rounded-full flex items-center justify-center text-ink-600"
                                        aria-label="Filter"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">tune</span>
                                    </button>
                                </div>
                                <div
                                    className="mt-3 flex gap-2 overflow-x-auto no-scrollbar"
                                    style={{ WebkitMaskImage: 'linear-gradient(90deg,#000 88%,transparent)' }}
                                >
                                    {filterTabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveFilter(tab)}
                                            className={`flex-none whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-semibold shadow-[0_4px_12px_-6px_rgba(20,12,4,.3)] border ${
                                                activeFilter === tab
                                                    ? 'bg-ink-900 text-ink-50 border-ink-900'
                                                    : 'bg-surface border-ink-300 text-ink-900'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Locate-me button */}
                            <button
                                onClick={() => mapRef.current?.flyTo([userCoords.lat, userCoords.lng], 15)}
                                className="absolute right-4 bottom-[292px] z-30 w-[46px] h-[46px] rounded-[15px] bg-surface border border-ink-300 shadow-[0_8px_20px_-6px_rgba(20,12,4,.4)] flex items-center justify-center text-ink-900"
                                aria-label="Lokasi saya"
                            >
                                <span className="material-symbols-outlined text-[20px]">near_me</span>
                            </button>

                            {/* "Daftar" — back to full list */}
                            <button
                                onClick={() => setViewMode('list')}
                                className="absolute left-1/2 -translate-x-1/2 bottom-[292px] z-30 flex items-center gap-1.5 bg-ink-900 text-background-light font-bold text-xs px-4 py-2.5 rounded-full shadow-[0_10px_24px_-8px_rgba(20,12,4,.5)]"
                            >
                                <span className="material-symbols-outlined text-[16px]">list</span>
                                Daftar
                            </button>

                            {/* "Dekat Kamu" bottom sheet */}
                            <div className="absolute inset-x-0 bottom-0 z-20 h-[266px] bg-surface rounded-t-[26px] border-t border-ink-300 shadow-[0_-14px_40px_-18px_rgba(20,12,4,.35)] overflow-hidden">
                                <div className="w-10 h-[5px] rounded-full bg-ink-300 mx-auto mt-2.5" />
                                <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
                                    <div>
                                        <p className="font-display font-bold text-ink-900 text-[15px]">Dekat Kamu</p>
                                        <p className="text-xs text-ink-500">{nearbySpots.length} tempat dalam 2 km</p>
                                    </div>
                                    <button onClick={() => setViewMode('list')} className="text-xs font-bold text-primary">
                                        Lihat semua
                                    </button>
                                </div>
                                <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
                                    {nearbySpots.length > 0 ? (
                                        nearbySpots.slice(0, 8).map((spot: any) => (
                                            <div key={spot.id} className="flex-none w-[190px]">
                                                <SpotCard
                                                    spot={{
                                                        id: spot.id,
                                                        name: spot.name,
                                                        imageUrl: resolveSpotImageUrl(spot.name, spot.media),
                                                        imageAlt: spot.name,
                                                        rating: spot.average_rating || 0,
                                                        location: `${spot.address || 'Semarang'} · ${spot.formatted_distance || ''}`,
                                                        tags: [spot.category?.name || 'Local'],
                                                        priceLevel: `Rp ${Math.round(Number(spot.price) / 1000)}rb`,
                                                        isVerified: spot.is_promoted,
                                                    }}
                                                    isFavorite={auth.favorite_spots?.includes(spot.id)}
                                                    onToggleFavorite={toggleFavorite}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-ink-400 py-6">Tidak ada tempat kuliner dalam radius 2 km.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              )}
            </div>

            {/* Promoted Culinary Section */}
            <section className="border-t border-primary/10 bg-surface p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">Promoted Culinary</h2>
                            <p className="text-ink-500">Handpicked featured spots for your food journey</p>
                        </div>
                        <button className="text-sm font-bold text-primary hover:underline">
                            View All Promotions
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {promoSpots.length > 0 ? (
                            promoSpots.map((spot) => <PromoCard key={spot.id} spot={spot} />)
                        ) : (
                            <p className="text-sm text-ink-500">No promoted spots found.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Floating View Toggle (Mobile) — map mode has its own "Daftar" pill, so this only shows in list mode */}
            {viewMode === 'list' && (
                <div className="md:hidden fixed bottom-[84px] right-4 z-40">
                    <button
                        onClick={() => {
                            setViewMode('map');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2 pl-4 pr-5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all duration-300 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-ink-900) 0%, var(--color-ink-800) 100%)',
                            color: '#fff',
                            boxShadow: '0 8px 32px color-mix(in srgb, var(--color-ink-900) 35%, transparent), 0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>map</span>
                        <span>Map</span>
                    </button>
                </div>
            )}

            {/* Scroll to Top FAB */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-[84px] md:bottom-8 left-4 z-40 h-12 w-12 rounded-full bg-surface border border-ink-300 shadow-lg flex items-center justify-center text-ink-600 hover:text-primary hover:border-primary/30 transition-all duration-300 ${
                    showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                aria-label="Scroll to top"
            >
                <span className="material-symbols-outlined">keyboard_arrow_up</span>
            </button>
        </>
    );
}

Explorer.layout = (page: React.ReactNode) => <AppLayout showSearch={false} activeTab="explore">{page}</AppLayout>;
