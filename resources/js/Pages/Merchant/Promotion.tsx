import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import axios from 'axios';

interface SpotEntry {
    id: number;
    name: string;
}

const packages = [
    {
        id: 'basic',
        tier: 'Standard',
        name: 'Silver',
        price: 'Rp 50.000',
        period: '/7 days',
        features: [
            { text: 'Search result boost', included: true },
            { text: 'Basic analytics report', included: true },
            { text: 'Featured badge', included: false },
        ],
        popular: false,
    },
    {
        id: 'premium',
        tier: 'Recommended',
        name: 'Gold',
        price: 'Rp 150.000',
        period: '/15 days',
        features: [
            { text: 'Priority search placement', included: true },
            { text: 'Advanced performance metrics', included: true },
            { text: 'Social media shoutout', included: true },
        ],
        popular: true,
    },
    {
        id: 'ultra',
        tier: 'Premium',
        name: 'Platinum',
        price: 'Rp 300.000',
        period: '/30 days',
        features: [
            { text: 'Top of page guaranteed', included: true },
            { text: 'Dedicated account manager', included: true },
            { text: '"Featured" golden badge', included: true },
        ],
        popular: false,
    },
];

const paymentMethods = [
    {
        id: 'card',
        name: 'Credit / Debit Card',
        detail: 'Visa, Mastercard, JCB, Amex',
        icon: 'credit_card',
        iconColor: 'text-blue-600',
    },
    {
        id: 'ewallet',
        name: 'E-Wallet (GoPay / OVO)',
        detail: 'QRIS scanning available',
        icon: 'account_balance_wallet',
        iconColor: 'text-orange-500',
    },
    {
        id: 'va',
        name: 'Virtual Account',
        detail: 'BCA, Mandiri, BNI, BRI',
        icon: 'account_balance',
        iconColor: 'text-green-600',
    },
];

export default function Promotion() {
    const { spots, flash, auth } = usePage<{
        spots: SpotEntry[],
        flash: { success?: string, payment_url?: string },
        auth: { user: { name: string, role: string } }
    }>().props;

    const { data, setData, post, processing, errors } = useForm({
        spot_id: spots.length > 0 ? spots[0].id : '',
        package: 'premium',
    });

    const [selectedMethod, setSelectedMethod] = useState('ewallet');
    const [simulating, setSimulating] = useState(false);

    const selectedPkg = packages.find(p => p.id === data.package) || packages[1];
    const targetSpot = spots.find(s => s.id === Number(data.spot_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transactions');
    };

    const simulatePayment = async () => {
        if (!flash.payment_url) return;
        setSimulating(true);
        try {
            await axios.get(flash.payment_url);
            // After successful payment simulation, redirect to dashboard
            router.get('/merchant/dashboard');
        } catch (error) {
            alert('Failed to simulate payment');
            setSimulating(false);
        }
    };

    return (
        <>
            <Head title="Promote Your Culinary Business" />
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900">
                {/* Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-6 md:px-20 py-4 sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-primary">
                        <Link href="/" className="flex items-center gap-4">
                            <div className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-lg">
                                <span className="material-symbols-outlined">restaurant</span>
                            </div>
                            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">
                                Merchant Portal
                            </h2>
                        </Link>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <div className="hidden md:flex items-center gap-9">
                            <Link className="text-slate-700 text-sm font-medium hover:text-primary transition-colors" href="/merchant/dashboard">
                                Dashboard
                            </Link>
                            <span className="text-primary text-sm font-bold border-b-2 border-primary">
                                Promotions
                            </span>
                        </div>
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8 relative">
                    {/* Payment Modal Overlay */}
                    {flash.payment_url && (
                        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                                <div className="h-16 w-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl">payment</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Proceed to Payment</h3>
                                <p className="text-slate-500 text-sm mb-6">Order created successfully. Click below to simulate the Sandbox payment flow.</p>
                                <button
                                    onClick={simulatePayment}
                                    disabled={simulating}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {simulating ? 'Processing...' : 'Simulate Payment'}
                                </button>
                                <button
                                    onClick={() => router.get('/merchant/dashboard')}
                                    className="w-full py-3 text-slate-500 text-sm font-bold hover:text-slate-700 mt-2"
                                >
                                    Pay Later
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hero */}
                    <div className="flex flex-col gap-3 mb-10 text-center md:text-left mt-4">
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
                            Tingkatkan Visibilitas Toko Anda
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl">
                            Jangkau lebih banyak pelanggan dan tingkatkan pendapatan dengan memilih salah satu paket promosi kami.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg.name}
                                    onClick={() => setData('package', pkg.id)}
                                    className={`flex flex-col gap-6 rounded-2xl p-8 transition-all cursor-pointer ${
                                        data.package === pkg.id
                                            ? 'border-2 border-primary bg-white shadow-xl relative ring-4 ring-primary/10 transform -translate-y-1'
                                            : 'border border-slate-200 bg-white hover:shadow-md'
                                    }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <span className={`font-bold uppercase tracking-wider text-xs ${data.package === pkg.id ? 'text-primary' : 'text-slate-500'}`}>
                                            {pkg.tier}
                                        </span>
                                        <h2 className="text-2xl font-bold">{pkg.name}</h2>
                                        <p className="flex items-baseline gap-1 mt-2">
                                            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{pkg.price}</span>
                                            <span className="text-slate-500 text-sm font-medium">{pkg.period}</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                                        {pkg.features.map((feature) => (
                                            <div
                                                key={feature.text}
                                                className={`text-sm font-medium flex gap-3 ${
                                                    feature.included ? 'text-slate-600' : 'text-slate-400 line-through'
                                                }`}
                                            >
                                                <span className={`material-symbols-outlined text-xl ${feature.included ? 'text-primary' : 'text-slate-300'}`}>
                                                    {feature.included ? 'check_circle' : 'cancel'}
                                                </span>
                                                {feature.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                            {/* Form Section */}
                            <div className="lg:col-span-3 flex flex-col gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                <h2 className="text-xl font-bold">Detail Toko & Pembayaran</h2>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700">Pilih Toko untuk Dipromosikan</label>
                                        {spots.length > 0 ? (
                                            <select
                                                value={data.spot_id}
                                                onChange={e => setData('spot_id', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                                                required
                                            >
                                                <option value="" disabled>-- Pilih Toko --</option>
                                                {spots.map(spot => (
                                                    <option key={spot.id} value={spot.id}>{spot.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium">
                                                Belum ada toko yang tersedia. Silakan hubungi admin.
                                            </div>
                                        )}
                                        {errors.spot_id && <p className="text-red-500 text-xs">{errors.spot_id}</p>}
                                    </div>
                                </div>

                                {/* Payment Method (UI only) */}
                                <div className="mt-4">
                                    <h3 className="text-sm font-bold text-slate-700 mb-4">Metode Pembayaran (Mock)</h3>
                                    <div className="flex flex-col gap-3">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                                                    selectedMethod === method.id
                                                        ? 'border-2 border-primary bg-primary/5'
                                                        : 'border border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                                        <span className={`material-symbols-outlined ${method.iconColor}`}>
                                                            {method.icon}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{method.name}</p>
                                                        <p className="text-xs text-slate-500">{method.detail}</p>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`h-5 w-5 rounded-full ${
                                                        selectedMethod === method.id
                                                            ? 'border-[5px] border-primary bg-white'
                                                            : 'border border-slate-300'
                                                    }`}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-[11px] text-slate-500 text-center italic">
                                        Ini adalah mode simulasi (Sandbox). Tidak ada uang asli yang akan dipotong.
                                    </p>
                                </div>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="lg:col-span-2 flex flex-col gap-6 sticky top-24">
                                <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                                    <h2 className="text-xl font-bold mb-6 relative z-10">Ringkasan Pesanan</h2>
                                    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 relative z-10">
                                        {[
                                            { label: 'Paket', value: `${selectedPkg.name} Promotion`, highlight: true },
                                            { label: 'Durasi', value: selectedPkg.period.replace('/', '') + ' Visibility' },
                                            { label: 'Toko', value: targetSpot?.name || 'Belum dipilih' },
                                        ].map((item) => (
                                            <div key={item.label} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">{item.label}</span>
                                                <span className={item.highlight ? 'font-bold text-primary' : 'font-medium max-w-[150px] truncate'}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-white/10 relative z-10">
                                        <div className="flex flex-col gap-1 mb-8">
                                            <span className="text-slate-400 text-sm">Total Pembayaran</span>
                                            <span className="text-3xl font-black text-primary">{selectedPkg.price}</span>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={processing || spots.length === 0}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:shadow-none"
                                        >
                                            <span className="material-symbols-outlined">lock</span>
                                            {processing ? 'Memproses...' : 'Bayar & Aktifkan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-10 mt-20">
                    <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="h-8 w-8 bg-slate-400 text-white rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">restaurant</span>
                            </div>
                            <span className="text-sm font-bold">SemarangFood Merchant © {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
