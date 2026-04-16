import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Orders() {
    const { auth } = usePage<any>().props;

    return (
        <>
            <Head title="Orders" />

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                {/* Hero illustration */}
                <div
                    className="w-28 h-28 rounded-3xl flex items-center justify-center mb-8"
                    style={{
                        background: 'linear-gradient(135deg, rgba(231, 126, 35, 0.12) 0%, rgba(244, 162, 97, 0.08) 100%)',
                    }}
                >
                    <span
                        className="material-symbols-outlined fill-icon"
                        style={{ fontSize: '56px', color: '#e77e23' }}
                    >
                        receipt_long
                    </span>
                </div>

                <h2
                    className="text-2xl font-bold text-slate-900 mb-2 text-center"
                    style={{ letterSpacing: '-0.02em' }}
                >
                    Riwayat Pesanan
                </h2>

                {auth?.user ? (
                    <>
                        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
                            Belum ada pesanan. Temukan kuliner favorit dan buat pesanan pertamamu!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:shadow-xl active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #e77e23 0%, #f4a261 100%)',
                                boxShadow: '0 4px 20px rgba(231, 126, 35, 0.3)',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
                            Jelajahi Kuliner
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
                            Login untuk melihat riwayat pesanan dan melacak order terbaru kamu.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:shadow-xl active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #e77e23 0%, #f4a261 100%)',
                                boxShadow: '0 4px 20px rgba(231, 126, 35, 0.3)',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
                            Login Sekarang
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}

Orders.layout = (page: React.ReactNode) => <AppLayout activeTab="orders" showFooter={false}>{page}</AppLayout>;

