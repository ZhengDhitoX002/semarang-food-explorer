import React from 'react';

export default function Footer() {
    return (
        <footer className="border-t border-primary/10 bg-white py-10 px-4">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/20 rounded flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
                    </div>
                    <span className="font-bold text-slate-900">Semarang Food Explorer</span>
                </div>
                <div className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Semarang Culinary Guide. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a className="text-slate-500 hover:text-primary transition-colors text-sm font-medium" href="#">Privacy</a>
                    <a className="text-slate-500 hover:text-primary transition-colors text-sm font-medium" href="#">Terms</a>
                    <a className="text-slate-500 hover:text-primary transition-colors text-sm font-medium" href="#">Help</a>
                </div>
            </div>
        </footer>
    );
}
