# AGENTS.MD: Kato - AI Image Sharing & Prompt Showcase

## 1. Project Overview & Architecture
Platform showcase dan sharing gambar AI-generated dengan sistem kurasi/approval admin.
- **Project Name**: Kato
- **Paradigma**: Monolith modern (Inertia.js bridge, single codebase, single process).
- **Backend**: Laravel 13.x (PHP 8.5+)
- **Frontend**: React 18+/19 via Inertia.js (SPA behavior, zero REST boilerplate).
- **Styling**: Tailwind CSS.
- **Database**: SQLite (default / local development), MySQL/PostgreSQL (production ready).
- **Asset Processing**: Intervention Image v3 (auto-generate thumbnail + WebP optimization).

---

## 2. Core Constraints & Conventions

### Backend (Laravel)
- **Routing**: Seluruh routing di `routes/web.php`. Jangan buat API routes terpisah untuk web app.
- **Controller Action**: Return data menggunakan `Inertia::render('PageName', [...])`.
- **Authorization**: Pakai Laravel Policy & Gate untuk membatasi aksi role `admin` vs `user`.
- **File Handling**: Upload gambar wajib menghasilkan 2 file:
  1. `thumbnail` (resolusi sedang, WebP) untuk grid list.
  2. `original/optimized` untuk detail view.
- **Database Transactions**: Gunakan `DB::transaction()` untuk operasi write yang melibatkan file upload dan record database.

### Frontend (React + Inertia)
- **Komponen**: Functional components dengan Tailwind CSS murni (hindari library CSS runtime-heavy).
- **Form Handling**: Gunakan hook bawaan Inertia `useForm()` dari `@inertiajs/react` untuk state form, upload progress, dan validasi error bawaan Laravel.
- **Navigasi**: Gunakan `<Link href="...">` dari `@inertiajs/react` (hindari tag `<a href="...">` untuk navigasi internal).
- **Code Style**:
  - Simpan pages di `resources/js/Pages/`
  - Simpan komponen reusable di `resources/js/Components/`
  - Simpan layout di `resources/js/Layouts/`

---

## 3. Database Schema Specification

### `users`
- `id` (bigint, pk)
- `name` (string)
- `email` (string, unique)
- `password` (string)
- `role` (enum: `user`, `admin`, default: `user`)
- `timestamps`

### `posts`
- `id` (bigint, pk)
- `user_id` (foreignId -> users.id, cascadeOnDelete)
- `title` (string)
- `image_path` (string)
- `thumbnail_path` (string)
- `prompt` (text)
- `negative_prompt` (text, nullable)
- `ai_model` (string) - Contoh: "FLUX.1", "Midjourney v6", "SDXL"
- `seed` (string, nullable)
- `cfg_scale` (decimal: 4,1, nullable)
- `steps` (integer, nullable)
- `sampler` (string, nullable)
- `status` (enum: `pending`, `approved`, `rejected`, default: `pending`)
- `rejection_reason` (text, nullable)
- `timestamps`

### Indexes
- `posts(status, created_at)`: Optimasi query feed publik.
- `posts(user_id, status)`: Optimasi halaman profile / dashboard pribadi.

---

## 4. Key Workflows & Business Logic

### A. Upload & Processing (User)
1. User mengisi form: file gambar + metadata prompt.
2. Form submit via `useForm()` Inertia (multipart/form-data).
3. Backend validasi (MIME type: jpg, png, webp; Max size: 10MB).
4. Backend menyimpan gambar, membuat thumbnail via Intervention Image.
5. Record tersimpan dengan `status = pending`.
6. Flash message: "Gambar berhasil diunggah dan menunggu moderasi admin."

### B. Public Feed (Guest/User)
1. Query hanya menampilkan record dengan `status = approved`.
2. Dukungan filter query: `?model=FLUX.1` dan pencarian keyword `?q=cyberpunk`.
3. Gunakan Laravel cursor-based pagination atau standard pagination (15-20 item per page).

### C. Moderasi (Admin Dashboard)
1. Route group dengan middleware auth + check role admin.
2. List record `status = pending`.
3. Action POST/PATCH:
   - `approve`: Update status -> `approved`.
   - `reject`: Update status -> `rejected`, simpan `rejection_reason`.

---

## 5. Implementation Roadmap for Agent

1. **Phase 1: Project Setup**
   - Install Laravel Breeze / Inertia React stack.
   - Setup Tailwind CSS & dependencies.
2. **Phase 2: Database & Models**
   - Migrasi tabel `posts` & update kolom `role` pada `users`.
   - Setup Model `Post`, relasi `User`, factory, dan seeder contoh data.
3. **Phase 3: Image Upload & Storage Logic**
   - Pasang package `intervention/image`.
   - Setup logic upload & pembuatan thumbnail WebP otomatis.
4. **Phase 4: Public Views (Explore & Detail)**
   - Buat Page `Posts/Index` (Grid explore + filter).
   - Buat Page `Posts/Show` (Detail view + metadata + tombol copy prompt).
5. **Phase 5: User Upload & Profile**
   - Buat Page `Posts/Create` (Form upload image & metadata).
   - Buat Page `Dashboard` (List kiriman milik user & status approval).
6. **Phase 6: Admin Curation System**
   - Setup Authorization (Policy / Gate / Middleware role admin).
   - Buat Page `Admin/Submissions` (Tinjau antrean, approve / reject).
