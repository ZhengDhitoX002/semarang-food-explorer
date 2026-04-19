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
        <div className="min-h-screen bg-slate-50/80 font-display">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
                <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                        </button>
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-9 w-9 bg-gradient-to-br from-primary to-orange-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-lg">restaurant_menu</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                                    Semarang<span className="text-primary">Food</span>
                                </h1>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase leading-none">Merchant Portal</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kembali ke Website
                        </Link>
                        <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar — Desktop */}
                <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r border-slate-200/60 bg-white min-h-[calc(100vh-64px)] sticky top-16">
                    <div className="flex-1 py-6 px-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">Menu Utama</p>
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = activeNav === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary/10 text-primary shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-icon' : ''}`}>{item.icon}</span>
                                        {item.label}
                                        {isActive && <div className="ml-auto w-1.5 h-5 bg-primary rounded-full" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-gradient-to-br from-primary/5 to-orange-50 rounded-2xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Boost Toko Anda</p>
                                    <p className="text-[11px] text-slate-500">Promosi mulai Rp 50.000</p>
                                </div>
                            </div>
                            <Link href="/merchant/promotion" className="block w-full text-center py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                                Mulai Promosi
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <>
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                        <aside className="fixed top-16 left-0 bottom-0 w-[280px] bg-white border-r border-slate-200 z-50 lg:hidden overflow-y-auto">
                            <div className="py-6 px-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">Menu Utama</p>
                                <nav className="flex flex-col gap-1">
                                    {navItems.map((item) => {
                                        const isActive = activeNav === item.id;
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
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
