import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Profile() {
    const { auth } = usePage<any>().props;

    if (!auth?.user) {
        return (
            <>
                <Head title="Profile" />
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
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
                            account_circle
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center" style={{ letterSpacing: '-0.02em' }}>
                        Profil Kamu
                    </h2>
                    <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
                        Login untuk melihat dan mengelola profil kamu, termasuk data akun dan preferensi kuliner.
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
                </div>
            </>
        );
    }

    const user = auth.user;

    return (
        <>
            <Head title="Profile" />

            <div className="flex-1 flex flex-col">
                {/* Profile Header */}
                <div
                    className="relative px-6 pt-10 pb-8"
                    style={{
                        background: 'linear-gradient(135deg, #e77e23 0%, #f4a261 60%, #fcd9b6 100%)',
                    }}
                >
                    <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div
                            className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg"
                            style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
                            {user.name}
                        </h2>
                        <p className="text-white/80 text-sm">{user.email}</p>
                        <span
                            className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                color: '#fff',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                {user.role === 'admin' ? 'admin_panel_settings' : user.role === 'merchant' ? 'storefront' : 'person'}
                            </span>
                            {user.role === 'admin' ? 'Administrator' : user.role === 'merchant' ? 'Merchant' : 'Food Explorer'}
                        </span>
                    </div>
                </div>

                {/* Profile Menu */}
                <div className="max-w-2xl w-full mx-auto px-6 py-6 space-y-3">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { icon: 'favorite', label: 'Favorit', value: '0' },
                            { icon: 'receipt_long', label: 'Pesanan', value: '0' },
                            { icon: 'rate_review', label: 'Ulasan', value: '0' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center p-4 rounded-2xl border border-slate-100"
                                style={{ background: 'rgba(248, 247, 246, 0.8)' }}
                            >
                                <span className="material-symbols-outlined text-primary mb-1" style={{ fontSize: '24px' }}>{stat.icon}</span>
                                <span className="text-xl font-bold text-slate-900">{stat.value}</span>
                                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Menu Items */}
                    {[
                        { icon: 'edit', label: 'Edit Profil', desc: 'Ubah nama, email, dan foto profil', href: '#' },
                        { icon: 'lock', label: 'Keamanan', desc: 'Ubah password dan pengaturan keamanan', href: '#' },
                        { icon: 'notifications', label: 'Notifikasi', desc: 'Atur preferensi notifikasi', href: '#' },
                        { icon: 'help', label: 'Bantuan', desc: 'FAQ dan pusat bantuan', href: '#' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors"
                                style={{ background: 'rgba(231, 126, 35, 0.08)' }}
                            >
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>{item.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors" style={{ fontSize: '20px' }}>
                                chevron_right
                            </span>
                        </Link>
                    ))}

                    {/* Merchant Dashboard Link */}
                    {(user.role === 'admin' || user.role === 'merchant') && (
                        <Link
                            href="/merchant/dashboard"
                            className="flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>dashboard</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-primary">Dashboard Merchant</p>
                                <p className="text-xs text-slate-500">Kelola tempat kuliner kamu</p>
                            </div>
                            <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors" style={{ fontSize: '20px' }}>
                                chevron_right
                            </span>
                        </Link>
                    )}

                    {/* Logout */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-red-100 hover:bg-red-50/80 transition-all duration-300 group mt-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-red-500" style={{ fontSize: '20px' }}>logout</span>
                        </div>
                        <p className="text-sm font-bold text-red-600">Keluar dari Akun</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;

