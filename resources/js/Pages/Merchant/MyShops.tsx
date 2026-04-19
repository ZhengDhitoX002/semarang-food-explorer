import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface ShopEntry {
    id: number;
    name: string;
    description: string;
    price: number;
    is_promoted: boolean;
    average_rating: number;
    review_count: number;
    category?: { id: number; name: string };
    created_at: string;
}

export default function MyShops() {
    const { shops } = usePage<{ shops: ShopEntry[] }>().props;

    return (
        <>
            <Head title="Toko Saya" />
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Toko Saya</h1>
                        <p className="text-slate-500 mt-1">Kelola semua toko yang terdaftar di akun Anda</p>
                    </div>
                    <Link
                        href="/merchant/shop/create"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">add_business</span>
                        Daftarkan Toko Baru
                    </Link>
                </div>

                {shops.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-slate-300">storefront</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Toko</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                            Anda belum memiliki toko yang terdaftar. Daftarkan toko pertama Anda dan mulai terima ulasan dari pengunjung!
                        </p>
                        <Link
                            href="/merchant/shop/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Daftarkan Toko Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {shops.map((shop) => (
                            <div
                                key={shop.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                            >
                                {/* Shop Image placeholder */}
                                <div className="h-40 bg-gradient-to-br from-primary/10 to-orange-50 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-primary/20">storefront</span>
                                    </div>
                                    {/* Status Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {shop.is_promoted && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-amber-900 shadow-sm">
                                                <span className="material-symbols-outlined text-[12px]">star</span>
                                                Dipromosikan
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                            Aktif
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{shop.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{shop.description}</p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-amber-500 text-[16px]">star</span>
                                            <span className="text-sm font-bold text-slate-900">{shop.average_rating > 0 ? shop.average_rating.toFixed(1) : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-blue-500 text-[16px]">rate_review</span>
                                            <span className="text-sm font-medium text-slate-600">{shop.review_count} ulasan</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-emerald-500 text-[16px]">sell</span>
                                            <span className="text-sm font-medium text-slate-600">Rp {Number(shop.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {shop.category && (
                                        <span className="inline-block text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                                            {shop.category.name}
                                        </span>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                        <Link
                                            href={`/culinary/${shop.id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            Lihat
                                        </Link>
                                        <Link
                                            href={`/merchant/shop/${shop.id}/edit`}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                            Edit
                                        </Link>
                                        <Link
                                            href="/merchant/promotion"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">campaign</span>
                                            Promosi
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MyShops.layout = (page: React.ReactNode) => <MerchantLayout activeNav="shops">{page}</MerchantLayout>;
