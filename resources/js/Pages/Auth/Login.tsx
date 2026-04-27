import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
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
                        <p className="text-slate-500 mt-3">Masuk ke akun Anda</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary focus:ring-offset-0 appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
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
                                    className="w-full px-6 py-3.5 rounded-full border border-slate-200 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary focus:ring-offset-0 appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    Ingat saya
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Belum punya akun?{' '}
                                <Link href="/register" className="text-primary font-bold hover:underline">
                                    Daftar di sini
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
