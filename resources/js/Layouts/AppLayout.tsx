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
    showMobileNav = true,
    activeTab = 'explore',
}: AppLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header showSearch={showSearch} activeTab={activeTab} />
            <main className="flex flex-1 flex-col pb-[68px] md:pb-0">{children}</main>
            {showFooter && <Footer />}
            {showMobileNav && <MobileBottomNav activeTab={activeTab} />}
        </div>
    );
}
