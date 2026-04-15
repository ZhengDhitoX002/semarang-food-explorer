import React, { ReactNode } from 'react';

interface MerchantLayoutProps {
    children: ReactNode;
}

const navItems = [
    { icon: 'dashboard', label: 'Overview', active: true },
    { icon: 'campaign', label: 'Promotions', active: false },
    { icon: 'reviews', label: 'Reviews', active: false },
    { icon: 'settings', label: 'Settings', active: false },
];

export default function MerchantLayout({ children }: MerchantLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">Semarang Food</h1>
                        <p className="text-xs text-slate-500">Merchant Dashboard</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-2 space-y-1">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                item.active
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            href="#"
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">storefront</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-slate-900">Warung Makan Sederhana</p>
                            <p className="text-xs text-slate-500">Verified Partner</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                search
                            </span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Search analytics..."
                                type="text"
                            />
                        </div>
                        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined text-slate-600">help</span>
                        </button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
