import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { url } = usePage();

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/admin/dashboard?tab=pending', label: 'Pending', icon: '⏳' },
        { href: '/admin/dashboard?tab=reviews', label: 'Reviews', icon: '💬' },
        { href: '/admin/dashboard?tab=spots', label: 'Semua Spot', icon: '📍' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#e2e8f0' }}>
            {/* Sidebar */}
            <aside style={{
                width: 240,
                background: '#1e293b',
                borderRight: '1px solid #334155',
                padding: '24px 0',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ padding: '0 20px', marginBottom: 32 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{
                            fontSize: 18,
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #e77e23, #f4a261)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🛡️ Admin Panel
                        </h1>
                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Semarang Food Explorer</p>
                    </Link>
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = url === item.href || 
                            (item.href.includes('tab=') && url.includes(item.href.split('?')[1])) ||
                            (item.href === '/admin/dashboard' && !url.includes('tab=') && url.startsWith('/admin'));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '12px 20px',
                                    fontSize: 14,
                                    textDecoration: 'none',
                                    color: isActive ? '#f4a261' : '#94a3b8',
                                    background: isActive ? 'rgba(244, 162, 97, 0.1)' : 'transparent',
                                    borderLeft: isActive ? '3px solid #f4a261' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '0 20px' }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 0',
                            fontSize: 13,
                            color: '#64748b',
                            textDecoration: 'none',
                        }}
                    >
                        ← Kembali ke Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
