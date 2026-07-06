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
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-primary-300) 8%, transparent) 100%)',
                        }}
                    >
                        <span
                            className="material-symbols-outlined fill-icon"
                            style={{ fontSize: '56px', color: 'var(--color-primary)' }}
                        >
                            account_circle
                        </span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-ink-900 mb-2 text-center" style={{ letterSpacing: '-0.02em' }}>
                        Profil Kamu
                    </h2>
                    <p className="text-ink-500 text-center max-w-sm mb-8 leading-relaxed">
                        Login untuk melihat dan mengelola profil kamu, termasuk data akun dan preferensi kuliner.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:shadow-xl active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-300) 100%)',
                            boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 30%, transparent)',
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

    const menuItems = [
        { icon: 'edit', label: 'Edit Profil', desc: 'Ubah nama, email, dan foto profil', href: '/profile/edit' },
        { icon: 'lock', label: 'Keamanan', desc: 'Ubah password dan pengaturan keamanan', href: '/profile/security' },
        { icon: 'notifications', label: 'Notifikasi', desc: 'Atur preferensi notifikasi', href: '/profile/notifications' },
        { icon: 'help', label: 'Bantuan', desc: 'FAQ dan pusat bantuan', href: '/profile/help' },
    ];

    const stats = [
        { icon: 'favorite', label: 'Favorit', value: '0' },
        { icon: 'receipt_long', label: 'Pesanan', value: '0' },
        { icon: 'rate_review', label: 'Ulasan', value: '0' },
    ];

    return (
        <>
            <Head title="Profile" />

            <div className="flex-1 flex flex-col">
                {/* Profile Header — refined gradient */}
                <div className="relative overflow-hidden">
                    {/* Background with subtle pattern */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(160deg, var(--color-primary-600) 0%, var(--color-primary-500) 40%, var(--color-primary-300) 100%)',
                        }}
                    />
                    {/* Soft decorative shapes */}
                    <div
                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-8"
                        style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                    />

                    <div className="relative px-6 pt-12 pb-10">
                        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                            {/* Avatar — circle with white border */}
                            <div className="relative mb-5">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full object-cover"
                                        style={{
                                            border: '3px solid rgba(255,255,255,0.9)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl"
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            border: '3px solid rgba(255,255,255,0.9)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <h2
                                className="text-xl font-bold text-white mb-1"
                                style={{ letterSpacing: '-0.01em' }}
                            >
                                {user.name}
                            </h2>
                            <p className="text-white/75 text-sm mb-3">{user.email}</p>
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                                    {user.role === 'admin' ? 'admin_panel_settings' : user.role === 'merchant' ? 'storefront' : 'person'}
                                </span>
                                {user.role === 'admin' ? 'Administrator' : user.role === 'merchant' ? 'Merchant' : 'Food Explorer'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-2xl w-full mx-auto px-6 py-6 space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-2">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center py-4 px-2 rounded-2xl bg-surface border border-ink-300 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-primary mb-1.5" style={{ fontSize: '22px' }}>{stat.icon}</span>
                                <span className="text-lg font-bold text-ink-900">{stat.value}</span>
                                <span className="text-[11px] text-ink-400 font-medium tracking-wide uppercase">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-surface border border-ink-300 hover:border-primary/20 hover:shadow-sm transition-all duration-200 group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/10"
                                    style={{ background: 'color-mix(in srgb, var(--color-primary) 7%, transparent)' }}
                                >
                                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>{item.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-ink-800">{item.label}</p>
                                    <p className="text-xs text-ink-400 truncate">{item.desc}</p>
                                </div>
                                <span className="material-symbols-outlined text-ink-300 group-hover:text-primary/60 transition-colors shrink-0" style={{ fontSize: '18px' }}>
                                    chevron_right
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Admin / Merchant console link — each role goes to its own console */}
                    {user.role === 'admin' && (
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary">Panel Admin</p>
                                <p className="text-xs text-ink-400">Moderasi &amp; kelola platform</p>
                            </div>
                            <span className="material-symbols-outlined text-primary/30 group-hover:text-primary/60 transition-colors shrink-0" style={{ fontSize: '18px' }}>
                                chevron_right
                            </span>
                        </Link>
                    )}
                    {user.role === 'merchant' && (
                        <Link
                            href="/merchant/dashboard"
                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>dashboard</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary">Dashboard Merchant</p>
                                <p className="text-xs text-ink-400">Kelola tempat kuliner kamu</p>
                            </div>
                            <span className="material-symbols-outlined text-primary/30 group-hover:text-primary/60 transition-colors shrink-0" style={{ fontSize: '18px' }}>
                                chevron_right
                            </span>
                        </Link>
                    )}

                    {/* Logout */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border border-red-100 hover:bg-red-50/60 transition-all duration-200 group mt-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                            <span className="material-symbols-outlined text-red-500" style={{ fontSize: '20px' }}>logout</span>
                        </div>
                        <p className="text-sm font-semibold text-red-600">Keluar dari Akun</p>
                    </Link>
                </div>
            </div>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;
