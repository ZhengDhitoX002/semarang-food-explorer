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
    submitted_by_user?: { id: number; name: string };
    tags?: { id: number; name: string }[];
}

interface ReviewData {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: { id: number; name: string };
    culinary_spot?: { id: number; name: string };
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
    tab: string;
}

export default function Dashboard() {
    const { stats, pendingSpots, recentReviews, allSpots, tab } = usePage<{ props: Props }>().props as unknown as Props;
    const [activeTab, setActiveTab] = useState(tab || 'overview');
    const [closeReason, setCloseReason] = useState('');
    const [closingSpotId, setClosingSpotId] = useState<number | null>(null);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '👤', color: '#3b82f6' },
        { label: 'Total Spots', value: stats.totalSpots, icon: '📍', color: '#10b981' },
        { label: 'Total Reviews', value: stats.totalReviews, icon: '💬', color: '#8b5cf6' },
        { label: 'Pending', value: stats.pendingSubmissions, icon: '⏳', color: '#f59e0b' },
    ];

    const cardStyle: React.CSSProperties = {
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 12,
        padding: 20,
    };

    const btnStyle = (color: string): React.CSSProperties => ({
        padding: '6px 14px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        color: '#fff',
        background: color,
        transition: 'opacity 0.2s',
    });

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '10px 20px',
        fontSize: 14,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? '#f4a261' : '#94a3b8',
        background: isActive ? 'rgba(244, 162, 97, 0.1)' : 'transparent',
        border: 'none',
        borderBottom: isActive ? '2px solid #f4a261' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
    });

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Admin Dashboard</h1>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {statCards.map((stat) => (
                    <div key={stat.label} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{stat.label}</p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                            </div>
                            <span style={{ fontSize: 32 }}>{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #334155', marginBottom: 24 }}>
                {[
                    { key: 'overview', label: '📊 Overview' },
                    { key: 'pending', label: `⏳ Pending (${pendingSpots.length})` },
                    { key: 'reviews', label: '💬 Moderasi Review' },
                    { key: 'spots', label: '📍 Semua Spot' },
                ].map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle(activeTab === t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div style={cardStyle}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Selamat Datang, Admin! 👋</h2>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                        Gunakan tab di atas untuk mengelola platform:<br/>
                        • <strong>Pending</strong> — Setujui atau tolak submission tempat baru dari user<br/>
                        • <strong>Moderasi Review</strong> — Hapus review yang tidak pantas<br/>
                        • <strong>Semua Spot</strong> — Kelola semua tempat kuliner, tandai tutup permanen
                    </p>
                </div>
            )}

            {activeTab === 'pending' && (
                <div>
                    {pendingSpots.length === 0 ? (
                        <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
                            <p style={{ fontSize: 48, marginBottom: 12 }}>✅</p>
                            <p style={{ color: '#94a3b8' }}>Tidak ada submission yang menunggu persetujuan.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {pendingSpots.map((spot) => (
                                <div key={spot.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{spot.name}</h3>
                                        <p style={{ fontSize: 13, color: '#64748b' }}>
                                            {spot.category?.name} • Disubmit: {new Date(spot.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                                            {spot.description?.substring(0, 120)}...
                                        </p>
                                        {spot.tags && spot.tags.length > 0 && (
                                            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                                {spot.tags.map(tag => (
                                                    <span key={tag.id} style={{
                                                        fontSize: 11, padding: '2px 8px', borderRadius: 12,
                                                        background: 'rgba(244, 162, 97, 0.15)', color: '#f4a261',
                                                    }}>{tag.name}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button
                                            onClick={() => router.post(`/admin/spots/${spot.id}/approve`)}
                                            style={btnStyle('#10b981')}
                                        >
                                            ✅ Setujui
                                        </button>
                                        <button
                                            onClick={() => router.post(`/admin/spots/${spot.id}/reject`)}
                                            style={btnStyle('#ef4444')}
                                        >
                                            ❌ Tolak
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {recentReviews.map((review) => (
                        <div key={review.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14 }}>{review.user.name}</span>
                                    <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(review.rating)}</span>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>
                                        → {review.culinary_spot?.name || 'Unknown'}
                                    </span>
                                </div>
                                <p style={{ fontSize: 13, color: '#94a3b8' }}>{review.comment}</p>
                                <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                                    {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm('Yakin ingin menghapus review ini?')) {
                                        router.delete(`/admin/reviews/${review.id}`);
                                    }
                                }}
                                style={btnStyle('#ef4444')}
                            >
                                🗑️ Hapus
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'spots' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {allSpots.map((spot) => (
                        <div key={spot.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700 }}>{spot.name}</h3>
                                    <span style={{
                                        fontSize: 10, padding: '2px 8px', borderRadius: 12, fontWeight: 600,
                                        background: spot.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' :
                                                    spot.status === 'closed' ? 'rgba(239, 68, 68, 0.15)' :
                                                    spot.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(100,100,100,0.15)',
                                        color: spot.status === 'approved' ? '#10b981' :
                                               spot.status === 'closed' ? '#ef4444' :
                                               spot.status === 'pending' ? '#f59e0b' : '#94a3b8',
                                    }}>
                                        {spot.status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                    {spot.category?.name}
                                    {spot.closed_reason && <span style={{ color: '#ef4444' }}> — {spot.closed_reason}</span>}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                                {closingSpotId === spot.id ? (
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Alasan tutup..."
                                            value={closeReason}
                                            onChange={(e) => setCloseReason(e.target.value)}
                                            style={{
                                                padding: '6px 10px', fontSize: 12, borderRadius: 8,
                                                border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0',
                                                width: 180,
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                router.post(`/admin/spots/${spot.id}/close`, { reason: closeReason });
                                                setClosingSpotId(null);
                                                setCloseReason('');
                                            }}
                                            style={btnStyle('#ef4444')}
                                        >
                                            Konfirmasi
                                        </button>
                                        <button onClick={() => setClosingSpotId(null)} style={btnStyle('#475569')}>Batal</button>
                                    </div>
                                ) : (
                                    spot.status !== 'closed' && (
                                        <button onClick={() => setClosingSpotId(spot.id)} style={btnStyle('#dc2626')}>
                                            🚫 Tandai Tutup
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
