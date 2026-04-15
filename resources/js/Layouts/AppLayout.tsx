import React, { ReactNode } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';

interface AppLayoutProps {
    children: ReactNode;
    showSearch?: boolean;
    showFooter?: boolean;
    showMobileNav?: boolean;
    activeTab?: string;
}

export default function AppLayout({
    children,
    showSearch = true,
    showFooter = true,
    showMobileNav = false,
    activeTab = 'explore',
}: AppLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header showSearch={showSearch} />
            <main className="flex flex-1 flex-col">{children}</main>
            {showFooter && <Footer />}
            {showMobileNav && <MobileBottomNav activeTab={activeTab} />}
        </div>
    );
}
