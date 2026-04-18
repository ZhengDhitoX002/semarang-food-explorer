import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit() {
    const { auth } = usePage<any>().props;
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile');
    };

    return (
        <>
            <Head title="Edit Profil" />
            <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">arrow_back</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Profil</h1>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
                    {recentlySuccessful && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Profil berhasil diperbarui!
                        </div>
                    )}
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Masukkan nama Anda"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Masukkan email aktif"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;
