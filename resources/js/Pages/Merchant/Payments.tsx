import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface TransactionEntry {
    id: number;
    order_id: string;
    status: string;
    amount: string;
    created_at: string;
    paid_at: string | null;
    culinary_spot?: { name: string };
}

export default function Payments() {
    const { transactions } = usePage<{ transactions: TransactionEntry[] }>().props;
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filtered = filterStatus === 'all' ? transactions : transactions.filter(t => t.status === filterStatus);

    const totalSpent = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + Number(t.amount), 0);
    const activePromos = transactions.filter(t => t.status === 'paid').length;
    const pendingPayments = transactions.filter(t => t.status === 'pending').length;

    const stats = [
        { label: 'Total Pengeluaran', value: `Rp ${totalSpent.toLocaleString('id-ID')}`, icon: 'account_balance_wallet', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Promosi Aktif', value: activePromos.toString(), icon: 'campaign', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Menunggu Bayar', value: pendingPayments.toString(), icon: 'pending', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const statusColors: Record<string, string> = {
        paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        failed: 'bg-red-50 text-red-700 border-red-100',
        expired: 'bg-slate-100 text-slate-500 border-slate-200',
    };

    const statusLabels: Record<string, string> = {
        paid: 'Lunas',
        pending: 'Menunggu',
        failed: 'Gagal',
        expired: 'Kadaluarsa',
    };

    return (
        <>
            <Head title="Riwayat Pembayaran" />
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Riwayat Pembayaran</h1>
                    <p className="text-slate-500 mt-1">Lacak semua transaksi pembayaran promosi toko Anda</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                    {['all', 'paid', 'pending', 'failed', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                filterStatus === status
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary/50'
                            }`}
                        >
                            {status === 'all' ? 'Semua' : statusLabels[status] || status}
                            {status !== 'all' && (
                                <span className="ml-1.5 opacity-70">({transactions.filter(t => t.status === status).length})</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Order ID</th>
                                        <th className="py-4 px-6">Toko</th>
                                        <th className="py-4 px-6">Nominal</th>
                                        <th className="py-4 px-6 text-right">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColors[tx.status] || statusColors.pending}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        tx.status === 'paid' ? 'bg-emerald-500' :
                                                        tx.status === 'pending' ? 'bg-amber-500' :
                                                        tx.status === 'failed' ? 'bg-red-500' : 'bg-slate-400'
                                                    }`} />
                                                    {statusLabels[tx.status] || tx.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-mono text-xs text-slate-500">{tx.order_id}</td>
                                            <td className="py-4 px-6 font-bold text-slate-900">{tx.culinary_spot?.name || '-'}</td>
                                            <td className="py-4 px-6 font-bold text-slate-700">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                            <td className="py-4 px-6 text-slate-400 text-right text-xs">
                                                {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3 block">receipt_long</span>
                            <p className="text-slate-500 font-bold">Tidak ada transaksi</p>
                            <p className="text-slate-400 text-sm mt-1">
                                {filterStatus !== 'all' ? 'Coba ubah filter status' : 'Belum ada riwayat pembayaran'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Payments.layout = (page: React.ReactNode) => <MerchantLayout activeNav="payments">{page}</MerchantLayout>;
