import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Notifications() {
    const [settings, setSettings] = useState({
        promo: true,
        order: true,
        review: false,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <Head title="Notifikasi" />
            <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">arrow_back</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Notifikasi</h1>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                    {/* Toggle Item */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Promo & Diskon</h3>
                            <p className="text-sm text-slate-500">Info promo kuliner terbaru di Semarang</p>
                        </div>
                        <button 
                            onClick={() => toggle('promo')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.promo ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.promo ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    
                    <hr className="border-slate-100" />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Status Pesanan</h3>
                            <p className="text-sm text-slate-500">Pemberitahuan saat pesanan Anda diproses</p>
                        </div>
                        <button 
                            onClick={() => toggle('order')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.order ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.order ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Interaksi Ulasan</h3>
                            <p className="text-sm text-slate-500">Saat merchant membalas ulasan Anda</p>
                        </div>
                        <button 
                            onClick={() => toggle('review')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.review ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.review ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

Notifications.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;
