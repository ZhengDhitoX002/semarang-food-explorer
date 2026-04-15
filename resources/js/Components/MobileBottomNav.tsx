import React from 'react';

interface MobileBottomNavProps {
    activeTab?: string;
}

const navItems = [
    { id: 'explore', icon: 'explore', label: 'Explore' },
    { id: 'favorites', icon: 'favorite', label: 'Favorites' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders' },
    { id: 'profile', icon: 'account_circle', label: 'Profile' },
];

export default function MobileBottomNav({ activeTab = 'explore' }: MobileBottomNavProps) {
    return (
        <nav className="sticky bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-primary/10 bg-white/90 backdrop-blur-lg md:hidden">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`flex flex-col items-center gap-1 ${
                        activeTab === item.id ? 'text-primary' : 'text-slate-400'
                    }`}
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className={`text-[10px] ${activeTab === item.id ? 'font-bold' : 'font-medium'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}
