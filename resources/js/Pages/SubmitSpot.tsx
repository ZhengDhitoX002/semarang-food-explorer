import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

export default function SubmitSpot() {
    const { categories, tags } = usePage<{ categories: Category[]; tags: Tag[] }>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        address: '',
        latitude: '',
        longitude: '',
        price: '',
        tags: [] as number[],
        photos: [] as File[],
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [geocodeLoading, setGeocodeLoading] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [geocodeFound, setGeocodeFound] = useState(false);

    const handleTagToggle = (tagId: number) => {
        const current = data.tags;
        if (current.includes(tagId)) {
            setData('tags', current.filter(id => id !== tagId));
        } else {
            setData('tags', [...current, tagId]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 3);
            setData('photos', filesArray);
            setPreviewImages(filesArray.map(f => URL.createObjectURL(f)));
        }
    };

    const handleGeocode = async () => {
        if (!addressInput.trim()) return;
        setGeocodeLoading(true);
        setGeocodeFound(false);
        try {
            const response = await fetch(
                `/api/geocode/search?q=${encodeURIComponent(addressInput + ' Semarang')}`
            );
            const res = await response.json();
            if (res.success && res.data) {
                setData(prev => ({
                    ...prev,
                    latitude: String(res.data.latitude),
                    longitude: String(res.data.longitude),
                    address: addressInput,
                }));
                setGeocodeFound(true);
            } else {
                alert('Alamat tidak ditemukan. Coba lebih spesifik.');
            }
        } catch {
            alert('Gagal mencari koordinat.');
        }
        setGeocodeLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/spot/submit', {
            forceFormData: true,
        });
    };

    const inputClass = 'w-full h-[50px] px-3.5 border-[1.5px] border-ink-300 rounded-2xl bg-surface text-ink-900 text-sm font-medium placeholder:text-ink-400 outline-none focus:border-primary transition-colors';

    return (
        <AppLayout>
            <Head title="Submit Tempat Kuliner" />
            <div className="max-w-xl mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-primary mb-4 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Kembali ke Explorer
                </Link>

                <h1 className="font-display text-[22px] font-bold tracking-tight text-ink-900 mb-4">
                    Ajukan Tempat Baru
                </h1>

                {/* Info Banner */}
                <div className="flex gap-2.5 bg-chip border border-ink-300 rounded-2xl px-3.5 py-3 mb-6 text-[12px] leading-relaxed text-chip-ink">
                    <span className="material-symbols-outlined text-base shrink-0">shield</span>
                    Setiap tempat yang diajukan akan ditinjau admin dulu (biasanya &lt;1x24 jam) sebelum tampil ke publik — supaya rekomendasi tetap bisa dipercaya.
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">Nama Tempat *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="contoh: Warung Soto Bangkong"
                            className={inputClass}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">Deskripsi *</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Ceritakan tentang tempat ini..."
                            rows={4}
                            className={`${inputClass} !h-auto min-h-[90px] py-3 resize-y`}
                        />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">Kategori *</label>
                        <select
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Pilih kategori...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">
                            Tag <span className="text-ink-500 font-medium">(pilih yang sesuai)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`text-[11.5px] font-semibold px-3.5 py-2 rounded-full border-[1.5px] transition-colors ${
                                        data.tags.includes(tag.id)
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-ink-300 bg-surface text-ink-500'
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address / Geocoding */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">Alamat</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={addressInput}
                                onChange={e => { setAddressInput(e.target.value); setGeocodeFound(false); }}
                                placeholder="contoh: Jl. Pandanaran No. 1"
                                className={`${inputClass} flex-1`}
                            />
                            <button
                                type="button"
                                onClick={handleGeocode}
                                disabled={geocodeLoading}
                                className="h-[50px] px-3.5 rounded-2xl bg-ink-900 text-background-light text-xs font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-base">my_location</span>
                                {geocodeLoading ? '...' : 'Cari'}
                            </button>
                        </div>
                        {geocodeFound && (
                            <div className="flex items-start gap-1.5 mt-2 text-[10.5px] font-semibold leading-relaxed text-secondary-700">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Koordinat ditemukan: {data.latitude}, {data.longitude} — geser pin di peta kalau kurang tepat.
                            </div>
                        )}
                    </div>

                    {/* Lat/Lng */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1.5">Latitude *</label>
                            <input type="text" value={data.latitude} onChange={e => setData('latitude', e.target.value)} className={inputClass} placeholder="-6.9822" />
                            {errors.latitude && <p className="text-red-600 text-xs mt-1">{errors.latitude}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1.5">Longitude *</label>
                            <input type="text" value={data.longitude} onChange={e => setData('longitude', e.target.value)} className={inputClass} placeholder="110.4180" />
                            {errors.longitude && <p className="text-red-600 text-xs mt-1">{errors.longitude}</p>}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">Harga Rata-rata (Rp) *</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            placeholder="15000"
                            className={inputClass}
                        />
                        {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                    </div>

                    {/* Photos */}
                    <div className="mb-7">
                        <label className="block text-sm font-bold text-ink-700 mb-1.5">
                            Foto <span className="text-ink-500 font-medium">(maks. 3, JPG/PNG di bawah 5MB)</span>
                        </label>

                        {previewImages.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 mb-3">
                                {previewImages.map((src, idx) => (
                                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-ink-300">
                                        <img src={src} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <label className="flex flex-col items-center gap-1.5 text-center px-4 py-4 rounded-2xl border-[1.5px] border-dashed border-primary bg-primary/5 text-primary cursor-pointer transition-colors">
                            <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                            <span className="text-sm font-bold">
                                {previewImages.length > 0 ? 'Ganti Foto' : 'Seret foto ke sini atau ketuk untuk unggah'}
                            </span>
                            <span className="text-[11px] font-medium text-ink-500">Foto close-up makanan biasanya paling menarik perhatian</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full h-[50px] rounded-2xl bg-primary text-white text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">send</span>
                        {processing ? 'Mengirim...' : 'Ajukan Tempat Ini'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
