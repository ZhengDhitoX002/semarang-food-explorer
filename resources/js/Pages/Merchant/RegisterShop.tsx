import React, { useState, useRef } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface Category {
    id: number;
    name: string;
}

const steps = [
    { id: 1, title: 'Info Dasar', icon: 'info' },
    { id: 2, title: 'Lokasi', icon: 'location_on' },
    { id: 3, title: 'Detail', icon: 'tune' },
    { id: 4, title: 'Review', icon: 'check_circle' },
];

export default function RegisterShop() {
    const { categories } = usePage<{ categories: Category[] }>().props;
    const [step, setStep] = useState(1);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        latitude: '-6.9932',
        longitude: '110.4203',
        price: '',
        address: '',
        operating_hours: '',
        phone: '',
        photo: null as File | null,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/merchant/shop', {
            forceFormData: true,
        });
    };

    const canProceed = () => {
        switch (step) {
            case 1: return data.name.trim() !== '' && data.description.trim() !== '' && data.category_id !== '';
            case 2: return data.latitude !== '' && data.longitude !== '';
            case 3: return data.price !== '';
            default: return true;
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white";
    const labelClass = "text-sm font-bold text-slate-700 mb-1.5 block";

    return (
        <>
            <Head title="Daftarkan Toko Baru" />
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daftarkan Toko Baru</h1>
                    <p className="text-slate-500 mt-1">Isi informasi berikut untuk mendaftarkan toko Anda di Semarang Food Explorer</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between mb-10 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    {steps.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    step >= s.id
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <span className="material-symbols-outlined text-lg">{step > s.id ? 'check' : s.icon}</span>
                                </div>
                                <span className={`hidden sm:block text-sm font-semibold transition-colors ${step >= s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {s.title}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 ${step > s.id ? 'bg-primary' : 'bg-slate-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Info Dasar */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Informasi Dasar</h2>
                                    <p className="text-xs text-slate-500">Nama, deskripsi, dan kategori toko Anda</p>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Nama Toko *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} placeholder="Contoh: Warung Makan Semarang Asri" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Deskripsi *</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className={`${inputClass} min-h-[120px] resize-none`} placeholder="Ceritakan tentang toko Anda, menu andalan, suasana tempat..." required />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Kategori *</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={inputClass} required>
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Nomor Telepon / WhatsApp</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} placeholder="08xx-xxxx-xxxx" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Lokasi */}
                    {step === 2 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600">location_on</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Lokasi Toko</h2>
                                    <p className="text-xs text-slate-500">Masukkan alamat dan koordinat lokasi</p>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Alamat Lengkap</label>
                                <textarea value={data.address} onChange={e => setData('address', e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} placeholder="Jl. Pandanaran No.XX, Semarang Tengah..." />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Latitude *</label>
                                    <input type="text" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className={inputClass} placeholder="-6.9932" required />
                                    {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Longitude *</label>
                                    <input type="text" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className={inputClass} placeholder="110.4203" required />
                                    {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-500 mt-0.5">tip_and_update</span>
                                <div>
                                    <p className="text-sm font-bold text-blue-800">Tips Mendapatkan Koordinat</p>
                                    <p className="text-xs text-blue-600 mt-1">Buka Google Maps → Klik kanan pada lokasi toko → Salin koordinat (latitude, longitude). Contoh: -6.9932, 110.4203</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Detail */}
                    {step === 3 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-600">tune</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Detail Toko</h2>
                                    <p className="text-xs text-slate-500">Harga, jam operasional, dan foto toko</p>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Harga Rata-rata (Rupiah) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className={`${inputClass} pl-12`} placeholder="25000" required />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Jam Operasional</label>
                                <input type="text" value={data.operating_hours} onChange={e => setData('operating_hours', e.target.value)} className={inputClass} placeholder="08:00 - 22:00 (Senin - Sabtu)" />
                            </div>

                            <div>
                                <label className={labelClass}>Foto Toko</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                                >
                                    {previewImage ? (
                                        <div className="relative inline-block">
                                            <img src={previewImage} alt="Preview" className="max-h-40 rounded-xl shadow-md mx-auto" />
                                            <p className="text-xs text-slate-500 mt-3">Klik untuk ganti foto</p>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">add_photo_alternate</span>
                                            <p className="text-sm font-bold text-slate-600">Klik untuk upload foto</p>
                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP maks 5MB</p>
                                        </>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-600">check_circle</span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Review & Konfirmasi</h2>
                                    <p className="text-xs text-slate-500">Pastikan semua informasi sudah benar</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Preview Card */}
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-6 border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Preview Toko</h3>
                                    {previewImage && (
                                        <img src={previewImage} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-4" />
                                    )}
                                    <h4 className="text-xl font-bold text-slate-900">{data.name || 'Nama Toko'}</h4>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{data.description || 'Deskripsi toko...'}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                            <span className="material-symbols-outlined text-[14px]">sell</span>
                                            Rp {Number(data.price || 0).toLocaleString('id-ID')}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                            <span className="material-symbols-outlined text-[14px]">category</span>
                                            {categories.find(c => c.id === Number(data.category_id))?.name || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Summary */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Detail Informasi</h3>
                                    {[
                                        { label: 'Nama Toko', value: data.name, icon: 'store' },
                                        { label: 'Kategori', value: categories.find(c => c.id === Number(data.category_id))?.name || '-', icon: 'category' },
                                        { label: 'Harga Rata2', value: `Rp ${Number(data.price || 0).toLocaleString('id-ID')}`, icon: 'sell' },
                                        { label: 'Koordinat', value: `${data.latitude}, ${data.longitude}`, icon: 'location_on' },
                                        { label: 'Jam Operasional', value: data.operating_hours || 'Belum diisi', icon: 'schedule' },
                                        { label: 'Telepon', value: data.phone || 'Belum diisi', icon: 'phone' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <span className="material-symbols-outlined text-slate-400 text-lg">{item.icon}</span>
                                            <div>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                                                <p className="text-sm font-semibold text-slate-900">{item.value || '-'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => setStep(Math.max(1, step - 1))}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                step === 1
                                    ? 'opacity-0 pointer-events-none'
                                    : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Kembali
                        </button>

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={() => setStep(Math.min(4, step + 1))}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-40 disabled:hover:bg-primary disabled:shadow-none"
                            >
                                Lanjutkan
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-lg">check</span>
                                {processing ? 'Menyimpan...' : 'Daftarkan Toko'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

RegisterShop.layout = (page: React.ReactNode) => <MerchantLayout activeNav="register">{page}</MerchantLayout>;
