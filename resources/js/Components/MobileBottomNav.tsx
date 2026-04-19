import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface MobileBottomNavProps {
    activeTab?: string;
}

const navItems = [
    { id: 'explore', icon: 'explore', label: 'Explore', href: '/' },
    { id: 'favorites', icon: 'favorite', label: 'Favorites', href: '/favorites' },
    { id: 'orders', icon: 'receipt_long', label: 'Orders', href: '/orders' },
    { id: 'profile', icon: 'account_circle', label: 'Profile', href: '/profile' },
];

export default function MobileBottomNav({ activeTab = 'explore' }: MobileBottomNavProps) {
    const { auth } = usePage<any>().props;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderTop: '1px solid rgba(231, 126, 35, 0.08)',
                    boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.06)',
                }}
                className="flex h-[68px] w-full items-center justify-around px-2 pb-safe"
            >
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const profileNeedsAuth = item.id === 'profile' && !auth?.user;
                    const href = profileNeedsAuth ? '/login' : item.href;

                    return (
                        <Link
                            key={item.id}
                            href={href}
                            prefetch
                            preserveState
                            className="relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200"
                            style={{
                                minWidth: '64px',
                                background: isActive ? 'rgba(231, 126, 35, 0.1)' : 'transparent',
                                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                            }}
                        >
                            <span
                                className="absolute -top-1 left-1/2 w-5 h-1 rounded-full transition-all duration-200 ease-out"
                                style={{
                                    background: 'linear-gradient(90deg, #e77e23, #f4a261)',
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(4px)',
                                }}
                            />
                            <span
                                className={`material-symbols-outlined transition-colors duration-200 ${isActive ? 'fill-icon' : ''}`}
                                style={{
                                    fontSize: '24px',
                                    color: isActive ? '#e77e23' : '#94a3b8',
                                }}
                            >
                                {item.icon}
                            </span>
                            <span
                                className="transition-all duration-200"
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: isActive ? '#e77e23' : '#94a3b8',
                                }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
