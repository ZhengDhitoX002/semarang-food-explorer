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

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        fontSize: 14,
        borderRadius: 10,
        border: '1px solid #334155',
        background: '#0f172a',
        color: '#e2e8f0',
        outline: 'none',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: 6,
        display: 'block',
    };

    const errorStyle: React.CSSProperties = {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
    };

    return (
        <AppLayout>
            <Head title="Submit Tempat Kuliner" />
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
                <Link href="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 16, display: 'block' }}>
                    ← Kembali ke Explorer
                </Link>

                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#f8fafc' }}>
                    📍 Submit Tempat Kuliner
                </h1>

                {/* Info Banner */}
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    marginBottom: 28,
                    fontSize: 13,
                    color: '#93c5fd',
                    lineHeight: 1.6,
                }}>
                    ℹ️ Tempat yang Anda submit akan <strong>direview oleh admin</strong> terlebih dahulu sebelum ditampilkan di halaman utama.
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Nama Tempat *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="contoh: Warung Soto Bangkong"
                            style={inputStyle}
                        />
                        {errors.name && <p style={errorStyle}>{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Deskripsi *</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Ceritakan tentang tempat ini..."
                            rows={4}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                        {errors.description && <p style={errorStyle}>{errors.description}</p>}
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Kategori *</label>
                        <select
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Pilih kategori...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p style={errorStyle}>{errors.category_id}</p>}
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Tags</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    style={{
                                        padding: '6px 14px',
                                        fontSize: 13,
                                        borderRadius: 20,
                                        border: '1px solid',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        borderColor: data.tags.includes(tag.id) ? '#f4a261' : '#334155',
                                        background: data.tags.includes(tag.id) ? 'rgba(244, 162, 97, 0.15)' : 'transparent',
                                        color: data.tags.includes(tag.id) ? '#f4a261' : '#94a3b8',
                                    }}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Address / Geocoding */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Alamat (Cari Koordinat Otomatis)</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={addressInput}
                                onChange={e => setAddressInput(e.target.value)}
                                placeholder="contoh: Jl. Pandanaran No. 1"
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={handleGeocode}
                                disabled={geocodeLoading}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    borderRadius: 10,
                                    border: 'none',
                                    background: '#3b82f6',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    opacity: geocodeLoading ? 0.5 : 1,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {geocodeLoading ? '⏳ ...' : '🔍 Cari'}
                            </button>
                        </div>
                    </div>

                    {/* Lat/Lng */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                        <div>
                            <label style={labelStyle}>Latitude *</label>
                            <input type="text" value={data.latitude} onChange={e => setData('latitude', e.target.value)} style={inputStyle} placeholder="-6.9822" />
                            {errors.latitude && <p style={errorStyle}>{errors.latitude}</p>}
                        </div>
                        <div>
                            <label style={labelStyle}>Longitude *</label>
                            <input type="text" value={data.longitude} onChange={e => setData('longitude', e.target.value)} style={inputStyle} placeholder="110.4180" />
                            {errors.longitude && <p style={errorStyle}>{errors.longitude}</p>}
                        </div>
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={labelStyle}>Harga Rata-rata (Rp) *</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            placeholder="15000"
                            style={inputStyle}
                        />
                        {errors.price && <p style={errorStyle}>{errors.price}</p>}
                    </div>

                    {/* Photos */}
                    <div style={{ marginBottom: 28 }}>
                        <label style={labelStyle}>Foto (max 3)</label>
                        
                        {previewImages.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                                {previewImages.map((src, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid #334155' }}>
                                        <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: '16px',
                            border: '2px dashed rgba(231, 126, 35, 0.5)',
                            borderRadius: 12,
                            color: '#e77e23',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: 'rgba(231, 126, 35, 0.05)'
                        }}>
                            <span className="material-symbols-outlined">add_photo_alternate</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>
                                {previewImages.length > 0 ? 'Ganti Foto' : 'Pilih Foto dari Galeri'}
                            </span>
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: 15,
                            fontWeight: 700,
                            borderRadius: 12,
                            border: 'none',
                            background: processing ? '#475569' : 'linear-gradient(135deg, #e77e23, #f4a261)',
                            color: '#fff',
                            cursor: processing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {processing ? '⏳ Mengirim...' : '🚀 Submit Tempat Kuliner'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
