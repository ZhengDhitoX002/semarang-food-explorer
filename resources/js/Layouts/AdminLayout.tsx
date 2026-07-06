import React from 'react';
import { Link, usePage } from '@inertiajs/react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
    const page = usePage<any>();
    const { auth } = page.props;
    const url = page.url;

    const navItems = [
        { href: '/admin/dashboard', label: 'Ringkasan', icon: 'space_dashboard' },
        { href: '/admin/dashboard?tab=pending', label: 'Menunggu', icon: 'pending_actions' },
        { href: '/admin/dashboard?tab=reviews', label: 'Moderasi Ulasan', icon: 'reviews' },
        { href: '/admin/dashboard?tab=spots', label: 'Semua Tempat', icon: 'restaurant' },
        { href: '/admin/dashboard?tab=categories-tags', label: 'Kategori & Tag', icon: 'sell' },
        { href: '/admin/dashboard?tab=closures', label: 'Laporan Penutupan', icon: 'report' },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'var(--color-admin-bg)',
                color: 'var(--color-admin-ink)',
                fontFamily: 'var(--font-sans)',
            }}
            className="flex flex-col md:flex-row"
        >
            {/* Sidebar — desktop only; mobile uses the compact header below instead */}
            <aside
                style={{
                    width: 252,
                    background: 'var(--color-admin-surface)',
                    borderRight: '1px solid var(--color-admin-line)',
                    padding: '22px 16px 18px',
                    flexDirection: 'column',
                }}
                className="hidden md:flex"
            >
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, padding: '2px 6px' }}>
                    <span style={{ fontFamily: 'var(--font-admin-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--color-admin-ink)' }}>
                        Semarang.
                    </span>
                    <span
                        style={{
                            marginLeft: 'auto',
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '.06em',
                            background: 'var(--color-admin-chip)',
                            color: 'var(--color-admin-chip-ink)',
                            padding: '5px 7px',
                            borderRadius: 7,
                        }}
                    >
                        Admin
                    </span>
                </Link>

                <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                                    gap: 12,
                                    padding: '11px 12px',
                                    borderRadius: 12,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : 'var(--color-admin-mut)',
                                    background: isActive ? 'var(--color-admin-accent)' : 'transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                    <div style={{ height: 1, background: 'var(--color-admin-line)', margin: '13px 6px' }} />
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '11px 12px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 600,
                            textDecoration: 'none',
                            color: 'var(--color-admin-mut)',
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                        Kembali ke Situs
                    </Link>
                </nav>

                <div
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 6px 0',
                        borderTop: '1px solid var(--color-admin-line)',
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 11,
                            background: 'var(--color-admin-chip)',
                            color: 'var(--color-admin-chip-ink)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-admin-display)',
                            fontWeight: 700,
                            fontSize: 14,
                            flexShrink: 0,
                        }}
                    >
                        {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <b style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>{auth?.user?.name || 'Admin'}</b>
                        <small style={{ fontSize: 11, color: 'var(--color-admin-mut)' }}>Administrator</small>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto' }} className="p-4 md:p-8">
                {/* Mobile-only compact header — sidebar nav is replaced by Dashboard's own tab pills */}
                <div
                    className="flex md:hidden items-center justify-between mb-4"
                    style={{ borderBottom: '1px solid var(--color-admin-line)', paddingBottom: 14 }}
                >
                    <div>
                        <small style={{ display: 'block', fontSize: 10.5, fontWeight: 600, color: 'var(--color-admin-mut)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                            Konsol Admin
                        </small>
                        <b style={{ fontFamily: 'var(--font-admin-display)', fontSize: 19, fontWeight: 800 }}>{title}</b>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 13,
                            background: 'var(--color-admin-surface)',
                            border: '1px solid var(--color-admin-line)',
                            color: 'var(--color-admin-ink)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        aria-label="Keluar"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                    </Link>
                </div>

                {children}
            </main>
        </div>
    );
}
