import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface HeaderProps {
    showSearch?: boolean;
}

export default function Header({ showSearch = true }: HeaderProps) {
    const { auth } = usePage<any>().props;
    const [searchVal, setSearchVal] = React.useState(
        new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('search') || ''
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            router.get('/', { search: searchVal }, { preserveState: true, preserveScroll: true, replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 py-3 lg:px-12">
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

            {showSearch && (
                <div className="hidden flex-1 justify-center px-8 md:flex">
                    <div className="relative w-full max-w-xl group">
                        <div className="glass-search flex items-center w-full h-11 px-4 rounded-full transition-all duration-300 border border-slate-200">
                            <span className="material-symbols-outlined text-primary/60 group-focus-within:text-primary mr-2">
                                search
                            </span>
                            <input
                                className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 font-medium outline-none"
                                placeholder="Ketik kata pencarian, lalu tekan Enter... (misal: lumpia, soto)"
                                type="text"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">
                                tune
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-600">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </button>
                {auth?.user ? (
                    <div className="relative group cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <div className="bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden">
                                <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                                    <p className="text-sm font-bold text-slate-900 truncate">{auth.user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                </div>
                                <div className="p-2">
                                    {(auth.user.role === 'admin' || auth.user.role === 'merchant') && (
                                        <Link href="/merchant/dashboard" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">Dashboard</Link>
                                    )}
                                    <Link href="/logout" method="post" as="button" className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined">person</span>
                    </Link>
                )}
            </div>
        </header>
    );
}
