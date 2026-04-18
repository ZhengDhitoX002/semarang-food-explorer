import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Security() {
    const { data, setData, put, processing, errors, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Keamanan" />
            <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-slate-500">arrow_back</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Keamanan</h1>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">lock</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Ubah Password</h2>
                            <p className="text-sm text-slate-500">Pastikan akun Anda menggunakan sandi yang kuat.</p>
                        </div>
                    </div>

                    {recentlySuccessful && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Password berhasil diubah!
                        </div>
                    )}
                    
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password Saat Ini</label>
                            <input
                                type="password"
                                value={data.current_password}
                                onChange={e => setData('current_password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            {errors.current_password && <p className="mt-2 text-sm text-red-500">{errors.current_password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password Baru</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Perbarui Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Security.layout = (page: React.ReactNode) => <AppLayout activeTab="profile" showFooter={false}>{page}</AppLayout>;
