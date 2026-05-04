const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Semarang Food Explorer";
pres.title = "Presentasi Lengkap Proyek PWL";

// Colors (Midnight Executive Theme adapted for modern look)
const COLORS = {
  primary: "1E2761",   // Navy
  secondary: "2F3C7E", // Dark Blue
  accent: "F9A826",    // Bright Yellow/Orange accent
  bg: "F8FAFC",        // Very light gray/blue
  textDark: "111827",
  textMuted: "4B5563",
  white: "FFFFFF"
};

// ---------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// ---------------------------------------------------------
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.primary };

// Decorative shapes
slide1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.3, fill: { color: COLORS.accent } });
slide1.addShape(pres.shapes.OVAL, { x: 8.5, y: -1, w: 4, h: 4, fill: { color: COLORS.secondary, transparency: 50 } });

slide1.addText("SEMARANG FOOD EXPLORER", {
  x: 0.5, y: 2.0, w: 9, h: 1, 
  fontSize: 48, fontFace: "Arial Black", color: COLORS.white, bold: true
});

slide1.addText("Presentasi Evaluasi Proyek: Aspek 1, 2, dan 3", {
  x: 0.5, y: 3.0, w: 9, h: 0.5, 
  fontSize: 24, fontFace: "Arial", color: COLORS.accent, italic: true
});

slide1.addText("Mata Kuliah: Pemrograman Web Lanjut (Laravel/Inertia)", {
  x: 0.5, y: 4.8, w: 9, h: 0.5, 
  fontSize: 16, fontFace: "Arial", color: COLORS.white
});

// ---------------------------------------------------------
// SLIDE 2: AGENDA
// ---------------------------------------------------------
let slide2 = pres.addSlide();
slide2.background = { color: COLORS.bg };

slide2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.3, h: 5.625, fill: { color: COLORS.accent } });
slide2.addText("AGENDA PEMBAHASAN", {
  x: 0.8, y: 0.5, w: 8, h: 0.8, fontSize: 32, fontFace: "Arial Black", color: COLORS.primary
});

slide2.addText([
  { text: "1. Aspek 1: Perencanaan & Desain Database", options: { bullet: { type: "number" }, breakLine: true, bold: true, color: COLORS.textDark } },
  { text: "Menampilkan ERD, Normalisasi 3NF, dan Struktur Relasi.", options: { indentLevel: 1, breakLine: true, color: COLORS.textMuted } },
  
  { text: "2. Aspek 2: Implementasi Migration & Seeder", options: { bullet: { type: "number" }, breakLine: true, bold: true, color: COLORS.textDark, paraSpaceBefore: 20 } },
  { text: "Skema Migration lengkap dan pengujian Seeder Data Realistis.", options: { indentLevel: 1, breakLine: true, color: COLORS.textMuted } },

  { text: "3. Aspek 3: Autentikasi & Otorisasi", options: { bullet: { type: "number" }, breakLine: true, bold: true, color: COLORS.textDark, paraSpaceBefore: 20 } },
  { text: "Implementasi Session Filter dan Multi-Role Middleware.", options: { indentLevel: 1, breakLine: true, color: COLORS.textMuted } }
], { x: 0.8, y: 1.5, w: 8, h: 3, fontSize: 20 });

// ---------------------------------------------------------
// SLIDE 3: ASPEK 1 (OVERVIEW)
// ---------------------------------------------------------
let slide3 = pres.addSlide();
slide3.background = { color: COLORS.bg };

slide3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: COLORS.primary } });
slide3.addText("Aspek 1: Perencanaan & Desain Database", {
  x: 0.5, y: 0.15, w: 9, h: 0.5, fontSize: 24, fontFace: "Arial Black", color: COLORS.white, margin: 0
});

// Card Left
slide3.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.2, h: 4, fill: { color: COLORS.white }, shadow: { type: "outer", color: "000000", blur: 5, offset: 2, opacity: 0.1 } });
slide3.addText("Syarat Penilaian: Skor 4", { x: 0.8, y: 1.5, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.primary });
slide3.addText([
  { text: "✅ ERD Lengkap & Detail", options: { bullet: true, breakLine: true } },
  { text: "✅ Normalisasi 3NF", options: { bullet: true, breakLine: true } },
  { text: "✅ Relasi Benar & Valid", options: { bullet: true, breakLine: true } },
  { text: "✅ Seeder Telah Tersedia", options: { bullet: true } }
], { x: 0.8, y: 2.2, w: 3.6, h: 2, fontSize: 18, color: COLORS.textDark, lineSpacing: 30 });

// Card Right
slide3.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.2, w: 4.2, h: 4, fill: { color: COLORS.white }, shadow: { type: "outer", color: "000000", blur: 5, offset: 2, opacity: 0.1 } });
slide3.addText("Kelebihan Skema", { x: 5.6, y: 1.5, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.secondary });
slide3.addText([
  { text: "Bebas Redundansi Data", options: { bullet: true, breakLine: true, bold: true } },
  { text: "Kategori dan Tags dipisah menjadi tabel master independen.", options: { indentLevel: 1, breakLine: true, color: COLORS.textMuted, fontSize: 14 } },
  { text: "Skalabilitas Foto Media", options: { bullet: true, breakLine: true, bold: true } },
  { text: "1 spot kuliner bebas memiliki tak terbatas foto (One-to-Many).", options: { indentLevel: 1, breakLine: true, color: COLORS.textMuted, fontSize: 14 } }
], { x: 5.6, y: 2.2, w: 3.6, h: 2.5, fontSize: 18, color: COLORS.textDark, paraSpaceAfter: 10 });

// ---------------------------------------------------------
// SLIDE 4: VISUAL ERD
// ---------------------------------------------------------
let slide4 = pres.addSlide();
slide4.background = { color: COLORS.white };

slide4.addText("Entity-Relationship Diagram (ERD)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: COLORS.primary, align: "center"
});

// Assuming the image was successfully generated as erd.png
try {
  slide4.addImage({ path: "erd.png", x: 0.5, y: 1.0, w: 9, h: 4.4, sizing: { type: "contain", w: 9, h: 4.4 } });
} catch (e) {
  slide4.addText("(Gambar ERD erd.png tidak ditemukan. Silakan tambahkan manual di sini)", { x: 0.5, y: 2, w: 9, h: 1, align: "center" });
}

// ---------------------------------------------------------
// SLIDE 5: DETAIL RELASI
// ---------------------------------------------------------
let slide5 = pres.addSlide();
slide5.background = { color: COLORS.bg };

slide5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: COLORS.primary } });
slide5.addText("Detail Relasi Database & Integritas", {
  x: 0.5, y: 0.15, w: 9, h: 0.5, fontSize: 24, fontFace: "Arial Black", color: COLORS.white, margin: 0
});

slide5.addText([
  { text: "Relasi Many-to-Many (Pivot Table)", options: { fontSize: 22, bold: true, color: COLORS.accent, breakLine: true } },
  { text: "File: database/migrations/2026_..._create_culinary_spot_tag_table.php", options: { fontSize: 14, color: COLORS.textMuted, breakLine: true } },
  { text: "Untuk menghubungkan Culinary Spots dan Tags, sistem tidak menggunakan koma-separated string, melainkan tabel pivot murni untuk menjaga standar 3NF.", options: { fontSize: 18, color: COLORS.textDark, breakLine: true } },
  
  { text: "", options: { breakLine: true } },
  { text: "Foreign Key Constraints (Integritas Data)", options: { fontSize: 22, bold: true, color: COLORS.accent, breakLine: true } },
  { text: "Sistem menggunakan onDelete('cascade') di semua relasi utama. Jika sebuah entitas dihapus, seluruh data turunan (seperti ulasan dan foto) akan otomatis terhapus tanpa meninggalkan data sampah (orphan data).", options: { fontSize: 18, color: COLORS.textDark } }
], { x: 0.8, y: 1.5, w: 8.4, h: 3.5 });

// ---------------------------------------------------------
// SLIDE 6: ASPEK 2 (OVERVIEW)
// ---------------------------------------------------------
let slide6 = pres.addSlide();
slide6.background = { color: COLORS.bg };

slide6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: COLORS.primary } });
slide6.addText("Aspek 2: Implementasi Migration & Seeder", {
  x: 0.5, y: 0.15, w: 9, h: 0.5, fontSize: 24, fontFace: "Arial Black", color: COLORS.white, margin: 0
});

slide6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9, h: 4, fill: { color: COLORS.white }, shadow: { type: "outer", color: "000000", blur: 5, offset: 2, opacity: 0.1 } });

slide6.addText([
  { text: "Migration Lengkap (16 Tabel)", options: { bullet: true, fontSize: 22, bold: true, color: COLORS.primary, breakLine: true } },
  { text: "Seluruh struktur dibangun murni dengan Schema Builder.", options: { indentLevel: 1, fontSize: 16, color: COLORS.textMuted, breakLine: true } },
  { text: "Fungsi Rollback Berjalan 100%", options: { bullet: true, fontSize: 22, bold: true, color: COLORS.primary, breakLine: true } },
  { text: "Setiap up() didampingi dropIfExists() di down(). Tidak ada tabel nyangkut saat reset.", options: { indentLevel: 1, fontSize: 16, color: COLORS.textMuted, breakLine: true } },
  { text: "Sistem Eksekusi Otomatis", options: { bullet: true, fontSize: 22, bold: true, color: COLORS.primary, breakLine: true } },
  { text: "Diatur dengan rapi di DatabaseSeeder.php sehingga dosen hanya perlu ketik satu perintah.", options: { indentLevel: 1, fontSize: 16, color: COLORS.textMuted } }
], { x: 1.0, y: 1.5, w: 8, h: 3.5, paraSpaceAfter: 15 });

// ---------------------------------------------------------
// SLIDE 7: SEEDER REALISTIS
// ---------------------------------------------------------
let slide7 = pres.addSlide();
slide7.background = { color: COLORS.secondary };

slide7.addText("🌟 POIN PLUS: Kualitas Data Seeder", {
  x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 36, fontFace: "Arial Black", color: COLORS.accent, align: "center"
});

slide7.addText([
  { text: "File: RealSemarangDataSeeder.php", options: { fontSize: 20, bold: true, color: COLORS.white, breakLine: true, align: "center" } },
  { text: "", options: { breakLine: true } },
  { text: "Sistem tidak menggunakan Faker acak (Lorem Ipsum).", options: { fontSize: 24, color: COLORS.bg, breakLine: true, align: "center" } },
  { text: "Database langsung diisi dengan data restoran dan spot kuliner asli di Semarang, lengkap dengan kategori yang sesuai, rentang harga, dan teks ulasan yang masuk akal. Ini membuat pengalaman presentasi menjadi sangat realistis.", options: { fontSize: 20, color: COLORS.white, align: "center" } }
], { x: 1, y: 2, w: 8, h: 3 });

// ---------------------------------------------------------
// SLIDE 8: ASPEK 3 (OVERVIEW)
// ---------------------------------------------------------
let slide8 = pres.addSlide();
slide8.background = { color: COLORS.bg };

slide8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: COLORS.primary } });
slide8.addText("Aspek 3: Autentikasi & Otorisasi", {
  x: 0.5, y: 0.15, w: 9, h: 0.5, fontSize: 24, fontFace: "Arial Black", color: COLORS.white, margin: 0
});

// Card Left
slide8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.2, h: 4, fill: { color: COLORS.white }, shadow: { type: "outer", color: "000000", blur: 5, offset: 2, opacity: 0.1 } });
slide8.addText("Session & Filter", { x: 0.8, y: 1.5, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.primary });
slide8.addText([
  { text: "Autentikasi Login/Logout bekerja dengan aman memanipulasi sesi pengguna.", options: { bullet: true, fontSize: 16, color: COLORS.textDark, breakLine: true } },
  { text: "Penerapan Middleware ('auth', 'guest') memblokir tamu tak diundang masuk ke dashboard privat.", options: { bullet: true, fontSize: 16, color: COLORS.textDark, breakLine: true } },
  { text: "File Kunci: routes/web.php & AuthController.php", options: { bullet: true, fontSize: 14, color: COLORS.accent, bold: true } }
], { x: 0.8, y: 2.2, w: 3.6, h: 2.5, lineSpacing: 25 });

// Card Right
slide8.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.2, w: 4.2, h: 4, fill: { color: COLORS.white }, shadow: { type: "outer", color: "000000", blur: 5, offset: 2, opacity: 0.1 } });
slide8.addText("Multi-Role Architecture", { x: 5.6, y: 1.5, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.primary });
slide8.addText([
  { text: "Tiga Hak Akses Spesifik:", options: { fontSize: 18, color: COLORS.textDark, bold: true, breakLine: true } },
  { text: "• Admin (Kelola seluruh platform)\n• Merchant (Kelola toko sendiri)\n• User (Hanya tambah ulasan/favorit)", options: { fontSize: 16, color: COLORS.textMuted, breakLine: true } },
  { text: "Proteksi Rute Berlapis:", options: { fontSize: 18, color: COLORS.textDark, bold: true, breakLine: true } },
  { text: "Menggunakan syntax middleware(['auth', 'role:admin']) pada Route Group.", options: { fontSize: 16, color: COLORS.textMuted } }
], { x: 5.6, y: 2.2, w: 3.6, h: 2.5, lineSpacing: 15 });

// ---------------------------------------------------------
// SLIDE 9: ROLE FILTER DEMO
// ---------------------------------------------------------
let slide9 = pres.addSlide();
slide9.background = { color: COLORS.bg };

slide9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.8, fill: { color: COLORS.primary } });
slide9.addText("Bagaimana Sistem Role Mencegah Penyusup?", {
  x: 0.5, y: 0.15, w: 9, h: 0.5, fontSize: 24, fontFace: "Arial Black", color: COLORS.white, margin: 0
});

slide9.addText([
  { text: "Skenario:", options: { fontSize: 20, bold: true, color: COLORS.primary, breakLine: true } },
  { text: "User biasa (pelanggan) mencoba mengetik URL /admin/dashboard secara manual di browser.", options: { fontSize: 18, color: COLORS.textDark, breakLine: true } },
  { text: "", options: { breakLine: true } },
  { text: "Respons Sistem:", options: { fontSize: 20, bold: true, color: COLORS.primary, breakLine: true } },
  { text: "1. Sistem membaca Session ID pengguna.\n2. Sistem mencocokkan kolom 'role' milik pengguna tersebut di database.\n3. Karena terdeteksi sebagai 'user' (bukan 'admin'), Middleware menolak akses mentah-mentah.\n4. Pengguna menerima error 403 Forbidden atau dikembalikan ke beranda.", options: { fontSize: 18, color: COLORS.textDark, lineSpacing: 25 } }
], { x: 1, y: 1.5, w: 8, h: 3.5 });

// ---------------------------------------------------------
// SLIDE 10: CLOSING
// ---------------------------------------------------------
let slide10 = pres.addSlide();
slide10.background = { color: COLORS.primary };

slide10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.5, w: 10, h: 1.125, fill: { color: COLORS.secondary } });

slide10.addText("TERIMA KASIH", {
  x: 0.5, y: 1.5, w: 9, h: 1, 
  fontSize: 60, fontFace: "Arial Black", color: COLORS.white, bold: true, align: "center"
});

slide10.addText("Silakan ajukan pertanyaan terkait arsitektur dan sistem.", {
  x: 0.5, y: 2.8, w: 9, h: 1, 
  fontSize: 22, fontFace: "Arial", color: COLORS.accent, align: "center", italic: true
});

pres.writeFile({ fileName: "Presentasi_Lengkap_PWL.pptx" }).then(() => {
  console.log("PPTX created successfully!");
});
