import React, { useRef, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Edit() {
    const { auth } = usePage<any>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(auth.user.name);
    const [email, setEmail] = useState(auth.user.email);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(auth.user.avatar_url);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [success, setSuccess] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('_method', 'PUT');
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        router.post('/profile', formData, {
            forceFormData: true,
            onSuccess: () => {
                setProcessing(false);
                setSuccess(true);
                setAvatarFile(null);
                setTimeout(() => setSuccess(false), 3000);
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs);
            },
        });
    };

    const user = auth.user;

    return (
        <>
            <Head title="Edit Profil" />
            <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="w-10 h-10 rounded-full border border-ink-300 flex items-center justify-center hover:bg-ink-100 transition-colors">
                        <span className="material-symbols-outlined text-ink-500">arrow_back</span>
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-ink-900">Edit Profil</h1>
                </div>

                <div className="bg-surface rounded-3xl border border-ink-300 p-6 md:p-8 shadow-sm">
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Profil berhasil diperbarui!
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-ink-200 shadow-md"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-ink-200 flex items-center justify-center shadow-md">
                                        <span className="text-4xl font-bold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                                {/* Overlay */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ fontSize: '28px' }}>
                                        photo_camera
                                    </span>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-primary font-semibold hover:underline"
                            >
                                Ganti Foto Profil
                            </button>
                            {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-ink-300 focus:border-primary outline-none transition-all"
                                placeholder="Masukkan nama Anda"
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-ink-300 focus:border-primary outline-none transition-all"
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
