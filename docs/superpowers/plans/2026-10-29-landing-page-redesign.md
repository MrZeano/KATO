# Editorial Landing Page & Interactive 3D Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp Kato's landing page into a luxury editorial showcase with pure black aesthetic, 3D perspective card carousel, AI model ecosystem badges, and an interactive "Why Prompt Matters" comparison widget.

**Architecture:** Laravel Inertia controller supplies paginated feed items along with top curated featured posts. React frontend renders a pure-black theme with editorial serif typography (Newsreader/Figtree), interactive 3D perspective transforms with CSS `preserve-3d`, interactive state toggles, and unified filterable explore feed.

**Tech Stack:** Laravel 13, Inertia.js (React 18 + TypeScript), Tailwind CSS v3, Bunny Fonts (Newsreader Serif + Figtree Sans), Lucide React icons.

**Spec:** User request with visual reference (`Voyager2` style: pure `#000000` black, crisp white serif typography, zero gradient texts, 3D curved perspective cards, interactive transitions).

---

## Global Constraints

- Background must be deep pure black (`#000000` / `bg-black`), eliminating slate/indigo gradient themes.
- Strict typography rule: **No text with color gradients** (`bg-clip-text text-transparent` is prohibited for text). Headings must be clean, crisp white (`text-white`) using elegant serif typography (`font-serif`).
- High-contrast accessibility and smooth CSS transitions (`transition-all duration-500 ease-out`).
- All existing feed functionality (search query `q`, model filter `model`, pagination) must remain 100% operational.
- Type safety: TypeScript types in `resources/js/types/` must strictly define all props and component interfaces.

---

## Review Focus

1. **Empty database state**: When no posts exist in SQLite, the 3D carousel and prompt comparison must render elegant fallback spotlight items without throwing runtime null errors.
2. **Mobile responsiveness**: The 3D curved perspective carousel must degrade gracefully on small screens (`< 640px`) to a smooth horizontal swipe or stacked perspective view without horizontal document overflow (`overflow-x-hidden`).
3. **Copy prompt interaction**: Copying prompt in cards or the comparison widget must provide clear visual feedback (check icon / tooltip) without navigating or bubbling click events.
4. **Model filter persistence**: Clicking an AI model badge in the hero strip should smoothly update the URL query and scroll to the Explore grid.
5. **Interactive comparison toggle**: Switching between "Vague Prompt" and "Engineered Prompt" must be fluid with cross-fading image preview and synchronized technical parameter badges.

---

## Task Breakdown

### Task 1: Typography & Theme Setup (Serif Font & Pure Black Theme)

**Files:**
- Modify: `resources/views/app.blade.php:9-13`
- Modify: `tailwind.config.js:13-20`
- Modify: `resources/js/Layouts/AppLayout.tsx:16-175`

**Interfaces:**
- Consumes: Bunny Fonts CDN (`Newsreader` serif + `Figtree` sans)
- Produces: Tailwind `font-serif` class mapping to `Newsreader, serif`, and pure black navbar/footer layout

- [ ] **Step 1: Update `resources/views/app.blade.php` to include Newsreader serif font**
  Add `newsreader:400,400i,600,700` font import alongside `figtree`.

- [ ] **Step 2: Update `tailwind.config.js` to register `font-serif`**
  Extend `fontFamily.serif` with `['Newsreader', ...defaultTheme.fontFamily.serif]`.

- [ ] **Step 3: Update `resources/js/Layouts/AppLayout.tsx` to pure black minimalist aesthetic**
  - Replace `bg-slate-950` with `bg-black`.
  - Replace rainbow gradient logo with minimalist editorial logo: `KATO —` in serif font with subtle subtitle.
  - Remove all gradient text and replace borders with `border-neutral-900`.
  - Refine desktop & mobile navigation links to clean white/neutral styling.

- [ ] **Step 4: Verify frontend build passes**
  Run: `npm run build`
  Expected: Successful compilation without TypeScript or CSS errors.

- [ ] **Step 5: Commit changes**
  ```bash
  git add resources/views/app.blade.php tailwind.config.js resources/js/Layouts/AppLayout.tsx
  git commit -m "style: setup newsreader serif font and pure black editorial layout"
  ```

---

### Task 2: Controller & Data Layer (Featured Spotlight Posts)

**Files:**
- Modify: `app/Http/Controllers/PostController.php:16-48`
- Modify: `resources/js/types/index.d.ts` (or page props definition)

**Interfaces:**
- Produces: `featuredPosts: Post[]` passed as an Inertia prop to `Posts/Index`
- Consumes: Eloquent `Post::approved()->with('user:id,name')->latest()->take(5)->get()`

- [ ] **Step 1: Update `PostController@index` to query featured posts**
  Fetch up to 5 approved posts for the 3D perspective hero spotlight. Pass `featuredPosts` into `Inertia::render('Posts/Index', [...])`.

- [ ] **Step 2: Update TypeScript definitions for `IndexProps` in `resources/js/Pages/Posts/Index.tsx`**
  Add `featuredPosts: Post[];` to `IndexProps`.

- [ ] **Step 3: Verify route and backend response**
  Run: `php artisan route:list --name=home`
  Expected: Route `GET /` active and mapped to `PostController@index`.

- [ ] **Step 4: Commit changes**
  ```bash
  git add app/Http/Controllers/PostController.php resources/js/Pages/Posts/Index.tsx
  git commit -m "feat(backend): provide featured posts data for hero carousel"
  ```

---

### Task 3: 3D Perspective Curved Carousel Component

**Files:**
- Create: `resources/js/Components/HeroCarousel.tsx`
- Consumes: `posts: Post[]`
- Produces: Interactive 3D perspective coverflow/carousel with click-to-center, auto-cycle, smooth card tilt (`rotateY`), and serif caption overlays.

- [ ] **Step 1: Implement `HeroCarousel.tsx`**
  - Maintain active index state (`activeIndex`).
  - Calculate 3D transformation per card relative to active index:
    - Offset `0` (Center): `transform: rotateY(0deg) scale(1.05) translateZ(40px)`, full opacity, active border.
    - Offset `-1` (Left 1): `transform: rotateY(18deg) scale(0.92) translateX(-180px) translateZ(-20px)`, opacity `0.85`.
    - Offset `+1` (Right 1): `transform: rotateY(-18deg) scale(0.92) translateX(180px) translateZ(-20px)`, opacity `0.85`.
    - Offset `<= -2` (Far Left): `transform: rotateY(32deg) scale(0.8) translateX(-320px) translateZ(-60px)`, opacity `0.5`.
    - Offset `>= +2` (Far Right): `transform: rotateY(-32deg) scale(0.8) translateX(320px) translateZ(-60px)`, opacity `0.5`.
  - Provide fallback curated spotlight items if database has fewer than 5 posts.
  - Overlay editorial serif title on the bottom of each card with subtle dark gradient vignette.
  - Interactive click on any card makes it the active centered card.
  - Navigation controls (clean minimal previous/next buttons & indicator dots).

- [ ] **Step 2: Verify component builds cleanly**
  Run: `npm run build`
  Expected: No TypeScript or bundling errors.

- [ ] **Step 3: Commit changes**
  ```bash
  git add resources/js/Components/HeroCarousel.tsx
  git commit -m "feat(ui): create 3d perspective curved carousel component"
  ```

---

### Task 4: AI Models Strip & "Why Prompt Matters" Interactive Comparison

**Files:**
- Create: `resources/js/Components/AiModelsSection.tsx`
- Create: `resources/js/Components/PromptComparisonSection.tsx`

**Interfaces:**
- `AiModelsSection`:
  - Props: `selectedModel: string`, `onSelectModel: (model: string) => void`
  - Renders: Minimalist monochrome model cards (FLUX.1, Midjourney v6, SDXL, DALL-E 3) with model badges, description, and filter action.
- `PromptComparisonSection`:
  - Interactive state: `mode: 'vague' | 'engineered'` (or interactive slider).
  - Renders: Side-by-side comparison illustrating why prompt engineering is the key differentiator in generative AI. Shows image diff, parameter breakdown (Steps, CFG, Sampler, Aspect Ratio), and prompt text with copy button.

- [ ] **Step 1: Implement `AiModelsSection.tsx`**
  Clean, high-contrast badges for each leading AI model with clean white accents and subtle hover states.

- [ ] **Step 2: Implement `PromptComparisonSection.tsx`**
  - Interactive toggle button between "Simple Prompt" and "Engineered Prompt".
  - Shows visual transformation:
    - *Simple Prompt*: "A futuristic city" (generic, flat lighting, 15 steps, default cfg).
    - *Engineered Prompt*: "Cinematic 35mm photograph of Neo-Tokyo metropolis in heavy rain, holographic billboards reflecting on wet asphalt, volumetric cyan and magenta neon fog, octane render, photorealistic, 8k, f/1.4, 50 steps, CFG 7.5".
  - Callouts explaining *Keywords*, *Lighting & Atmosphere*, *Composition*, and *Technical Parameters*.

- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: Clean build with 0 errors.

- [ ] **Step 4: Commit changes**
  ```bash
  git add resources/js/Components/AiModelsSection.tsx resources/js/Components/PromptComparisonSection.tsx
  git commit -m "feat(ui): add ai models strip and interactive prompt comparison sections"
  ```

---

### Task 5: Page Assembly, Refined Feed Grid & Final Polish

**Files:**
- Modify: `resources/js/Pages/Posts/Index.tsx`
- Modify: `resources/js/Components/PostCard.tsx`

**Interfaces:**
- Consumes: `HeroCarousel`, `AiModelsSection`, `PromptComparisonSection`, `PostCard`
- Produces: Complete, cohesive landing page matching the user's reference image with zero gradient texts and pure `#000000` aesthetic.

- [ ] **Step 1: Update `PostCard.tsx` to match pure black editorial style**
  - Replace slate styling with pure black (`bg-neutral-950 border-neutral-800/80 hover:border-neutral-500`).
  - Use clean white serif typography for title and clean badges.
  - Retain copy prompt button and user attribution.

- [ ] **Step 2: Assemble `resources/js/Pages/Posts/Index.tsx`**
  - **Header Section**: Editorial tagline "KATO ARCHIVE", grand serif headline "Selected and popular posts on the social right now" (no gradient text!).
  - **Hero Carousel Section**: Render `HeroCarousel` with `featuredPosts`.
  - **AI Models Strip**: Render `AiModelsSection` with quick-filter callbacks.
  - **Why Prompt Section**: Render `PromptComparisonSection`.
  - **Explore Feed Section**: Minimalist search input, active filters, and the responsive `posts.data` grid with pagination.

- [ ] **Step 3: Verify end-to-end build**
  Run: `npm run build`
  Expected: Build succeeds cleanly.

- [ ] **Step 4: Verify in browser / server response**
  Test request to `http://127.0.0.1:8000/` or curl verification to ensure HTTP 200 OK and valid Inertia JSON props.

- [ ] **Step 5: Commit changes**
  ```bash
  git add resources/js/Pages/Posts/Index.tsx resources/js/Components/PostCard.tsx
  git commit -m "feat(landing): complete editorial landing page redesign with 3d carousel and comparison widget"
  ```

