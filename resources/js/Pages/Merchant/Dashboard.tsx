import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticEntry {
    date: string;
    event_type: string;
    count: number;
}

interface TransactionEntry {
    id: number;
    order_id: string;
    status: string;
    amount: string;
    paid_at: string | null;
    created_at: string;
    culinary_spot?: { name: string };
}

interface SpotEntry {
    id: number;
    name: string;
    category?: { name: string };
}

export default function Dashboard() {
    const props = usePage<{
        spots: SpotEntry[];
        analytics: AnalyticEntry[];
        totalViews: number;
        totalClicks: number;
        transactions: TransactionEntry[];
        avgRating: number;
    }>().props;

    const { spots, analytics, totalViews, totalClicks, transactions, avgRating } = props;

    // Group analytics by date for simple chart
    const dates = [...new Set(analytics.map(a => a.date))].sort();
    const viewsByDate = dates.map(d => analytics.filter(a => a.date === d && a.event_type === 'view').reduce((s, a) => s + a.count, 0));
    const clicksByDate = dates.map(d => analytics.filter(a => a.date === d && a.event_type === 'click').reduce((s, a) => s + a.count, 0));
    const maxVal = Math.max(...viewsByDate, ...clicksByDate, 1);

    return (
        <>
            <Head title="Merchant Dashboard" />
            <div className="min-h-screen bg-background-light font-display">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-6 py-3 lg:px-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined">restaurant_menu</span>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                    Semarang<span className="text-primary">Food</span>
                                </h1>
                            </Link>
                            <span className="ml-4 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Merchant Dashboard</span>
                        </div>
                        <Link href="/" className="text-sm font-bold text-primary hover:underline">← Kembali ke Explorer</Link>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { icon: 'visibility', label: 'Total Views', value: totalViews.toLocaleString(), color: 'bg-blue-50 text-blue-600' },
                            { icon: 'ads_click', label: 'Total Clicks', value: totalClicks.toLocaleString(), color: 'bg-green-50 text-green-600' },
                            { icon: 'star', label: 'Avg Rating', value: avgRating.toString(), color: 'bg-yellow-50 text-yellow-600' },
                            { icon: 'storefront', label: 'Toko Aktif', value: spots.length.toString(), color: 'bg-primary/10 text-primary' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${stat.color} mb-4`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                                <p className="text-3xl font-black">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Analytics Chart (CSS-based bar chart) */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-1">Analitik 30 Hari Terakhir</h2>
                            <p className="text-sm text-slate-400 mb-6">Views & clicks per hari</p>

                            {dates.length > 0 ? (
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={dates.map(date => ({
                                                name: date.slice(5),
                                                Views: analytics.filter(a => a.date === date && a.event_type === 'view').reduce((s, a) => s + a.count, 0),
                                                Clicks: analytics.filter(a => a.date === date && a.event_type === 'click').reduce((s, a) => s + a.count, 0)
                                            })).slice(-15)}
                                            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5}/>
                                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5}/>
                                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                                            />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Area type="monotone" dataKey="Views" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                            <Area type="monotone" dataKey="Clicks" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-center py-10">Belum ada data analitik.</p>
                            )}
                        </div>

                        {/* Spots */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4">Toko Anda</h2>
                            <div className="space-y-3">
                                {spots.length > 0 ? spots.map((spot) => (
                                    <Link
                                        key={spot.id}
                                        href={`/spot/${spot.id}`}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                                    >
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-lg">restaurant</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{spot.name}</p>
                                            <p className="text-xs text-slate-400">{spot.category?.name}</p>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-slate-400">Belum ada toko yang terdaftar.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4">Riwayat Transaksi</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-400 border-b border-slate-100">
                                        <th className="pb-3 font-medium">Order ID</th>
                                        <th className="pb-3 font-medium">Toko</th>
                                        <th className="pb-3 font-medium">Jumlah</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="py-3 font-mono text-xs">{tx.order_id}</td>
                                            <td className="py-3">{tx.culinary_spot?.name || '-'}</td>
                                            <td className="py-3 font-bold">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    tx.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                    {tx.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-400">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
