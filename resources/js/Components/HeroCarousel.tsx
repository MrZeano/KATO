import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Copy, Check, Sparkles } from 'lucide-react';
import SplitTextReveal from '@/Components/SplitTextReveal';
import OrreryBackground from '@/Components/OrreryBackground';
import { Post } from '@/types';

interface HeroCarouselProps {
    posts?: Post[];
    isRevealed?: boolean;
}

interface SpotlightItem {
    id: number | string;
    title: string;
    ai_model: string;
    image_url: string;
    prompt: string;
    author: string;
    isFallback?: boolean;
}

// Fallback curated artworks if database has fewer than 5 approved posts
const FALLBACK_SPOTLIGHTS: SpotlightItem[] = [
    {
        id: 'fb-1',
        title: 'Selected projects from the last month',
        ai_model: 'FLUX.1',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
        prompt: 'Volumetric red dynamic paint swirls, high-contrast chiaroscuro, cinematic liquid macro texture, 8k octane render, studio lighting',
        author: 'Aria Vance',
        isFallback: true,
    },
    {
        id: 'fb-2',
        title: 'Otherworldly places located on Earth',
        ai_model: 'Midjourney v6',
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
        prompt: 'Aerial geological abstract marble landscape with veins of liquid gold and turquoise pools, National Geographic editorial photography, 35mm f/2.8',
        author: 'Ren Tanaka',
        isFallback: true,
    },
    {
        id: 'fb-3',
        title: 'Visualizing distorted sound mixes',
        ai_model: 'SDXL',
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=900&q=80',
        prompt: 'Kinetic light dispersion particles exploding in pitch black vacuum, deep amber and cerulean cosmic nebula, raymarched volumetric shaders',
        author: 'Elena Rostova',
        isFallback: true,
    },
    {
        id: 'fb-4',
        title: 'Patient and calm inspiration',
        ai_model: 'FLUX.1',
        image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80',
        prompt: 'Minimalist pastel fluid pigments merging, silk cloth floating underwater, ethereal soft morning light, hyper-detailed fine art canvas',
        author: 'Lucas Silva',
        isFallback: true,
    },
    {
        id: 'fb-5',
        title: 'Getting that film look in the post',
        ai_model: 'Midjourney v6',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
        prompt: 'Long exposure fiber optic neon light traces through foggy midnight downtown alley, Kodak Portra 400 grain, vintage anamorphic bokeh',
        author: 'David Chen',
        isFallback: true,
    },
];

export default function HeroCarousel({ posts = [], isRevealed = true }: HeroCarouselProps) {
    // Transform incoming posts or merge with fallbacks to always guarantee 5 rich cards
    const items: SpotlightItem[] = posts.length >= 5
        ? posts.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            ai_model: p.ai_model,
            image_url: p.image_path || p.thumbnail_path,
            prompt: p.prompt,
            author: p.user?.name || 'Kato Creator',
            isFallback: false,
        }))
        : [
            ...posts.map((p) => ({
                id: p.id,
                title: p.title,
                ai_model: p.ai_model,
                image_url: p.image_path || p.thumbnail_path,
                prompt: p.prompt,
                author: p.user?.name || 'Kato Creator',
                isFallback: false,
            })),
            ...FALLBACK_SPOTLIGHTS.slice(posts.length),
        ];

    const [activeIndex, setActiveIndex] = useState(2); // Center card (index 2 of 0..4)
    const [copiedId, setCopiedId] = useState<string | number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const total = items.length;

    // Entrance Animation Sequence: 'hidden' -> 'stacked' (1 kartu naik) -> 'spread' (mekar ke samping)
    const [cardPhase, setCardPhase] = useState<'hidden' | 'stacked' | 'spread'>('hidden');
    const [hasSpreadCompleted, setHasSpreadCompleted] = useState(false);

    useEffect(() => {
        if (!isRevealed) {
            setCardPhase('hidden');
            setHasSpreadCompleted(false);
            return;
        }

        // Tahap 1: Naik dari bawah panggung sebagai 1 kartu tunggal di tengah
        const riseTimer = setTimeout(() => {
            setCardPhase('stacked');
        }, 400);

        // Tahap 2: Mekar / mengipas menyebar ke posisi kurva 3D (fan-out split)
        const spreadTimer = setTimeout(() => {
            setCardPhase('spread');
        }, 1100);

        // Tahap 3: Tandai sequence entrance tuntas (siap untuk navigasi reguler)
        const completeTimer = setTimeout(() => {
            setHasSpreadCompleted(true);
        }, 1950);

        return () => {
            clearTimeout(riseTimer);
            clearTimeout(spreadTimer);
            clearTimeout(completeTimer);
        };
    }, [isRevealed]);

    // Optional subtle auto-rotation when not hovered and entrance is completed
    useEffect(() => {
        if (isHovered || total === 0 || !hasSpreadCompleted) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % total);
        }, 6000);
        return () => clearInterval(timer);
    }, [isHovered, total, hasSpreadCompleted]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % total);
    };

    // =========================================================================
    // DRAG & SWIPE GESTURE ENGINE (Mouse Drag & Touch Swipe)
    // =========================================================================
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef<number | null>(null);
    const hasMoved = useRef<boolean>(false);

    const onPointerDown = (clientX: number) => {
        if (!hasSpreadCompleted) return;
        dragStartX.current = clientX;
        hasMoved.current = false;
        setIsDragging(true);
    };

    const onPointerMove = (clientX: number) => {
        if (dragStartX.current === null) return;
        const delta = clientX - dragStartX.current;
        if (Math.abs(delta) > 8) {
            hasMoved.current = true;
        }
        // Memberikan sedikit resistensi fisik lembut (damping factor 0.38)
        setDragOffset(delta * 0.38);
    };

    const onPointerUp = () => {
        if (dragStartX.current !== null) {
            // Threshold geser (jika digeser lebih dari 28px, ganti slide)
            if (dragOffset < -28) {
                handleNext();
            } else if (dragOffset > 28) {
                handlePrev();
            }
        }
        dragStartX.current = null;
        setDragOffset(0);
        setIsDragging(false);
    };

    const handleCardClick = (index: number) => {
        // Jika gestur yang dilakukan adalah drag/geser, jangan picu aksi klik
        if (hasMoved.current) {
            hasMoved.current = false;
            return;
        }

        // Klik kartu samping -> Geser kartu tersebut ke posisi tengah
        setActiveIndex(index);
    };

    const handleCopy = (e: React.MouseEvent, item: SpotlightItem) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(item.prompt);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Calculate circular distance / offset relative to active card
    const getOffset = (index: number) => {
        let diff = index - activeIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    return (
        <section
            className="relative w-full py-12 md:py-16 overflow-hidden select-none bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Astronomical Orrery / Mechanical Clock Background */}
            <OrreryBackground isRevealed={isRevealed} />

            {/* Header & Tagline (Voyager2 editorial style with Split Text Motion) */}
            <div className="relative z-10 max-w-4xl mx-auto text-center px-4 mb-10 md:mb-14">
                {/* 1. Badge Top Tag */}
                <SplitTextReveal
                    text="Editorial Curated Showcase"
                    trigger={isRevealed}
                    delay={180}
                    stagger={30}
                    duration={700}
                    as="p"
                    className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-4"
                />

                {/* 2. Main Hero Heading */}
                <SplitTextReveal
                    text="Selected and popular posts on Kato right now"
                    trigger={isRevealed}
                    delay={320}
                    stagger={35}
                    duration={850}
                    as="h1"
                    subtleRotate={true}
                    className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-white tracking-tight leading-[1.15] max-w-2xl mx-auto"
                />

                {/* 3. Subtitle / Description Paragraph */}
                <SplitTextReveal
                    text="Explore meticulously crafted generative artwork paired with verified prompts, seeds, and technical parameters."
                    trigger={isRevealed}
                    delay={650}
                    stagger={18}
                    duration={750}
                    as="p"
                    className="mt-4 text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed"
                />
            </div>

            {/* 3D Curved Perspective Stage Container (Mendukung Mouse Drag & Touch Swipe) */}
            <div
                onMouseDown={(e) => onPointerDown(e.clientX)}
                onMouseMove={(e) => onPointerMove(e.clientX)}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
                onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
                onTouchEnd={onPointerUp}
                className={`relative z-10 h-[480px] sm:h-[540px] md:h-[600px] w-full max-w-7xl mx-auto flex items-center justify-center [perspective:1400px] select-none ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            >
                <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
                    {items.map((item, index) => {
                        const offset = getOffset(index);
                        const isCenter = offset === 0;
                        const isVisible = Math.abs(offset) <= 2;

                        if (!isVisible) return null;

                        // Calculate dynamic 3D curvature:
                        // Negative offset = Left cards tilted inwards (positive rotateY)
                        // Positive offset = Right cards tilted inwards (negative rotateY)
                        let rotateY = 0;
                        let translateX = 0;
                        let translateZ = 0;
                        let scale = 1;
                        let zIndex = 30;
                        let opacity = 1;

                        if (offset === 0) {
                            rotateY = 0;
                            translateX = 0;
                            translateZ = 60;
                            scale = 1.05;
                            zIndex = 50;
                            opacity = 1;
                        } else if (offset === -1) {
                            rotateY = 18;
                            translateX = -240;
                            translateZ = -20;
                            scale = 0.92;
                            zIndex = 40;
                            opacity = 0.88;
                        } else if (offset === 1) {
                            rotateY = -18;
                            translateX = 240;
                            translateZ = -20;
                            scale = 0.92;
                            zIndex = 40;
                            opacity = 0.88;
                        } else if (offset === -2) {
                            rotateY = 32;
                            translateX = -440;
                            translateZ = -100;
                            scale = 0.8;
                            zIndex = 20;
                            opacity = 0.55;
                        } else if (offset === 2) {
                            rotateY = -32;
                            translateX = 440;
                            translateZ = -100;
                            scale = 0.8;
                            zIndex = 20;
                            opacity = 0.55;
                        }

                        // Dynamic 3D transform during entrance sequence vs normal carousel mode
                        let curTranslateX = translateX;
                        let curTranslateY = 0;
                        let curTranslateZ = translateZ;
                        let curRotateY = rotateY;
                        let curScale = scale;
                        let curOpacity = opacity;

                        if (cardPhase === 'hidden') {
                            curTranslateX = 0;
                            curTranslateY = 150;
                            curTranslateZ = 0;
                            curRotateY = 0;
                            curScale = 0.92;
                            curOpacity = 0;
                        } else if (cardPhase === 'stacked') {
                            curTranslateX = 0;
                            curTranslateY = 0;
                            curTranslateZ = isCenter ? 60 : 0;
                            curRotateY = 0;
                            curScale = isCenter ? 1.05 : 0.95;
                            // 1 Kartu tengah tampil utuh, kartu samping bersembunyi di belakangnya
                            curOpacity = isCenter ? 1 : 0;
                        } else {
                            // 'spread' (fan-out split) + respon real-time terhadap drag mouse/touch
                            curTranslateX = translateX + dragOffset;
                            curTranslateY = 0;
                            curTranslateZ = translateZ;
                            curRotateY = rotateY + dragOffset * 0.035;
                            curScale = scale;
                            curOpacity = opacity;
                        }

                        let transitionStyle = isDragging
                            ? 'none' // Nol latency saat jari/mouse sedang menggeser
                            : 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease, box-shadow 600ms ease';

                        if (!hasSpreadCompleted) {
                            if (cardPhase === 'hidden' || cardPhase === 'stacked') {
                                transitionStyle = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease';
                            } else if (cardPhase === 'spread') {
                                // Durasi saat kartu mekar mengipas menyebar ke samping
                                transitionStyle = 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 700ms ease, box-shadow 600ms ease';
                            }
                        }

                        // Responsive adjustment for smaller mobile screens
                        const style3D: React.CSSProperties = {
                            transform: `translateY(${curTranslateY}px) translateX(${curTranslateX}px) translateZ(${curTranslateZ}px) rotateY(${curRotateY}deg) scale(${curScale})`,
                            zIndex,
                            opacity: curOpacity,
                            transition: transitionStyle,
                        };

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleCardClick(index)}
                                style={style3D}
                                className={`absolute w-[240px] sm:w-[280px] md:w-[320px] h-[380px] sm:h-[440px] md:h-[500px] rounded-[28px] overflow-hidden bg-neutral-900 border transition-all duration-500 ease-out group shadow-2xl cursor-pointer ${
                                    isCenter
                                        ? 'border-neutral-500/80 shadow-white/5 ring-1 ring-white/10'
                                        : 'border-neutral-800/80 hover:border-neutral-600'
                                }`}
                            >
                                {/* Background Image */}
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                                    loading="lazy"
                                />

                                {/* Top Badge & Action Icons */}
                                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/15">
                                        <Sparkles className="w-3 h-3 text-neutral-300" />
                                        {item.ai_model}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={(e) => handleCopy(e, item)}
                                            title="Salin Prompt"
                                            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-neutral-300 hover:text-white hover:bg-neutral-800 border border-white/15 transition-all shadow-md active:scale-90"
                                        >
                                            {copiedId === item.id ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Dark Gradient Vignette Overlay (Voyager2 Style) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />

                                {/* Bottom Typography Overlay - Editorial Serif */}
                                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                                    <h3 className="font-serif text-white text-lg sm:text-xl font-normal leading-snug line-clamp-2 drop-shadow-sm group-hover:text-neutral-100">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-[11px] font-mono text-neutral-400 line-clamp-2 leading-relaxed">
                                        "{item.prompt}"
                                    </p>

                                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                                        <span>by {item.author}</span>
                                        {!item.isFallback && (
                                            <Link
                                                href={route('posts.show', item.id)}
                                                className="text-white hover:underline text-[10px] uppercase tracking-wider font-semibold"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Inspect &rarr;
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Left / Right Chevron Navigation Controls */}
                <button
                    onClick={handlePrev}
                    aria-label="Previous artwork"
                    className={`absolute left-4 sm:left-8 z-40 p-3 rounded-full bg-black/70 backdrop-blur-md text-white border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-700 active:scale-95 shadow-lg ${
                        cardPhase === 'spread'
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    aria-label="Next artwork"
                    className={`absolute right-4 sm:right-8 z-40 p-3 rounded-full bg-black/70 backdrop-blur-md text-white border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all duration-700 active:scale-95 shadow-lg ${
                        cardPhase === 'spread'
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Indicator Dots */}
            <div
                className={`relative z-10 flex items-center justify-center gap-2 mt-4 transition-all duration-700 ${
                    cardPhase === 'spread'
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                }`}
            >
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === activeIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}

