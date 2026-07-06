import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

interface MerchantLayoutProps {
    children: React.ReactNode;
    activeNav?: string;
}

const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', href: '/merchant/dashboard' },
    { id: 'shops', icon: 'storefront', label: 'Toko Saya', href: '/merchant/shops' },
    { id: 'register', icon: 'add_business', label: 'Daftarkan Toko', href: '/merchant/shop/create' },
    { id: 'promotion', icon: 'campaign', label: 'Promosi', href: '/merchant/promotion' },
    { id: 'payments', icon: 'payments', label: 'Riwayat Pembayaran', href: '/merchant/payments' },
];

export default function MerchantLayout({ children, activeNav = 'dashboard' }: MerchantLayoutProps) {
    const { auth } = usePage<any>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background-light">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-ink-300/80">
                <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl hover:bg-ink-100 transition-colors"
                        >
                            <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                        </button>
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-display text-lg font-bold tracking-tight text-ink-900 leading-tight">
                                    Semarang<span className="text-primary">.</span>
                                </h1>
                                <p className="text-[10px] font-bold text-chip-ink tracking-widest uppercase leading-none">Merchant</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold text-ink-600 bg-ink-100 hover:bg-ink-200 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kembali ke Situs
                        </Link>
                        <div className="h-9 w-9 bg-chip rounded-xl flex items-center justify-center text-chip-ink font-display font-bold text-sm">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar — Desktop */}
                <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r border-ink-300/60 bg-surface min-h-[calc(100vh-64px)] sticky top-16">
                    <div className="flex-1 py-6 px-4">
                        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest px-3 mb-4">Menu Utama</p>
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = activeNav === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-icon' : ''}`}>{item.icon}</span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-ink-300">
                        <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(160deg, var(--color-primary-500), var(--color-primary-800))' }}>
                            <span className="material-symbols-outlined">trending_up</span>
                            <p className="font-display font-bold text-sm mt-2">Toko belum terlihat maksimal?</p>
                            <p className="text-[11px] opacity-85 mt-1.5 mb-3 leading-relaxed">Promosikan tokomu mulai Rp 50rb dan naik ke urutan atas pencarian.</p>
                            <Link href="/merchant/promotion" className="block w-full text-center py-2.5 bg-white text-primary text-xs font-bold rounded-lg hover:bg-white/90 transition-colors">
                                Promosikan Sekarang
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                        <aside className="fixed top-16 left-0 bottom-0 w-[280px] bg-surface border-r border-ink-300 z-50 lg:hidden overflow-y-auto">
                            <div className="py-6 px-4">
                                <p className="text-[10px] font-bold text-ink-400 uppercase tracking-widest px-3 mb-4">Menu Utama</p>
                                <nav className="flex flex-col gap-1">
                                    {navItems.map((item) => {
                                        const isActive = activeNav === item.id;
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                                    isActive ? 'bg-primary text-white' : 'text-ink-600 hover:bg-ink-100'
                                                }`}
                                            >
                                                <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-icon' : ''}`}>{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
