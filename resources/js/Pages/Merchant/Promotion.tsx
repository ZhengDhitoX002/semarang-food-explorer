import React, { useState, useEffect } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';
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
        price: 50000,
        priceLabel: 'Rp 50.000',
        period: '/7 hari',
        features: [
            { text: 'Prioritas pencarian naik', included: true },
            { text: 'Laporan analitik dasar', included: true },
            { text: 'Badge "Featured"', included: false },
            { text: 'Shoutout media sosial', included: false },
        ],
        popular: false,
        color: 'from-ink-100 to-ink-50',
    },
    {
        id: 'premium',
        tier: 'Rekomendasi',
        name: 'Gold',
        price: 150000,
        priceLabel: 'Rp 150.000',
        period: '/15 hari',
        features: [
            { text: 'Prioritas pencarian tinggi', included: true },
            { text: 'Metrik performa lanjutan', included: true },
            { text: 'Shoutout media sosial', included: true },
            { text: 'Badge "Featured" emas', included: false },
        ],
        popular: true,
        color: 'from-primary/10 to-orange-50',
    },
    {
        id: 'ultra',
        tier: 'Premium',
        name: 'Platinum',
        price: 300000,
        priceLabel: 'Rp 300.000',
        period: '/30 hari',
        features: [
            { text: 'Posisi teratas dijamin', included: true },
            { text: 'Manajer akun dedikasi', included: true },
            { text: 'Badge "Featured" emas', included: true },
            { text: 'Prioritas di semua pencarian', included: true },
        ],
        popular: false,
        color: 'from-violet-50 to-purple-50',
    },
];

const paymentMethods = [
    { id: 'qris', name: 'QRIS', detail: 'Bayar pakai aplikasi bank / e-wallet apa saja', icon: 'qr_code_2' },
    { id: 'ewallet', name: 'E-Wallet', detail: 'GoPay, OVO, DANA, ShopeePay', icon: 'account_balance_wallet' },
    { id: 'va', name: 'Virtual Account', detail: 'BCA, Mandiri, BNI, BRI', icon: 'account_balance' },
    { id: 'card', name: 'Kartu Kredit / Debit', detail: 'Visa, Mastercard, JCB', icon: 'credit_card' },
];

declare global {
    interface Window {
        snap: any;
    }
}

export default function Promotion() {
    const { spots, flash, auth } = usePage<{
        spots: SpotEntry[],
        flash: { 
            success?: string; 
            payment_url?: string; 
            snap_token?: string; 
            midtrans_client_key?: string; 
            midtrans_is_production?: boolean;
        },
        auth: { user: { name: string, role: string } }
    }>().props;

    const [step, setStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('qris');
    const [simulating, setSimulating] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        spot_id: spots.length > 0 ? spots[0].id : '',
        package: 'premium',
    });

    const selectedPkg = packages.find(p => p.id === data.package) || packages[1];
    const targetSpot = spots.find(s => s.id === Number(data.spot_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transactions');
    };

    useEffect(() => {
        if (flash.snap_token && flash.midtrans_client_key && flash.snap_token !== 'mock_snap_token') {
            const script = document.createElement('script');
            const isProduction = flash.midtrans_is_production;
            script.src = isProduction ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', flash.midtrans_client_key || '');
            script.async = true;
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            }
        }
    }, [flash.snap_token, flash.midtrans_client_key, flash.midtrans_is_production]);

    const handlePayment = async () => {
        if (flash.snap_token && flash.snap_token !== 'mock_snap_token' && window.snap) {
            window.snap.pay(flash.snap_token, {
                onSuccess: async function(result: any) {
                    if (flash.payment_url) {
                        try { await axios.get(flash.payment_url); } catch (e) {}
                    }
                    router.get('/merchant/dashboard');
                },
                onPending: function(result: any) {
                    router.get('/merchant/dashboard');
                },
                onError: function(result: any) {
                    alert('Pembayaran gagal!');
                },
                onClose: function() {
                    console.log('User closed the popup');
                }
            });
        } else if (flash.payment_url) {
            setSimulating(true);
            try {
                await axios.get(flash.payment_url);
                router.get('/merchant/dashboard');
            } catch {
                alert('Simulasi gagal');
                setSimulating(false);
            }
        }
    };

    // Sandbox-only shortcut: mark the transaction paid directly instead of
    // going through Midtrans's real QRIS scan/simulator flow (which needs a
    // qr_string most testers never have access to).
    const handleSimulatePaid = async () => {
        if (!flash.payment_url) return;
        setSimulating(true);
        try {
            await axios.get(flash.payment_url);
            router.get('/merchant/dashboard');
        } catch {
            alert('Simulasi gagal');
            setSimulating(false);
        }
    };

    const stepperSteps = [
        { id: 1, label: 'Pilih Paket', icon: 'local_offer' },
        { id: 2, label: 'Detail Toko', icon: 'store' },
        { id: 3, label: 'Pembayaran', icon: 'payment' },
    ];

    return (
        <>
            <Head title="Promosi Toko" />
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 relative">
                {/* Payment Modal */}
                {flash.payment_url && (
                    <div className="fixed inset-0 z-[100] bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-surface p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                            <div className="h-16 w-16 bg-secondary/15 text-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">payment</span>
                            </div>
                            <h3 className="font-display text-xl font-bold mb-2">Pembayaran Siap</h3>
                            <p className="text-ink-500 text-sm mb-6">Pesanan berhasil dibuat! Lanjutkan pembayaran.</p>
                            <button onClick={handlePayment} disabled={simulating} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                                {simulating ? 'Memproses...' : (flash.snap_token && flash.snap_token !== 'mock_snap_token' ? 'Bayar Sekarang (Midtrans)' : 'Simulasi Pembayaran')}
                            </button>
                            {flash.snap_token && flash.snap_token !== 'mock_snap_token' && !flash.midtrans_is_production && (
                                <button
                                    onClick={handleSimulatePaid}
                                    disabled={simulating}
                                    className="w-full py-3 mt-2 bg-chip text-chip-ink rounded-xl font-bold text-sm hover:bg-chip/70 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">science</span>
                                    {simulating ? 'Memproses...' : 'Tandai Lunas (Simulasi)'}
                                </button>
                            )}
                            <button onClick={() => router.get('/merchant/dashboard')} className="w-full py-3 text-ink-500 text-sm font-bold hover:text-ink-700 mt-2">
                                Bayar Nanti
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">Promosikan Toko Anda</h1>
                    <p className="text-ink-500 mt-1">Naikkan visibilitas tokomu di pencarian &amp; carousel</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-10 bg-surface rounded-2xl p-4 border border-ink-300 shadow-sm">
                    {stepperSteps.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <button
                                type="button"
                                onClick={() => s.id <= step && setStep(s.id)}
                                className="flex items-center gap-3 flex-shrink-0"
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    step > s.id ? 'bg-secondary/20 text-secondary-700' : step === s.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-chip text-ink-400'
                                }`}>
                                    <span className="material-symbols-outlined text-lg">{step > s.id ? 'check' : s.icon}</span>
                                </div>
                                <span className={`hidden sm:block text-sm font-semibold ${step >= s.id ? 'text-ink-900' : 'text-ink-400'}`}>
                                    {s.label}
                                </span>
                            </button>
                            {idx < stepperSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 ${step > s.id ? 'bg-primary' : 'bg-ink-300'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Pricing */}
                    {step === 1 && (
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.name}
                                        onClick={() => setData('package', pkg.id)}
                                        className={`flex flex-col gap-5 rounded-2xl p-6 transition-all cursor-pointer relative ${
                                            data.package === pkg.id
                                                ? 'border-2 border-primary bg-surface shadow-xl ring-4 ring-primary/10 -translate-y-1'
                                                : 'border border-ink-300 bg-surface hover:shadow-md'
                                        }`}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                                                Paling Populer
                                            </div>
                                        )}
                                        <div>
                                            <span className={`font-bold uppercase tracking-wider text-[10px] ${data.package === pkg.id ? 'text-primary' : 'text-ink-400'}`}>{pkg.tier}</span>
                                            <h2 className="font-display text-xl font-bold mt-1">{pkg.name}</h2>
                                            <p className="flex items-baseline gap-1 mt-2">
                                                <span className="font-display text-3xl font-bold tracking-tight text-primary">{pkg.priceLabel}</span>
                                                <span className="text-ink-400 text-sm">{pkg.period}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3 pt-4 border-t border-ink-300">
                                            {pkg.features.map((f) => (
                                                <div key={f.text} className={`text-sm flex gap-2 ${f.included ? 'text-ink-600' : 'text-ink-400 line-through'}`}>
                                                    <span className={`material-symbols-outlined text-lg ${f.included ? 'text-primary' : 'text-ink-300'}`}>
                                                        {f.included ? 'check_circle' : 'cancel'}
                                                    </span>
                                                    {f.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                    Lanjutkan <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shop Details */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 bg-surface rounded-2xl border border-ink-300 shadow-sm p-6 md:p-8">
                                <h2 className="font-display text-lg font-bold mb-6">Pilih Toko untuk Dipromosikan</h2>
                                {spots.length > 0 ? (
                                    <div className="space-y-3">
                                        {spots.map(spot => (
                                            <div
                                                key={spot.id}
                                                onClick={() => setData('spot_id', spot.id as any)}
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                                                    Number(data.spot_id) === spot.id
                                                        ? 'border-2 border-primary bg-primary/5'
                                                        : 'border border-ink-300 hover:bg-ink-100'
                                                }`}
                                            >
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                                    Number(data.spot_id) === spot.id ? 'bg-primary text-white' : 'bg-chip text-ink-400'
                                                }`}>
                                                    <span className="material-symbols-outlined">storefront</span>
                                                </div>
                                                <span className="font-display font-bold text-sm text-ink-900">{spot.name}</span>
                                                <div className={`ml-auto h-5 w-5 rounded-full ${
                                                    Number(data.spot_id) === spot.id ? 'border-[5px] border-primary' : 'border border-ink-300'
                                                }`} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
                                        <span className="material-symbols-outlined text-3xl mb-2 block">warning</span>
                                        Anda belum memiliki toko. Silakan daftarkan toko terlebih dahulu.
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-2">
                                <div className="bg-surface border border-ink-300 p-6 rounded-2xl shadow-sm sticky top-24">
                                    <h2 className="font-display text-lg font-bold mb-6 text-ink-900">Ringkasan Pesanan</h2>
                                    <div className="flex flex-col gap-3 border-b border-ink-300 pb-5">
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Paket</span><span className="font-bold text-ink-900">{selectedPkg.name} · {selectedPkg.period.replace('/', '')}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Toko</span><span className="font-medium text-ink-900 truncate max-w-[140px]">{targetSpot?.name || '-'}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Tayang mulai</span><span className="font-medium text-ink-900">Hari ini</span></div>
                                    </div>
                                    <div className="pt-5">
                                        <span className="text-ink-500 text-sm">Total Pembayaran</span>
                                        <p className="font-display text-3xl font-bold text-primary mt-1">{selectedPkg.priceLabel}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-ink-600 bg-surface border border-ink-300 hover:bg-ink-100">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span> Kembali
                                </button>
                                <button type="button" onClick={() => setStep(3)} disabled={spots.length === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-40">
                                    Lanjut ke Bayar <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 bg-surface rounded-2xl border border-ink-300 shadow-sm p-6 md:p-8">
                                <div className="mb-6 p-3.5 bg-chip border border-ink-300 rounded-2xl flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-chip-ink text-lg">science</span>
                                    <p className="text-[12px] leading-relaxed text-chip-ink">Mode sandbox — ini simulasi pembayaran Midtrans, saldo kamu tidak akan terpotong sungguhan.</p>
                                </div>
                                <h2 className="font-display text-lg font-bold mb-6">Metode Pembayaran</h2>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                                                selectedMethod === method.id
                                                    ? 'border-2 border-primary bg-primary/5'
                                                    : 'border border-ink-300 hover:bg-ink-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-xl bg-chip">
                                                    <span className="material-symbols-outlined text-primary">{method.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-ink-900">{method.name}</p>
                                                    <p className="text-xs text-ink-500">{method.detail}</p>
                                                </div>
                                            </div>
                                            <div className={`h-5 w-5 rounded-full ${selectedMethod === method.id ? 'border-[5px] border-primary bg-surface' : 'border border-ink-300'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary + Pay Button */}
                            <div className="lg:col-span-2">
                                <div className="bg-surface border border-ink-300 p-6 rounded-2xl shadow-sm sticky top-24">
                                    <h2 className="font-display text-lg font-bold mb-6 text-ink-900">Ringkasan Pesanan</h2>
                                    <div className="flex flex-col gap-3 border-b border-ink-300 pb-5">
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Paket</span><span className="font-bold text-ink-900">{selectedPkg.name}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Durasi</span><span className="font-medium text-ink-900">{selectedPkg.period.replace('/', '')}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Toko</span><span className="font-medium text-ink-900 truncate max-w-[140px]">{targetSpot?.name || '-'}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-ink-500">Pembayaran</span><span className="font-medium text-ink-900">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span></div>
                                    </div>
                                    <div className="pt-5 mb-6">
                                        <span className="text-ink-500 text-sm">Total Pembayaran</span>
                                        <p className="font-display text-3xl font-bold text-primary mt-1">{selectedPkg.priceLabel}</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing || spots.length === 0}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">lock</span>
                                        {processing ? 'Memproses...' : 'Bayar & Aktifkan'}
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-start">
                                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-ink-600 bg-surface border border-ink-300 hover:bg-ink-100">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span> Kembali
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Why Promote section */}
                <div className="mt-16 p-6 bg-chip/40 rounded-2xl border border-ink-300">
                    <h3 className="font-display text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">rocket_launch</span>
                        Kenapa Harus Promosi?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: 'trending_up', text: 'Rata-rata kenaikan 40% kunjungan harian' },
                            { icon: 'analytics', text: 'Tracking klik & performa real-time' },
                            { icon: 'phone_android', text: 'Prioritas di pencarian mobile' },
                        ].map((item) => (
                            <div key={item.text} className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">{item.icon}</span>
                                <p className="text-sm text-ink-700 font-medium">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Promotion.layout = (page: React.ReactNode) => <MerchantLayout activeNav="promotion">{page}</MerchantLayout>;
