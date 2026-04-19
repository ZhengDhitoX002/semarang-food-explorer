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
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100">
                <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-700 font-medium text-sm flex-1">{entry.name}</span>
                        <span className="font-bold text-slate-900 text-sm">{entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const quickActions = [
    { icon: 'add_business', label: 'Daftarkan Toko', desc: 'Tambah toko baru', href: '/merchant/shop/create', color: 'from-primary to-orange-400' },
    { icon: 'campaign', label: 'Promosi Toko', desc: 'Tingkatkan visibilitas', href: '/merchant/promotion', color: 'from-blue-500 to-indigo-500' },
    { icon: 'storefront', label: 'Lihat Toko', desc: 'Kelola toko Anda', href: '/merchant/shops', color: 'from-emerald-500 to-teal-500' },
    { icon: 'payments', label: 'Riwayat Bayar', desc: 'Lihat transaksi', href: '/merchant/payments', color: 'from-violet-500 to-purple-500' },
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

    const { chartData, revenueData, isFake } = useMemo(() => {
        let finalChartData: any[] = [];
        let finalRevenueData: any[] = [];
        let usingFake = false;

        const dates = [...new Set(analytics.map(a => a.date))].sort();
        
        if (dates.length < 5) {
            usingFake = true;
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const baseViews = 200 + Math.floor(Math.sin(i) * 50) + (30 - i) * 5; 
                const baseClicks = Math.floor(baseViews * (0.15 + (Math.random() * 0.1)));
                finalChartData.push({
                    name: d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    Views: baseViews,
                    Clicks: baseClicks
                });
            }
            const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
            finalRevenueData = weeks.map((w, idx) => ({
                name: w,
                Pendapatan: (20 + (idx * 5) + Math.floor(Math.random() * 10)) * 15000,
                fill: idx === 3 ? '#e77e23' : '#fcd9b6'
            }));
        } else {
            finalChartData = dates.map(date => {
                const dObj = new Date(date);
                return {
                    name: dObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
                    Views: analytics.filter(a => a.date === date && a.event_type === 'view').reduce((s, a) => s + Number(a.count), 0),
                    Clicks: analytics.filter(a => a.date === date && a.event_type === 'click').reduce((s, a) => s + Number(a.count), 0)
                };
            }).slice(-30);
            finalRevenueData = [
                { name: 'Sebelumnya', Pendapatan: transactions.length > 10 ? 225000 : transactions.length * 15000, fill: '#fcd9b6' },
                { name: 'Saat Ini', Pendapatan: transactions.length * 15000, fill: '#e77e23' }
            ];
        }

        return { chartData: finalChartData, revenueData: finalRevenueData, isFake: usingFake };
    }, [analytics, transactions]);

    const displayTotalViews = chartData.length > 0 && isFake ? chartData.reduce((acc: number, curr: any) => acc + curr.Views, 0) : totalViews;
    const displayTotalClicks = chartData.length > 0 && isFake ? chartData.reduce((acc: number, curr: any) => acc + curr.Clicks, 0) : totalClicks;
    const totalRevenue = transactions.reduce((sum, tx) => sum + (tx.status === 'paid' ? Number(tx.amount) : 0), 0);

    const kpiCards = [
        { icon: 'visibility', label: 'Trafik Pengunjung', value: displayTotalViews.toLocaleString('id-ID'), growth: '+14.5%', trend: 'up', color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
        { icon: 'ads_click', label: 'Total Interaksi', value: displayTotalClicks.toLocaleString('id-ID'), growth: '+21.2%', trend: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
        { icon: 'account_balance_wallet', label: 'Total Pendapatan', value: `Rp ${totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : '0'}`, growth: totalRevenue > 0 ? '+12%' : '-', trend: totalRevenue > 0 ? 'up' : 'neutral', color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-100' },
        { icon: 'storefront', label: 'Toko Terdaftar', value: spots.length.toString(), growth: 'Aktif', trend: 'neutral', color: 'text-rose-500', bg: 'bg-rose-50/50', border: 'border-rose-100' },
    ];

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Merchant Dashboard" />
            <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
                
                {/* Welcome Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                            Selamat datang, <span className="text-primary">{(auth?.user?.name || 'Merchant').split(' ')[0]}!</span> 👋
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">Rangkuman bisnis Anda — {todayDate}</p>
                    </div>
                    {isFake && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 text-sm font-bold">
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
                            className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
                        >
                            <div className={`h-11 w-11 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-xl">{action.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{action.label}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {kpiCards.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300 relative overflow-hidden group">
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} flex items-center justify-center shadow-inner`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                        {stat.trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                                        {stat.growth}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pertumbuhan Trafik</h3>
                                <p className="text-sm text-slate-500">Views & klik 30 hari terakhir</p>
                            </div>
                        </div>
                        <div className="w-full h-[280px]">
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
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                    <Area type="monotone" name="Views" dataKey="Views" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
                                    <Area type="monotone" name="Clicks" dataKey="Clicks" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900">Pendapatan Mingguan</h3>
                        <p className="text-sm text-slate-500 mb-6">Dalam Rupiah (IDR)</p>
                        <div className="flex-1 w-full min-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dx={-5} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                                    <RechartsTooltip
                                        formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="Pendapatan" radius={[8, 8, 8, 8]}>
                                        {revenueData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Grid: Transactions + Spots */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h3>
                            <Link href="/merchant/payments" className="text-sm font-bold text-primary hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold">
                                        <th className="py-3 px-4 rounded-l-xl">Status</th>
                                        <th className="py-3 px-4">Toko</th>
                                        <th className="py-3 px-4">Nominal</th>
                                        <th className="py-3 px-4 rounded-r-xl text-right">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? transactions.slice(0, 5).map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                                                    tx.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    {tx.status === 'paid' ? 'Lunas' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-slate-900">{tx.culinary_spot?.name || '-'}</td>
                                            <td className="py-3 px-4 font-bold text-slate-700">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                            <td className="py-3 px-4 text-slate-400 text-right text-xs">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-3xl mb-2 opacity-50 block">receipt_long</span>
                                                Belum ada transaksi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Toko Anda</h3>
                            <Link href="/merchant/shops" className="text-xs font-bold text-primary hover:underline">Semua</Link>
                        </div>
                        <div className="space-y-3">
                            {spots.length > 0 ? spots.map((spot) => (
                                <Link key={spot.id} href={`/culinary/${spot.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group"
                                >
                                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">store</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{spot.name}</p>
                                        <p className="text-[11px] text-slate-400">{spot.category?.name}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
                                </Link>
                            )) : (
                                <div className="text-center py-8 bg-slate-50 rounded-2xl">
                                    <p className="text-sm font-bold text-slate-400">Belum ada toko</p>
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
