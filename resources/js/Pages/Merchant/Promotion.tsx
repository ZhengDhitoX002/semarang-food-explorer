import React, { useState } from 'react';
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
        color: 'from-slate-100 to-slate-50',
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
    { id: 'qris', name: 'QRIS', detail: 'Scan QR — semua e-Wallet & m-Banking', icon: 'qr_code_2', iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
    { id: 'ewallet', name: 'E-Wallet', detail: 'GoPay, OVO, Dana, ShopeePay', icon: 'account_balance_wallet', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 'va', name: 'Virtual Account', detail: 'BCA, Mandiri, BNI, BRI', icon: 'account_balance', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 'card', name: 'Kartu Kredit / Debit', detail: 'Visa, Mastercard, JCB', icon: 'credit_card', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50' },
];

export default function Promotion() {
    const { spots, flash, auth } = usePage<{
        spots: SpotEntry[],
        flash: { success?: string, payment_url?: string },
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

    const simulatePayment = async () => {
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
                    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">payment</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pembayaran Siap</h3>
                            <p className="text-slate-500 text-sm mb-6">Pesanan berhasil dibuat! Klik untuk simulasi pembayaran Sandbox.</p>
                            <button onClick={simulatePayment} disabled={simulating} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                                {simulating ? 'Memproses...' : 'Simulasi Pembayaran'}
                            </button>
                            <button onClick={() => router.get('/merchant/dashboard')} className="w-full py-3 text-slate-500 text-sm font-bold hover:text-slate-700 mt-2">
                                Bayar Nanti
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Promosikan Toko Anda</h1>
                    <p className="text-slate-500 mt-1">Tingkatkan visibilitas dan raih lebih banyak pelanggan</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-10 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    {stepperSteps.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <button
                                type="button"
                                onClick={() => s.id <= step && setStep(s.id)}
                                className="flex items-center gap-3 flex-shrink-0"
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    step >= s.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <span className="material-symbols-outlined text-lg">{step > s.id ? 'check' : s.icon}</span>
                                </div>
                                <span className={`hidden sm:block text-sm font-semibold ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {s.label}
                                </span>
                            </button>
                            {idx < stepperSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 ${step > s.id ? 'bg-primary' : 'bg-slate-200'}`} />
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
                                                ? 'border-2 border-primary bg-white shadow-xl ring-4 ring-primary/10 -translate-y-1'
                                                : 'border border-slate-200 bg-white hover:shadow-md'
                                        }`}
                                    >
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                                                Paling Populer
                                            </div>
                                        )}
                                        <div>
                                            <span className={`font-bold uppercase tracking-wider text-[10px] ${data.package === pkg.id ? 'text-primary' : 'text-slate-400'}`}>{pkg.tier}</span>
                                            <h2 className="text-xl font-bold mt-1">{pkg.name}</h2>
                                            <p className="flex items-baseline gap-1 mt-2">
                                                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{pkg.priceLabel}</span>
                                                <span className="text-slate-400 text-sm">{pkg.period}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                            {pkg.features.map((f) => (
                                                <div key={f.text} className={`text-sm flex gap-2 ${f.included ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                                                    <span className={`material-symbols-outlined text-lg ${f.included ? 'text-primary' : 'text-slate-300'}`}>
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
                            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                                <h2 className="text-lg font-bold mb-6">Pilih Toko untuk Dipromosikan</h2>
                                {spots.length > 0 ? (
                                    <div className="space-y-3">
                                        {spots.map(spot => (
                                            <div
                                                key={spot.id}
                                                onClick={() => setData('spot_id', spot.id as any)}
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                                                    Number(data.spot_id) === spot.id
                                                        ? 'border-2 border-primary bg-primary/5'
                                                        : 'border border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                                    Number(data.spot_id) === spot.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    <span className="material-symbols-outlined">storefront</span>
                                                </div>
                                                <span className="font-bold text-sm text-slate-900">{spot.name}</span>
                                                <div className={`ml-auto h-5 w-5 rounded-full ${
                                                    Number(data.spot_id) === spot.id ? 'border-[5px] border-primary' : 'border border-slate-300'
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
                                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden sticky top-24">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                    <h2 className="text-lg font-bold mb-6 relative z-10">Ringkasan</h2>
                                    <div className="flex flex-col gap-3 border-b border-white/10 pb-5 relative z-10">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Paket</span><span className="font-bold text-primary">{selectedPkg.name}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Durasi</span><span className="font-medium">{selectedPkg.period.replace('/', '')}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Toko</span><span className="font-medium truncate max-w-[140px]">{targetSpot?.name || '-'}</span></div>
                                    </div>
                                    <div className="pt-5 relative z-10">
                                        <span className="text-slate-400 text-sm">Total Pembayaran</span>
                                        <p className="text-3xl font-extrabold text-primary mt-1">{selectedPkg.priceLabel}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span> Kembali
                                </button>
                                <button type="button" onClick={() => setStep(3)} disabled={spots.length === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-40">
                                    Lanjutkan <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                                <h2 className="text-lg font-bold mb-6">Metode Pembayaran</h2>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                                                selectedMethod === method.id
                                                    ? 'border-2 border-primary bg-primary/5'
                                                    : 'border border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2.5 rounded-xl ${method.iconBg} border border-transparent`}>
                                                    <span className={`material-symbols-outlined ${method.iconColor}`}>{method.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900">{method.name}</p>
                                                    <p className="text-xs text-slate-500">{method.detail}</p>
                                                </div>
                                            </div>
                                            <div className={`h-5 w-5 rounded-full ${selectedMethod === method.id ? 'border-[5px] border-primary bg-white' : 'border border-slate-300'}`} />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                                    <div>
                                        <p className="text-sm font-bold text-blue-800">Mode Sandbox</p>
                                        <p className="text-xs text-blue-600 mt-0.5">Ini simulasi — tidak ada uang yang akan dipotong dari rekening Anda.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary + Pay Button */}
                            <div className="lg:col-span-2">
                                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden sticky top-24">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                                    <h2 className="text-lg font-bold mb-6 relative z-10">Ringkasan Pesanan</h2>
                                    <div className="flex flex-col gap-3 border-b border-white/10 pb-5 relative z-10">
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Paket</span><span className="font-bold text-primary">{selectedPkg.name}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Durasi</span><span className="font-medium">{selectedPkg.period.replace('/', '')}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Toko</span><span className="font-medium truncate max-w-[140px]">{targetSpot?.name || '-'}</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-slate-400">Pembayaran</span><span className="font-medium">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span></div>
                                    </div>
                                    <div className="pt-5 mb-6 relative z-10">
                                        <span className="text-slate-400 text-sm">Total Pembayaran</span>
                                        <p className="text-3xl font-extrabold text-primary mt-1">{selectedPkg.priceLabel}</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing || spots.length === 0}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 relative z-10"
                                    >
                                        <span className="material-symbols-outlined">lock</span>
                                        {processing ? 'Memproses...' : 'Bayar & Aktifkan'}
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-start">
                                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span> Kembali
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Why Promote section */}
                <div className="mt-16 p-6 bg-gradient-to-br from-primary/5 to-orange-50 rounded-2xl border border-primary/10">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
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
                                <p className="text-sm text-slate-700 font-medium">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Promotion.layout = (page: React.ReactNode) => <MerchantLayout activeNav="promotion">{page}</MerchantLayout>;
