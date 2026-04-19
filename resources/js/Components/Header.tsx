import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface HeaderProps {
    showSearch?: boolean;
    activeTab?: string;
}

const desktopNavItems = [
    { id: 'explore', icon: 'explore', label: 'Explore', href: '/' },
    { id: 'favorites', icon: 'favorite', label: 'Favorites', href: '/favorites' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders', href: '/orders' },
];

export default function Header({ showSearch = true, activeTab = 'explore' }: HeaderProps) {
    const { auth } = usePage<any>().props;
    const [searchVal, setSearchVal] = React.useState(
        new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('search') || ''
    );
    const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            router.get('/', { search: searchVal }, { preserveState: true, preserveScroll: true, replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-3 lg:px-12">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined">restaurant_menu</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            Semarang<span className="text-primary">Food</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 ml-8">
                    {desktopNavItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                prefetch
                                preserveState
                                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                style={{
                                    color: isActive ? '#e77e23' : '#64748b',
                                    background: isActive ? 'rgba(231, 126, 35, 0.08)' : 'transparent',
                                }}
                            >
                                <span
                                    className={`material-symbols-outlined text-lg ${isActive ? 'fill-icon' : ''}`}
                                    style={{ fontSize: '20px' }}
                                >
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && (
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #e77e23, #f4a261)' }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Search Bar */}
                {showSearch && (
                    <div className="hidden md:flex flex-1 justify-center px-6">
                        <div className="relative w-full max-w-md group">
                            <div className="glass-search flex items-center w-full h-10 px-4 rounded-full transition-all duration-300 border border-slate-200">
                                <span className="material-symbols-outlined text-primary/60 group-focus-within:text-primary mr-2" style={{ fontSize: '20px' }}>
                                    search
                                </span>
                                <input
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium outline-none"
                                    placeholder="Cari kuliner... (tekan Enter)"
                                    type="text"
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Right side: notifications + profile */}
                <div className="flex items-center gap-2">
                    {/* Mobile search toggle */}
                    {showSearch && (
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600">
                                {mobileSearchOpen ? 'close' : 'search'}
                            </span>
                        </button>
                    )}

                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-slate-600">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </button>

                    {auth?.user ? (
                        <div className="relative group cursor-pointer">
                            <Link
                                href="/profile"
                                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold hover:bg-primary/20 transition-colors"
                            >
                                {auth.user.name.charAt(0).toUpperCase()}
                            </Link>
                            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-sm font-bold text-slate-900 truncate">{auth.user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/profile" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">account_circle</span>
                                                Profile
                                            </span>
                                        </Link>
                                        <Link href="/favorites" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">favorite</span>
                                                Favorites
                                            </span>
                                        </Link>
                                        <Link href="/orders" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                            <span className="inline-flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">receipt_long</span>
                                                Orders
                                            </span>
                                        </Link>
                                        {(auth.user.role === 'admin' || auth.user.role === 'merchant') && (
                                            <Link href="/merchant/dashboard" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-base">dashboard</span>
                                                    Dashboard
                                                </span>
                                            </Link>
                                        )}
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <Link href="/logout" method="post" as="button" className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-base">logout</span>
                                                    Logout
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">login</span>
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Search Dropdown */}
            {showSearch && mobileSearchOpen && (
                <div className="md:hidden px-4 pb-3 animate-slideDown">
                    <div className="glass-search flex items-center w-full h-11 px-4 rounded-2xl transition-all duration-300 border border-slate-200">
                        <span className="material-symbols-outlined text-primary/60 mr-2" style={{ fontSize: '20px' }}>
                            search
                        </span>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium outline-none"
                            placeholder="Cari kuliner... (tekan Enter)"
                            type="text"
                            autoFocus
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
