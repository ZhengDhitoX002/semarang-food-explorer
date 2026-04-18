import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const faqs = [
    { q: "Bagaimana cara memesan makanan?", a: "Klik tempat kuliner, pilih menu (jika tersedia), lalu tekan tombol Pesan Sekarang. Untuk fitur Beta ini, pesanan akan langsung diarahkan ke kontak merchant." },
    { q: "Apakah fitur review terbuka untuk umum?", a: "Ya, jika Anda sudah mendaftar dan login, Anda dapat memberikan rating bintang dan komentar ulasan di halaman tempat kuliner mana pun." },
    { q: "Bagaimana kalau restoran ternyata tutup?", a: "Tergantung status operasional yang diperbarui oleh Merchant. Namun sebagian besar jam operasional kami sesuaikan & terverifikasi dengan data pemetaan langsung." }
];

export default function Help() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <>
            <Head title="Pusat Bantuan" />
            <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">arrow_back</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Pusat Bantuan</h1>
                </div>

                {/* FAQ Accordions */}
                <div className="space-y-4 mb-8">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-900">{faq.q}</span>
                                <span className="material-symbols-outlined text-slate-400">
                                    {openIdx === idx ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                </span>
                            </button>
                            {openIdx === idx && (
                                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CS */}
                <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Butuh Bantuan Lain?</h3>
                    <p className="text-sm text-slate-600 mb-6">Tim dukungan kami siap mendengarkan kendala dan saran Anda. Hubungi kami pada jam operasional kerja.</p>
                    <a href="mailto:support@semarangfood.com" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95">
                        Hubungi via Email
                    </a>
                </div>
            </div>
        </>
    );
}

Help.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;
