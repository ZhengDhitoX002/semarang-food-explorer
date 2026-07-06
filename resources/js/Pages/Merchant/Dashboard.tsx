import React, { useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Cell, Legend
} from 'recharts';

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
    created_at: string;
    culinary_spot?: { name: string };
}

interface SpotEntry {
    id: number;
    name: string;
    category?: { name: string };
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-ink-300">
                <p className="text-ink-500 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-ink-700 font-medium text-sm flex-1">{entry.name}</span>
                        <span className="font-bold text-ink-900 text-sm">{entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const quickActions = [
    { icon: 'add_business', label: 'Daftarkan Toko', desc: 'Tambah toko baru', href: '/merchant/shop/create' },
    { icon: 'campaign', label: 'Promosi Toko', desc: 'Tingkatkan visibilitas', href: '/merchant/promotion' },
    { icon: 'storefront', label: 'Lihat Toko', desc: 'Kelola toko Anda', href: '/merchant/shops' },
    { icon: 'payments', label: 'Riwayat Bayar', desc: 'Lihat transaksi', href: '/merchant/payments' },
];

export default function Dashboard() {
    const props = usePage<{
        auth?: { user?: { name: string, email: string } };
        spots?: SpotEntry[];
        analytics?: AnalyticEntry[];
        totalViews?: number;
        totalClicks?: number;
        transactions?: TransactionEntry[];
        avgRating?: number;
    }>().props;

    const { auth, spots = [], analytics = [], totalViews = 0, totalClicks = 0, transactions = [], avgRating = 0 } = props || {};

    // Compares the first half of a series against the second half to get a
    // real growth %, instead of a hardcoded literal that never changes.
    const computeGrowth = (values: number[]): { label: string; trend: 'up' | 'down' | 'neutral' } => {
        const mid = Math.ceil(values.length / 2);
        const prev = values.slice(0, mid).reduce((s, v) => s + v, 0);
        const curr = values.slice(mid).reduce((s, v) => s + v, 0);
        if (prev === 0) return curr > 0 ? { label: 'Baru', trend: 'up' } : { label: '-', trend: 'neutral' };
        const pct = ((curr - prev) / prev) * 100;
        if (Math.abs(pct) < 0.5) return { label: '0%', trend: 'neutral' };
        return { label: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, trend: pct > 0 ? 'up' : 'down' };
    };

    const { chartData, isFake } = useMemo(() => {
        const dates = [...new Set(analytics.map(a => a.date))].sort();

        if (dates.length < 5) {
            // Not enough real analytics yet - show an illustrative trend line
            // (a gentle random walk, not a periodic sine wave) so the layout
            // isn't empty. Clearly labelled "Simulasi Data" below.
            const today = new Date();
            const data: { name: string; Views: number; Clicks: number }[] = [];
            let views = 30;
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                views = Math.max(4, views + (Math.random() - 0.4) * 6);
                data.push({
                    name: d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    Views: Math.round(views),
                    Clicks: Math.round(views * (0.12 + Math.random() * 0.08)),
                });
            }
            return { chartData: data, isFake: true };
        }

        const data = dates.map(date => {
            const dObj = new Date(date);
            return {
                name: dObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                Views: analytics.filter(a => a.date === date && a.event_type === 'view').reduce((s, a) => s + Number(a.count), 0),
                Clicks: analytics.filter(a => a.date === date && a.event_type === 'click').reduce((s, a) => s + Number(a.count), 0),
            };
        }).slice(-30);
        return { chartData: data, isFake: false };
    }, [analytics]);

    // Weekly revenue is always built from real paid transactions - never
    // faked - grouped into the last 6 Monday-start weeks.
    const revenueData = useMemo(() => {
        const WEEK_COUNT = 6;
        const startOfWeek = (d: Date) => {
            const day = d.getDay();
            const s = new Date(d);
            s.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
            s.setHours(0, 0, 0, 0);
            return s;
        };
        const thisWeekStart = startOfWeek(new Date());
        const buckets = Array.from({ length: WEEK_COUNT }, (_, i) => {
            const start = new Date(thisWeekStart);
            start.setDate(thisWeekStart.getDate() - (WEEK_COUNT - 1 - i) * 7);
            return { start, total: 0 };
        });

        transactions.forEach(tx => {
            if (tx.status !== 'paid') return;
            const txDate = new Date(tx.created_at);
            for (let i = buckets.length - 1; i >= 0; i--) {
                if (txDate >= buckets[i].start) {
                    buckets[i].total += Number(tx.amount);
                    break;
                }
            }
        });

        return buckets.map((b, idx) => ({
            name: b.start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            Pendapatan: b.total,
            fill: idx === buckets.length - 1 ? '#b5471f' : '#f5ddc9',
        }));
    }, [transactions]);

    const displayTotalViews = isFake ? chartData.reduce((acc, curr) => acc + curr.Views, 0) : totalViews;
    const displayTotalClicks = isFake ? chartData.reduce((acc, curr) => acc + curr.Clicks, 0) : totalClicks;
    const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.status === 'paid' ? Number(tx.amount) : 0), 0);

    const viewsGrowth = computeGrowth(chartData.map(d => d.Views));
    const clicksGrowth = computeGrowth(chartData.map(d => d.Clicks));
    const revenueGrowth = computeGrowth(revenueData.map(d => d.Pendapatan));

    const kpiCards = [
        { icon: 'visibility', label: 'Kunjungan', value: displayTotalViews.toLocaleString('id-ID'), growth: viewsGrowth.label, trend: viewsGrowth.trend },
        { icon: 'ads_click', label: 'Interaksi', value: displayTotalClicks.toLocaleString('id-ID'), growth: clicksGrowth.label, trend: clicksGrowth.trend },
        { icon: 'payments', label: 'Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, growth: revenueGrowth.label, trend: revenueGrowth.trend },
        { icon: 'storefront', label: 'Toko Terdaftar', value: spots.length.toString(), growth: 'Aktif', trend: 'neutral' },
    ];

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Merchant Dashboard" />
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
                
                {/* Welcome Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-ink-900 tracking-tight mb-1">
                            Dashboard
                        </h2>
                        <p className="text-ink-500 font-medium text-sm">Ringkasan performa &amp; aktivitas tokomu — {todayDate}</p>
                    </div>
                    {isFake && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-chip border border-ink-300 rounded-xl text-chip-ink text-sm font-bold">
                            <span className="material-symbols-outlined text-[18px]">model_training</span>
                            Simulasi Data
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="group bg-surface rounded-2xl border border-ink-300 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
                        >
                            <div className="h-11 w-11 bg-chip rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-xl">{action.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink-900">{action.label}</p>
                                <p className="text-[11px] text-ink-400 font-medium">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {kpiCards.map((stat) => (
                        <div key={stat.label} className="bg-surface rounded-3xl border border-ink-300 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-chip text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                                        stat.trend === 'up' ? 'bg-secondary/15 text-secondary-700' :
                                        stat.trend === 'down' ? 'bg-primary/10 text-primary' :
                                        'bg-ink-100 text-ink-500'
                                    }`}>
                                        {stat.trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                                        {stat.trend === 'down' && <span className="material-symbols-outlined text-[14px]">trending_down</span>}
                                        {stat.growth}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-ink-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="font-display text-2xl font-bold text-ink-900 tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-surface rounded-3xl border border-ink-300 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                            <div>
                                <h3 className="font-display text-lg font-bold text-ink-900">Traffic 30 Hari</h3>
                                <p className="text-sm text-ink-500">Kunjungan &amp; klik 30 hari terakhir</p>
                            </div>
                        </div>
                        <div className="w-full h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#b5471f" stopOpacity={0.35}/>
                                            <stop offset="95%" stopColor="#b5471f" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7d8a3e" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#7d8a3e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2d2b7" opacity={0.6} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#98836c', fontWeight: 600 }} dy={10} interval="preserveStartEnd" minTickGap={24} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#98836c', fontWeight: 600 }} dx={-10} allowDecimals={false} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                    <Area type="natural" name="Kunjungan" dataKey="Views" stroke="#b5471f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" dot={{ r: 2.5, strokeWidth: 0, fill: '#b5471f' }} activeDot={{ r: 5 }} />
                                    <Area type="natural" name="Klik" dataKey="Clicks" stroke="#7d8a3e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" dot={{ r: 2.5, strokeWidth: 0, fill: '#7d8a3e' }} activeDot={{ r: 5 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-surface rounded-3xl border border-ink-300 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
                        <h3 className="font-display text-lg font-bold text-ink-900">Pendapatan Mingguan</h3>
                        <p className="text-sm text-ink-500 mb-6">6 minggu terakhir, dalam Rupiah</p>
                        {revenueData.every(d => d.Pendapatan === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                <span className="material-symbols-outlined text-3xl text-ink-300 mb-2">payments</span>
                                <p className="text-sm font-bold text-ink-400">Belum ada pendapatan</p>
                                <p className="text-xs text-ink-400 mt-1">Grafik akan terisi setelah ada promosi yang lunas.</p>
                            </div>
                        ) : (
                            <div className="flex-1 w-full min-h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2d2b7" opacity={0.6} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#98836c', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#98836c', fontWeight: 600 }} dx={-5} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} allowDecimals={false} />
                                        <RechartsTooltip
                                            formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="Pendapatan" radius={[8, 8, 8, 8]} maxBarSize={40}>
                                            {revenueData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Grid: Transactions + Spots */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-surface rounded-3xl border border-ink-300 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-lg font-bold text-ink-900">Transaksi Terbaru</h3>
                            <Link href="/merchant/payments" className="text-sm font-bold text-primary hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-ink-100 text-ink-500 font-bold">
                                        <th className="py-3 px-4 rounded-l-xl">Status</th>
                                        <th className="py-3 px-4">Toko</th>
                                        <th className="py-3 px-4">Nominal</th>
                                        <th className="py-3 px-4 rounded-r-xl text-right">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                                        <tr key={tx.id} className="border-b border-ink-200 hover:bg-ink-100/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                                                    tx.status === 'paid' ? 'bg-secondary/15 text-secondary-700' : 'bg-primary/10 text-primary'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' ? 'bg-secondary' : 'bg-primary'}`} />
                                                    {tx.status === 'paid' ? 'Lunas' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-ink-900">{tx.culinary_spot?.name || '-'}</td>
                                            <td className="py-3 px-4 font-bold text-ink-700">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                            <td className="py-3 px-4 text-ink-400 text-right text-xs">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-ink-400">
                                                <span className="material-symbols-outlined text-3xl mb-2 opacity-50 block">receipt_long</span>
                                                Belum ada transaksi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-surface rounded-3xl border border-ink-300 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-lg font-bold text-ink-900">Toko Saya</h3>
                            <Link href="/merchant/shops" className="text-xs font-bold text-primary hover:underline">Kelola</Link>
                        </div>
                        <div className="space-y-3">
                            {spots.length > 0 ? spots.map((spot) => (
                                <Link key={spot.id} href={`/culinary/${spot.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-ink-200 hover:border-primary/30 hover:shadow-sm transition-all group"
                                >
                                    <div className="h-10 w-10 bg-chip rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">store</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-bold text-sm text-ink-900 truncate">{spot.name}</p>
                                        <p className="text-[11px] text-ink-400">{spot.category?.name}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-ink-300 text-lg">chevron_right</span>
                                </Link>
                            )) : (
                                <div className="text-center py-8 bg-ink-100 rounded-2xl">
                                    <p className="text-sm font-bold text-ink-400">Belum ada toko</p>
                                    <Link href="/merchant/shop/create" className="text-xs text-primary font-bold mt-1 inline-block hover:underline">Daftarkan Toko</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <MerchantLayout activeNav="dashboard">{page}</MerchantLayout>;
