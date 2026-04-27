import React, { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Daftar Akun" />
            <div className="min-h-screen flex items-center justify-center bg-background-light font-display px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Semarang<span className="text-primary">Food</span>
                            </h1>
                        </Link>
                        <p className="text-slate-500 mt-3">Buat akun baru</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-4 focus:ring-primary/15 focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                    placeholder="Nama Anda"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-4 focus:ring-primary/15 focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                    placeholder="contoh@email.com"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-4 focus:ring-primary/15 focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-4 focus:ring-primary/15 focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                    placeholder="Ulangi password"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? 'Memproses...' : 'Daftar'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="text-primary font-bold hover:underline">
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
