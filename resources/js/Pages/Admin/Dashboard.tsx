import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Spot {
    id: number;
    name: string;
    description: string;
    status: string;
    closed_reason?: string;
    created_at: string;
    category?: { id: number; name: string };
    submitted_by?: { id: number; name: string };
    submitted_by_user?: { id: number; name: string };
    tags?: { id: number; name: string }[];
    media?: { id: number; original_url: string }[];
}

interface ReviewData {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: { id: number; name: string };
    culinary_spot?: { id: number; name: string };
}

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Props {
    stats: {
        totalUsers: number;
        totalSpots: number;
        totalReviews: number;
        pendingSubmissions: number;
    };
    pendingSpots: Spot[];
    recentReviews: ReviewData[];
    allSpots: Spot[];
    categories: Category[];
    tags: Tag[];
    closureReports: Spot[];
    tab: string;
}

const statusLabel: Record<string, string> = {
    approved: 'Disetujui',
    pending: 'Menunggu',
    pending_close: 'Menunggu',
    closed: 'Tutup',
    rejected: 'Ditolak',
};

const statusColors: Record<string, { bg: string; color: string }> = {
    approved: { bg: 'rgba(125,138,62,.18)', color: '#8fae52' },
    pending: { bg: 'rgba(224,138,62,.18)', color: 'var(--color-admin-accent)' },
    pending_close: { bg: 'rgba(224,138,62,.18)', color: 'var(--color-admin-accent)' },
    closed: { bg: 'rgba(217,100,90,.18)', color: '#ff8a68' },
    rejected: { bg: 'rgba(217,100,90,.18)', color: '#ff8a68' },
};

export default function Dashboard() {
    const { stats, pendingSpots, recentReviews, allSpots, categories, tags, closureReports, tab } = usePage<{ props: Props }>().props as unknown as Props;
    const [activeTab, setActiveTab] = useState(tab || 'overview');
    const [closeReason, setCloseReason] = useState('');
    const [closingSpotId, setClosingSpotId] = useState<number | null>(null);
    const [managingPhotosSpotId, setManagingPhotosSpotId] = useState<number | null>(null);
    const [uploadingPhotoId, setUploadingPhotoId] = useState<number | null>(null);
    const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const photoInputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});
    const MAX_SPOT_PHOTOS = 5;

    const handleAddSpotPhotos = (spotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setPhotoError(null);
        setUploadingPhotoId(spotId);
        router.post(`/admin/spots/${spotId}/photos`, { photos: files }, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => setPhotoError(errors.photos || 'Gagal mengunggah foto.'),
            onFinish: () => setUploadingPhotoId(null),
        });
        e.target.value = '';
    };

    const handleDeleteSpotPhoto = (spotId: number, mediaId: number) => {
        setDeletingMediaId(mediaId);
        router.delete(`/admin/spots/${spotId}/photos/${mediaId}`, {
            preserveScroll: true,
            onFinish: () => setDeletingMediaId(null),
        });
    };

    // Categories & Tags local states
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    const statCards = [
        { label: 'Pengguna', value: stats.totalUsers, icon: 'group' },
        { label: 'Tempat', value: stats.totalSpots, icon: 'restaurant' },
        { label: 'Ulasan', value: stats.totalReviews, icon: 'reviews' },
        { label: 'Menunggu', value: stats.pendingSubmissions, icon: 'pending', hot: true },
    ];

    const cardStyle: React.CSSProperties = {
        background: 'var(--color-admin-surface)',
        border: '1px solid var(--color-admin-line)',
        borderRadius: 18,
        padding: 20,
    };

    const btnStyle = (variant: 'approve' | 'reject' | 'neutral' | 'accent' = 'neutral'): React.CSSProperties => {
        const variants = {
            approve: { background: '#2f8f57', color: '#fff', border: 'none' },
            reject: { background: 'transparent', color: '#ff8a68', border: '1.5px solid rgba(217,100,90,.5)' },
            neutral: { background: 'transparent', color: 'var(--color-admin-ink)', border: '1.5px solid var(--color-admin-line)' },
            accent: { background: 'var(--color-admin-accent)', color: '#fff', border: 'none' },
        } as const;
        return {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            fontFamily: 'var(--font-sans)',
            ...variants[variant],
        };
    };

    const iconBtnStyle: React.CSSProperties = {
        width: 34,
        height: 34,
        borderRadius: 10,
        background: 'transparent',
        border: '1.5px solid var(--color-admin-line)',
        color: 'var(--color-admin-ink)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    };

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? '#fff' : 'var(--color-admin-mut)',
        background: isActive ? 'var(--color-admin-accent)' : 'transparent',
        border: '1px solid ' + (isActive ? 'var(--color-admin-accent)' : 'var(--color-admin-line)'),
        borderRadius: 11,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    });

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px',
        fontSize: 13,
        borderRadius: 10,
        border: '1px solid var(--color-admin-line)',
        background: 'var(--color-admin-bg)',
        color: 'var(--color-admin-ink)',
        outline: 'none',
        fontFamily: 'var(--font-sans)',
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        router.post('/admin/categories', { name: newCategoryName }, {
            onSuccess: () => setNewCategoryName(''),
        });
    };

    const handleUpdateCategory = (id: number) => {
        if (!editingCategoryName.trim()) return;
        router.put(`/admin/categories/${id}`, { name: editingCategoryName }, {
            onSuccess: () => {
                setEditingCategoryId(null);
                setEditingCategoryName('');
            },
        });
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        router.post('/admin/tags', { name: newTagName }, {
            onSuccess: () => setNewTagName(''),
        });
    };

    const tabDefs = [
        { key: 'overview', label: 'Ringkasan', icon: 'space_dashboard' },
        { key: 'pending', label: 'Menunggu', icon: 'pending_actions', count: pendingSpots.length },
        { key: 'reviews', label: 'Moderasi Ulasan', icon: 'reviews' },
        { key: 'spots', label: 'Semua Tempat', icon: 'restaurant' },
        { key: 'categories-tags', label: 'Kategori & Tag', icon: 'sell' },
        { key: 'closures', label: 'Laporan Penutupan', icon: 'report', count: closureReports.length },
    ];

    return (
        <AdminLayout title={tabDefs.find(t => t.key === activeTab)?.label || 'Dashboard'}>
            <Head title="Admin Dashboard" />

            <h1 className="hidden md:block" style={{ fontFamily: 'var(--font-admin-display)', fontSize: 22, fontWeight: 700, marginBottom: 2 }}>
                {tabDefs.find(t => t.key === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="hidden md:block" style={{ fontSize: 12.5, color: 'var(--color-admin-mut)', marginBottom: 24 }}>
                Ringkasan &amp; moderasi platform Semarang Food Explorer
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            ...cardStyle,
                            ...(stat.hot ? { borderColor: 'rgba(224,138,62,.5)', background: 'rgba(224,138,62,.08)' } : {}),
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 600, color: 'var(--color-admin-mut)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{stat.icon}</span>
                            {stat.label}
                        </div>
                        <p style={{ fontFamily: 'var(--font-admin-display)', fontSize: 23, fontWeight: 700, marginTop: 11 }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
                {tabDefs.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(activeTab === t.key)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
                        {t.label}
                        {typeof t.count === 'number' && ` (${t.count})`}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div style={cardStyle}>
                    <h2 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Panduan Cepat</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--color-admin-mut)', fontSize: 13, lineHeight: 1.6 }}>
                        {[
                            { icon: 'pending_actions', title: 'Tinjau tempat yang diajukan pengguna', desc: `${pendingSpots.length} tempat menunggu di tab Menunggu — makin cepat ditinjau, makin cepat tampil ke publik.` },
                            { icon: 'reviews', title: 'Moderasi ulasan yang dilaporkan', desc: 'Hapus ulasan yang melanggar pedoman komunitas di tab Moderasi Ulasan.' },
                            { icon: 'sell', title: 'Rapikan kategori & tag', desc: 'Gabungkan kategori duplikat atau tambah tag baru supaya pencarian tetap relevan.' },
                            { icon: 'report', title: 'Konfirmasi laporan tempat tutup', desc: `${closureReports.length} laporan menunggu — cek dulu sebelum status tempat berubah jadi Tutup.` },
                        ].map((g) => (
                            <div key={g.title} style={{ display: 'flex', gap: 12 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-admin-accent)', flexShrink: 0 }}>{g.icon}</span>
                                <div>
                                    <b style={{ display: 'block', color: 'var(--color-admin-ink)', fontSize: 13.5 }}>{g.title}</b>
                                    <p style={{ marginTop: 3 }}>{g.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'pending' && (
                <div>
                    {pendingSpots.length === 0 ? (
                        <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-admin-mut)', display: 'block', marginBottom: 10 }}>task_alt</span>
                            <p style={{ color: 'var(--color-admin-mut)', fontSize: 13 }}>Tidak ada submission yang menunggu persetujuan.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {pendingSpots.map((spot) => (
                                <div key={spot.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={cardStyle}>
                                    <div className="min-w-0">
                                        <h3 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{spot.name}</h3>
                                        <p style={{ fontSize: 11.5, color: 'var(--color-admin-mut)' }}>
                                            {spot.category?.name} · Disubmit {new Date(spot.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                        <p style={{ fontSize: 12.5, color: 'var(--color-admin-mut)', marginTop: 6, maxWidth: 480 }}>
                                            {spot.description?.substring(0, 120)}...
                                        </p>
                                        {spot.tags && spot.tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>
                                                {spot.tags.map(tag => (
                                                    <span key={tag.id} style={{
                                                        fontSize: 9.5, fontWeight: 600, padding: '5px 8px', borderRadius: 8,
                                                        background: 'var(--color-admin-chip)', color: 'var(--color-admin-chip-ink)',
                                                    }}>{tag.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                                        <button onClick={() => router.post(`/admin/spots/${spot.id}/approve`)} style={btnStyle('approve')}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check</span>
                                            Setujui
                                        </button>
                                        <button onClick={() => router.post(`/admin/spots/${spot.id}/reject`)} style={btnStyle('reject')}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recentReviews.map((review) => (
                        <div key={review.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3" style={cardStyle}>
                            <div className="min-w-0">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{review.user.name}</span>
                                    <span style={{ display: 'flex', color: 'var(--color-admin-accent)' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined" style={{ fontSize: 14, opacity: i < review.rating ? 1 : 0.25 }}>star</span>
                                        ))}
                                    </span>
                                    <span style={{ fontSize: 11.5, color: 'var(--color-admin-mut)' }}>
                                        → {review.culinary_spot?.name || 'Unknown'}
                                    </span>
                                </div>
                                <p style={{ fontSize: 12.5, color: 'var(--color-admin-mut)' }}>{review.comment}</p>
                                <p style={{ fontSize: 10.5, color: 'var(--color-admin-mut)', opacity: 0.7, marginTop: 5 }}>
                                    {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Yakin ingin menghapus review ini?')) {
                                        router.delete(`/admin/reviews/${review.id}`);
                                    }
                                }}
                                style={btnStyle('reject')}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                                Hapus
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'spots' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {allSpots.map((spot) => {
                        const sc = statusColors[spot.status] || statusColors.rejected;
                        const photoCount = spot.media?.length || 0;
                        const slotsLeft = MAX_SPOT_PHOTOS - photoCount;
                        return (
                            <div key={spot.id} style={cardStyle}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: 12, flexShrink: 0, overflow: 'hidden',
                                            background: 'var(--color-admin-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {spot.media && spot.media.length > 0 ? (
                                                <img src={spot.media[0].original_url} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ color: 'var(--color-admin-chip-ink)', fontSize: 22 }}>restaurant</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                <h3 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 14, fontWeight: 700 }}>{spot.name}</h3>
                                                <span style={{
                                                    fontSize: 9.5, padding: '4px 8px', borderRadius: 8, fontWeight: 700,
                                                    background: sc.bg, color: sc.color,
                                                }}>
                                                    {statusLabel[spot.status] || spot.status}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 11.5, color: 'var(--color-admin-mut)', marginTop: 5 }}>
                                                {spot.category?.name}
                                                {spot.closed_reason && <span style={{ color: '#ff8a68' }}> — {spot.closed_reason}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap" style={{ gap: 8, alignItems: 'center' }}>
                                        {closingSpotId === spot.id ? (
                                            <div className="flex flex-wrap" style={{ gap: 6, alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Alasan tutup..."
                                                    value={closeReason}
                                                    onChange={(e) => setCloseReason(e.target.value)}
                                                    style={{ ...inputStyle, width: '100%', maxWidth: 220 }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        router.post(`/admin/spots/${spot.id}/close`, { reason: closeReason });
                                                        setClosingSpotId(null);
                                                        setCloseReason('');
                                                    }}
                                                    style={btnStyle('reject')}
                                                >
                                                    Konfirmasi
                                                </button>
                                                <button onClick={() => setClosingSpotId(null)} style={btnStyle('neutral')}>Batal</button>
                                            </div>
                                        ) : (
                                            <>
                                                <a href={`/spot/${spot.id}`} target="_blank" rel="noreferrer" style={iconBtnStyle} title="Lihat">
                                                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>visibility</span>
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        setPhotoError(null);
                                                        setManagingPhotosSpotId(managingPhotosSpotId === spot.id ? null : spot.id);
                                                    }}
                                                    style={btnStyle(managingPhotosSpotId === spot.id ? 'accent' : 'neutral')}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>photo_library</span>
                                                    Kelola Foto ({photoCount}/{MAX_SPOT_PHOTOS})
                                                </button>
                                                {spot.status !== 'closed' && (
                                                    <button onClick={() => setClosingSpotId(spot.id)} style={btnStyle('reject')}>
                                                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>storefront</span>
                                                        Tandai Tutup
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Photo management panel */}
                                {managingPhotosSpotId === spot.id && (
                                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-admin-line)' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                            {spot.media?.map((m) => (
                                                <div key={m.id} style={{ position: 'relative', width: 76, height: 76, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={m.original_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button
                                                        onClick={() => handleDeleteSpotPhoto(spot.id, m.id)}
                                                        disabled={deletingMediaId === m.id}
                                                        title="Hapus foto"
                                                        style={{
                                                            position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%',
                                                            background: 'rgba(23,27,33,.85)', color: '#fff', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                                                            {deletingMediaId === m.id ? 'hourglass_empty' : 'close'}
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}

                                            {slotsLeft > 0 && (
                                                <button
                                                    onClick={() => photoInputRefs.current[spot.id]?.click()}
                                                    disabled={uploadingPhotoId === spot.id}
                                                    style={{
                                                        width: 76, height: 76, borderRadius: 10, flexShrink: 0, cursor: 'pointer',
                                                        border: '1.5px dashed var(--color-admin-line)', background: 'transparent',
                                                        color: 'var(--color-admin-mut)', display: 'flex', flexDirection: 'column',
                                                        alignItems: 'center', justifyContent: 'center', gap: 4,
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                                        {uploadingPhotoId === spot.id ? 'hourglass_empty' : 'add_a_photo'}
                                                    </span>
                                                    <span style={{ fontSize: 9.5, fontWeight: 700 }}>Tambah</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={(el) => { photoInputRefs.current[spot.id] = el; }}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleAddSpotPhotos(spot.id, e)}
                                        />
                                        <p style={{ fontSize: 11, color: 'var(--color-admin-mut)', marginTop: 10 }}>
                                            Maksimal {MAX_SPOT_PHOTOS} foto per tempat. {slotsLeft > 0 ? `Sisa ${slotsLeft} slot.` : 'Slot penuh — hapus salah satu untuk menambah.'}
                                        </p>
                                        {photoError && (
                                            <p style={{ fontSize: 11, color: '#ff8a68', marginTop: 4 }}>{photoError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'categories-tags' && (
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                    {/* Categories Panel */}
                    <div style={cardStyle}>
                        <h2 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Kategori</h2>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            <input
                                type="text"
                                placeholder="Nama kategori baru..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button type="submit" style={btnStyle('accent')}>
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                                Tambah
                            </button>
                        </form>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center justify-between gap-3" style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-line)' }}>
                                    {editingCategoryId === category.id ? (
                                        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                                            <input
                                                type="text"
                                                value={editingCategoryName}
                                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                                style={{ ...inputStyle, flex: 1 }}
                                            />
                                            <button onClick={() => handleUpdateCategory(category.id)} style={btnStyle('approve')}>Simpan</button>
                                            <button onClick={() => setEditingCategoryId(null)} style={btnStyle('neutral')}>Batal</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="truncate" style={{ fontSize: 13, fontWeight: 600, minWidth: 0 }}>{category.name}</span>
                                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                <button
                                                    onClick={() => {
                                                        setEditingCategoryId(category.id);
                                                        setEditingCategoryName(category.name);
                                                    }}
                                                    style={iconBtnStyle}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) {
                                                            router.delete(`/admin/categories/${category.id}`);
                                                        }
                                                    }}
                                                    style={iconBtnStyle}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags Panel */}
                    <div style={cardStyle}>
                        <h2 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Tag</h2>
                        <form onSubmit={handleAddTag} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            <input
                                type="text"
                                placeholder="Nama tag baru..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button type="submit" style={btnStyle('accent')}>
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                                Tambah
                            </button>
                        </form>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {tags.map((tag) => (
                                <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 12px', borderRadius: 20, background: 'var(--color-admin-bg)', border: '1px solid var(--color-admin-line)' }}>
                                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{tag.name}</span>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Yakin ingin menghapus tag "${tag.name}"?`)) {
                                                router.delete(`/admin/tags/${tag.id}`);
                                            }
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#ff8a68', cursor: 'pointer', padding: 2, display: 'flex' }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'closures' && (
                <div>
                    {closureReports.length === 0 ? (
                        <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-admin-mut)', display: 'block', marginBottom: 10 }}>task_alt</span>
                            <p style={{ color: 'var(--color-admin-mut)', fontSize: 13 }}>Tidak ada laporan penutupan yang menunggu tindakan.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {closureReports.map((spot) => (
                                <div key={spot.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={cardStyle}>
                                    <div className="min-w-0">
                                        <h3 style={{ fontFamily: 'var(--font-admin-display)', fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{spot.name}</h3>
                                        <p style={{ fontSize: 11.5, color: 'var(--color-admin-mut)' }}>
                                            {spot.category?.name} · Dilaporkan oleh {spot.submitted_by?.name || spot.submitted_by_user?.name || 'Kontributor'}
                                        </p>
                                        <p style={{ fontSize: 12.5, color: 'var(--color-admin-ink)', fontStyle: 'italic', marginTop: 6, maxWidth: 480 }}>
                                            "{spot.closed_reason}"
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                                        <button onClick={() => router.post(`/admin/spots/${spot.id}/close`, { reason: spot.closed_reason })} style={btnStyle('approve')}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check</span>
                                            Konfirmasi Tutup
                                        </button>
                                        <button onClick={() => router.post(`/admin/spots/${spot.id}/approve`)} style={btnStyle('reject')}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                                            Tolak Laporan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
