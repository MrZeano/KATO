# Homepage Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengoptimasi performa halaman utama Kato dengan memangkas durasi IntroSplash menjadi tepat 2.0 detik, mengurangi frekuensi re-render React (dari 50fps ke 25fps), dan mengganti filter SVG Gaussian Blur berat di OrreryBackground dengan hardware-accelerated CSS/vector bloom tanpa mengubah estetika visual sedikit pun.

**Architecture:** 
- Penyesuaian timing state machine pada `IntroSplash.tsx` (duration = 2000ms, interval = 40ms, split duration = 800ms) dan sinkronisasi `AppLayout.tsx` navbar delay.
- Eliminasi rasterization bottleneck pada `OrreryBackground.tsx` dengan mempromosikan layer ke GPU compositor (`will-change: transform`, `transform-gpu`) dan mengganti CPU-bound `<feGaussianBlur>` dengan multi-stroke halo & GPU drop-shadow.
- Peningkatan pipeline rendering gambar di `HeroCarousel.tsx` dengan `decoding="async"`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, SVG Graphics, Inertia.js.

---

## Global Constraints

- Estetika visual (warna, font, bentuk jam mekanikal Orrery, efek laser tracer, teks Zajno) harus 100% identik dengan tampilan saat ini.
- IntroSplash tetap muncul dan berjalan dengan transisi mulus selama 2.0 detik sebelum tirai terbuka.
- Tidak menambahkan dependensi pihak ketiga baru (tanpa package npm baru).

---

## Review Focus

- Angka persentase 00% - 100% pada IntroSplash tetap berjalan mulus dan mencapai 100% tepat pada detik ke-2.0.
- Transisi tirai pembuka (curtain split) dan kemunculan Navbar di `AppLayout.tsx` terjadi secara serentak tanpa saling menabrak atau jeda canggung.
- OrreryBackground tetap menampilkan cincin astronomi berputar, jarum berputar, denyut radial, dan berkas sinar putih melingkar tanpa lag/frame drop.
- Hero Carousel 3D swipe dan klik tetap interaktif setelah animasi intro tuntas.

---

### Task 1: Optimasi Durasi dan State Re-render IntroSplash & Navbar Delay

**Files:**
- Modify: `resources/js/Components/IntroSplash.tsx:26-65`
- Modify: `resources/js/Layouts/AppLayout.tsx:18-24`

**Interfaces:**
- `IntroSplashProps`: `{ onRevealStart?: () => void; onComplete?: () => void; }`

- [ ] **Step 1: Modifikasi durasi & interval timer di `IntroSplash.tsx`**
  - Ubah `duration = 2000` (dari 3000ms).
  - Ubah interval timer dari `20ms` (50 FPS) ke `40ms` (~25 FPS) untuk memangkas separuh beban re-render di JavaScript Main Thread.
  - Ubah pause di 100% (`splitTimer`) dari 350ms menjadi 200ms.
  - Ubah unmount timer (`doneTimer`) dari 1400ms menjadi 900ms.
  - Perbarui durasi transisi CSS tirai panel dari `duration-[950ms]` menjadi `duration-[800ms]`.

- [ ] **Step 2: Sesuaikan delay navbar di `AppLayout.tsx`**
  - Ubah timer delay `setNavVisible` dari `2100ms` menjadi `1500ms` agar navbar muncul tepat saat tirai splash mulai terbelah.

- [ ] **Step 3: Verifikasi build TypeScript & Vite**
  Run: `npm run build`
  Expected: Build berhasil tanpa error TypeScript.

---

### Task 2: Optimasi Render OrreryBackground (Eliminasi SVG Blur Bottleneck)

**Files:**
- Modify: `resources/js/Components/OrreryBackground.tsx:66-90, 260-310`

**Interfaces:**
- `OrreryBackgroundProps`: `{ isRevealed?: boolean; }`

- [ ] **Step 1: Ganti `<feGaussianBlur>` di SVG dengan Hardware-Accelerated Glow**
  - Ganti filter `<feGaussianBlur>` yang memicu re-rasterization berulang di CPU/GPU dengan CSS drop-shadow GPU (`filter: drop-shadow(0 0 4px rgba(255,255,255,0.8))`).
  - Untuk berkas sinar outer (`orrery-beam-outer`), gunakan teknik double-stroke: stroke dasar semi-transparan yang lebih tebal (`strokeWidth="5"`, `opacity="0.3"`) di balik stroke putih tajam (`strokeWidth="2"`), menghasilkan efek neon menyala identik dengan konsumsi GPU mendekati 0%.
  - Tambahkan CSS property `contain: paint;` dan `will-change: transform` pada elemen SVG agar terisolasi dalam dedicated GPU compositor layer.

- [ ] **Step 2: Verifikasi build & integrasi**
  Run: `npm run build`
  Expected: Berhasil dikompilasi tanpa error.

---

### Task 3: Peningkatan Pipeline Rendering di HeroCarousel

**Files:**
- Modify: `resources/js/Components/HeroCarousel.tsx:398-404`

- [ ] **Step 1: Tambahkan asynchronous image decoding**
  - Tambahkan atribut `decoding="async"` pada elemen `<img>` kartu carousel agar penguraian citra dilakukan di background thread browser dan tidak menghambat UI thread saat animasi intro berjalan.

- [ ] **Step 2: Verifikasi akhir build aplikasi**
  Run: `npm run build`
  Expected: Bundle ter-generate sukses dan bebas peringatan error.

