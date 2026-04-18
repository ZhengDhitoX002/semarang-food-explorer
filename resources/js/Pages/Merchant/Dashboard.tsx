import React, { useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Cell
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

// Helper: Custom Tooltip Design for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100">
                <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-700 font-medium text-sm flex-1">{entry.name}</span>
                        <span className="font-bold text-slate-900 text-sm">
                            {entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const props = usePage<{
        auth: { user: { name: string, email: string } };
        spots: SpotEntry[];
        analytics: AnalyticEntry[];
        totalViews: number;
        totalClicks: number;
        transactions: TransactionEntry[];
        avgRating: number;
    }>().props;

    const { auth, spots, analytics, totalViews, totalClicks, transactions, avgRating } = props;

    // Data Processing & Fake Generator (SaaS Mockup Logic)
    const { chartData, revenueData, isFake } = useMemo(() => {
        let finalChartData = [];
        let finalRevenueData = [];
        let usingFake = false;

        const dates = [...new Set(analytics.map(a => a.date))].sort();
        
        if (dates.length < 5) {
            usingFake = true;
            // Generate beautiful fake data
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                
                // Base formula with sine wave for realistic weekly seasonality
                const baseViews = 200 + Math.floor(Math.sin(i) * 50) + (30 - i) * 5; 
                const baseClicks = Math.floor(baseViews * (0.15 + (Math.random() * 0.1)));

                finalChartData.push({
                    name: d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    Views: baseViews,
                    Clicks: baseClicks
                });
            }

            // Fake Weekly Revenue Data
            const weeks = ['W1', 'W2', 'W3', 'W4'];
            finalRevenueData = weeks.map((w, idx) => ({
                name: w,
                Orders: 20 + (idx * 5) + Math.floor(Math.random() * 10),
                fill: idx === 3 ? '#e77e23' : '#fcd9b6' // Highlight last week
            }));
        } else {
            // Real Data
            finalChartData = dates.map(date => {
                const dObj = new Date(date);
                return {
                    name: dObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    Views: analytics.filter(a => a.date === date && a.event_type === 'view').reduce((s, a) => s + a.count, 0),
                    Clicks: analytics.filter(a => a.date === date && a.event_type === 'click').reduce((s, a) => s + a.count, 0)
                };
            }).slice(-30);

            // Mocking revenue structure from real transactions if needed, but keeping simple for now
            finalRevenueData = [
                { name: 'Last', Orders: transactions.length > 10 ? 15 : transactions.length, fill: '#fcd9b6' },
                { name: 'Curr', Orders: transactions.length, fill: '#e77e23' }
            ];
        }

        return { chartData: finalChartData, revenueData: finalRevenueData, isFake: usingFake };
    }, [analytics, transactions]);

    const displayTotalViews = chartData.length > 0 && isFake ? chartData.reduce((acc, curr) => acc + curr.Views, 0) : totalViews;
    const displayTotalClicks = chartData.length > 0 && isFake ? chartData.reduce((acc, curr) => acc + curr.Clicks, 0) : totalClicks;

    const kpiCards = [
        { 
            icon: 'visibility', label: 'Trafik Pengunjung', value: displayTotalViews.toLocaleString(), 
            growth: '+14.5%', trend: 'up', color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' 
        },
        { 
            icon: 'ads_click', label: 'Total Interaksi', value: displayTotalClicks.toLocaleString(), 
            growth: '+21.2%', trend: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' 
        },
        { 
            icon: 'star', label: 'Rating Rata-rata', value: avgRating > 0 ? avgRating.toFixed(1) : '4.8', 
            growth: '+0.2', trend: 'up', color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-100' 
        },
        { 
            icon: 'storefront', label: 'Toko Terdaftar', value: spots.length.toString(), 
            growth: 'Aktif', trend: 'neutral', color: 'text-rose-500', bg: 'bg-rose-50/50', border: 'border-rose-100' 
        },
    ];

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Merchant Dashboard" />
            <div className="min-h-screen bg-slate-50 font-display pb-20">
                
                {/* Premium Top Navbar */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                    <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-xl">restaurant_menu</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                                    Semarang<span className="text-primary">Food</span>
                                </h1>
                                <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Business Panel</p>
                            </div>
                        </Link>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-900">{auth?.user?.name || 'Merchant Account'}</span>
                                <span className="text-xs text-slate-500">{auth?.user?.email}</span>
                            </div>
                            <Link href="/" className="h-10 flex items-center justify-center px-4 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                Keluar Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1400px] mx-auto px-4 md:px-6 mt-8">
                    
                    {/* Welcome Hero Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                                Selamat datang kembali, <span className="text-primary">{auth?.user?.name.split(' ')[0]}!</span> 👋
                            </h2>
                            <p className="text-slate-500 font-medium">Berikut adalah rangkuman performa bisnis Anda pada <span className="text-slate-900">{todayDate}</span>.</p>
                        </div>
                        {isFake && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 text-sm font-bold">
                                <span className="material-symbols-outlined text-[18px]">model_training</span>
                                Simulasi Data Aktif
                            </div>
                        )}
                    </div>

                    {/* KPI Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {kpiCards.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300 relative overflow-hidden group">
                                {/* Decorative Blur */}
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center shadow-inner`}>
                                            <span className="material-symbols-outlined">{stat.icon}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                            {stat.trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                                            {stat.growth}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        
                        {/* Traffic Area Chart */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Pertumbuhan Trafik</h3>
                                    <p className="text-sm text-slate-500 font-medium">Views & klik pengunjung organik 30 hari terakhir</p>
                                </div>
                                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>30 Hari Terakhir</option>
                                    <option>Bulan Ini</option>
                                </select>
                            </div>

                            <div className="w-full h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '15px' }} />
                                        <Area type="monotone" name="Total Views" dataKey="Views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                                        <Area type="monotone" name="Link Clicks" dataKey="Clicks" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Revenue/Orders Side Bar Chart */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Performa Pesanan</h3>
                                <p className="text-sm text-slate-500 font-medium mb-8">Pertumbuhan mingguan dari seluruh toko</p>
                            </div>
                            <div className="flex-1 w-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="Orders" radius={[8, 8, 8, 8]}>
                                            {revenueData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Data Tables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Transaction History */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Riwayat Transaksi</h3>
                                <button className="text-sm font-bold text-primary hover:underline">Lihat Semua</button>
                            </div>
                            
                            <div className="overflow-x-auto rounded-xl">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 font-bold">
                                            <th className="py-4 px-4 rounded-l-xl">Status</th>
                                            <th className="py-4 px-4">Toko Kuliner</th>
                                            <th className="py-4 px-4">Nominal</th>
                                            <th className="py-4 px-4">Order ID</th>
                                            <th className="py-4 px-4 rounded-r-xl text-right">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                                            <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                                        tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {tx.status === 'paid' ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-bold text-slate-900">{tx.culinary_spot?.name || '-'}</td>
                                                <td className="py-4 px-4 font-bold text-slate-700">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                                <td className="py-4 px-4 font-mono text-xs text-slate-500">{tx.order_id}</td>
                                                <td className="py-4 px-4 text-slate-400 text-right">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
                                                    <p>Belum ada riwayat transaksi</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Active Spots */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Toko Anda</h3>
                                <Link href="/merchant/promotion" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {spots.length > 0 ? spots.map((spot, i) => (
                                    <Link
                                        key={spot.id}
                                        href={`/spot/${spot.id}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-white group"
                                    >
                                        <div className="h-12 w-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 group-hover:from-primary/10 group-hover:to-primary/20 group-hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">store</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 line-clamp-1">{spot.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">{spot.category?.name}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                                            chevron_right
                                        </span>
                                    </Link>
                                )) : (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-bold text-slate-500">Toko belum ditambahkan</p>
                                        <Link href="/merchant/promotion" className="text-xs text-primary font-bold mt-2 inline-block hover:underline">
                                            Promosikan Toko Sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
