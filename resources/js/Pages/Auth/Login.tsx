import React, { FormEvent, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-background-light flex flex-col">
                {/* Hero — plain warm gradient, no photo, so the text always stays legible */}
                <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-[linear-gradient(160deg,var(--color-primary-100)_0%,var(--color-background-light)_65%)]">
                    <Link href="/" className="absolute inset-x-0 bottom-7 text-center px-10">
                        <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-primary mb-3">
                            Jelajah Kuliner
                        </p>
                        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
                            Semarang.
                        </h1>
                        <p className="text-xs font-medium text-ink-500 mt-2.5 leading-relaxed">
                            Temukan kuliner otentik kota Semarang — dari lumpia sampai tahu gimbal.
                        </p>
                    </Link>
                </div>

                {/* Card */}
                <div className="flex-1 bg-background-light relative z-10 px-5 pt-7 pb-10">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="font-display text-xl font-bold text-ink-900 mb-1">Selamat datang</h2>
                        <p className="text-sm text-ink-500 mb-6">Masuk untuk menyimpan favorit &amp; menulis ulasan.</p>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-ink-700 mb-2">Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-[20px] pointer-events-none">
                                        mail
                                    </span>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 rounded-full border border-ink-300 bg-surface text-sm font-medium focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-ink-700 mb-2">Kata sandi</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-[20px] pointer-events-none">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-11 pr-11 py-3.5 rounded-full border border-ink-300 bg-surface text-sm font-medium focus:border-primary appearance-none outline-none transition-all duration-300 focus:-translate-y-0.5 focus:shadow-md"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
                                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember */}
                            <label className="flex items-center gap-2 text-sm text-ink-600 select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-ink-300 text-primary focus:ring-primary"
                                />
                                Ingat saya
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <p className="text-sm text-ink-500 text-center mt-6">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
