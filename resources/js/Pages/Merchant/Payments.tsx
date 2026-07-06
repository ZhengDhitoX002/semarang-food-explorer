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
        { label: 'Total Pengeluaran', value: `Rp ${totalSpent.toLocaleString('id-ID')}`, icon: 'account_balance_wallet' },
        { label: 'Promosi Aktif', value: activePromos.toString(), icon: 'campaign' },
        { label: 'Menunggu Bayar', value: pendingPayments.toString(), icon: 'pending' },
    ];

    const statusColors: Record<string, string> = {
        paid: 'bg-secondary/15 text-secondary-700 border-secondary/25',
        pending: 'bg-primary/10 text-primary border-primary/25',
        failed: 'bg-red-50 text-red-700 border-red-100',
        expired: 'bg-ink-200 text-ink-500 border-ink-300',
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
                    <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">Riwayat Pembayaran</h1>
                    <p className="text-ink-500 mt-1">Lacak semua transaksi pembayaran promosi toko Anda</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-surface rounded-2xl border border-ink-300 p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-chip text-primary flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="font-display text-xl font-bold text-ink-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div
                    className="flex gap-2 mb-6 overflow-x-auto no-scrollbar"
                    onWheel={(e) => {
                        if (e.deltaY === 0) return;
                        e.currentTarget.scrollLeft += e.deltaY;
                        e.preventDefault();
                    }}
                >
                    {['all', 'paid', 'pending', 'failed', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                filterStatus === status
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'bg-surface border border-ink-300 text-ink-600 hover:border-primary/50'
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
                <div className="bg-surface rounded-2xl border border-ink-300 shadow-sm overflow-hidden">
                    {filtered.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-ink-100 text-ink-500 font-bold text-xs uppercase tracking-wider">
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Order ID</th>
                                        <th className="py-4 px-6">Toko</th>
                                        <th className="py-4 px-6">Nominal</th>
                                        <th className="py-4 px-6 text-right">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((tx) => (
                                        <tr key={tx.id} className="border-b border-ink-200 hover:bg-ink-100/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColors[tx.status] || statusColors.pending}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        tx.status === 'paid' ? 'bg-secondary' :
                                                        tx.status === 'pending' ? 'bg-primary' :
                                                        tx.status === 'failed' ? 'bg-red-500' : 'bg-ink-400'
                                                    }`} />
                                                    {statusLabels[tx.status] || tx.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-mono text-xs text-ink-500">{tx.order_id}</td>
                                            <td className="py-4 px-6 font-display font-bold text-ink-900">{tx.culinary_spot?.name || '-'}</td>
                                            <td className="py-4 px-6 font-bold text-ink-700">Rp {Number(tx.amount).toLocaleString('id-ID')}</td>
                                            <td className="py-4 px-6 text-ink-400 text-right text-xs">
                                                {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <span className="material-symbols-outlined text-5xl text-ink-200 mb-3 block">receipt_long</span>
                            <p className="text-ink-500 font-bold">Tidak ada transaksi</p>
                            <p className="text-ink-400 text-sm mt-1">
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
