import { useState, useEffect, useRef } from 'react';

interface IntroSplashProps {
    onRevealStart?: () => void;
    onComplete?: () => void;
}

export default function IntroSplash({ onRevealStart, onComplete }: IntroSplashProps) {
    const [count, setCount] = useState(0);
    const [phase, setPhase] = useState<'counting' | 'ready' | 'splitting' | 'done'>('counting');

    // Gunakan ref agar perubahan fungsi callback dari parent TIDAK memicu re-render ulang useEffect
    const onRevealStartRef = useRef(onRevealStart);
    onRevealStartRef.current = onRevealStart;

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // Flag ref agar animasi dijamin HANYA berjalan 1 kali (anti double-run / StrictMode proof)
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        // 1. Counter Animation: 0 -> 100% with progressive easing
        const startTime = Date.now();
        const duration = 3000; // 1.4 detik total waktu counting

        let splitTimer: ReturnType<typeof setTimeout>;
        let doneTimer: ReturnType<typeof setTimeout>;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing curve: smooth start, acceleration, ease-out near end
            const easeProgress = Math.floor(Math.pow(progress, 0.85) * 100);
            setCount(easeProgress);

            if (progress >= 1) {
                clearInterval(interval);
                setCount(100);
                setPhase('ready');

                // 2. Pause sebentar di 100% (Zajno aesthetic pause), lalu picu curtain split
                splitTimer = setTimeout(() => {
                    setPhase('splitting');
                    onRevealStartRef.current?.();
                }, 350);

                // 3. Unmount dari DOM setelah animasi tirai tuntas
                doneTimer = setTimeout(() => {
                    setPhase('done');
                    onCompleteRef.current?.();
                }, 1400);
            }
        }, 20);

        return () => {
            clearInterval(interval);
            clearTimeout(splitTimer);
            clearTimeout(doneTimer);
        };
    }, []); // Empty dependency array: dijamin hanya berjalan 1 kali per mount

    if (phase === 'done') {
        return null;
    }

    const isSplitting = phase === 'splitting';

    return (
        <div className="fixed inset-0 z-[100] select-none pointer-events-none overflow-hidden">
            {/* ========================================================
                LEFT CURTAIN PANEL (Tirai Kiri)
                Meluncur keluar ke sisi kiri saat splitting
               ======================================================== */}
            <div
                className={`absolute top-0 bottom-0 left-0 w-1/2 bg-black border-r border-neutral-800 transition-transform duration-[950ms] ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform ${isSplitting ? '-translate-x-full' : 'translate-x-0'
                    }`}
            />

            {/* ========================================================
                RIGHT CURTAIN PANEL (Tirai Kanan)
                Meluncur keluar ke sisi kanan saat splitting
               ======================================================== */}
            <div
                className={`absolute top-0 bottom-0 right-0 w-1/2 bg-black border-l border-neutral-800 transition-transform duration-[950ms] ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform ${isSplitting ? 'translate-x-full' : 'translate-x-0'
                    }`}
            />

            {/* Center Slit Divider Glow (Pemisah garis tengah tipis) */}
            <div
                className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-neutral-600 transition-opacity duration-300 z-10 ${isSplitting ? 'opacity-0' : 'opacity-100'
                    }`}
            />

            {/* ========================================================
                KINETIC PRELOADER CONTENT (Zajno Minimalist Editorial Style)
               ======================================================== */}
            <div
                className={`absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 text-white transition-all duration-500 ease-out ${isSplitting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                    }`}
            >
                {/* Top Bar: Technical Meta Header */}
                <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span className="text-white font-medium">KATO ARCHIVE</span>
                        <span className="text-neutral-600">//</span>
                        <span>EST. 2026</span>
                    </div>
                    <div className="hidden sm:block">
                        <span>LATENT CURATION ENGINE</span>
                    </div>
                </div>

                {/* Center Stage: Huge Brand Typography & Monospace Counter */}
                <div className="text-center my-auto">
                    {/* Animated Counter */}
                    <div className="mb-4 inline-flex items-baseline gap-1 font-mono">
                        <span className="text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-tighter">
                            {count.toString().padStart(2, '0')}
                        </span>
                        <span className="text-lg sm:text-2xl text-neutral-500 font-normal">%</span>
                    </div>

                    {/* Brand Title with Kinetic Letter Spacing */}


                    {/* Dynamic Status Message */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        <span>[</span>
                        <span className={count === 100 ? 'text-white font-medium' : 'text-neutral-400'}>
                            {count < 35 && 'LOADING NEURAL MODELS...'}
                            {count >= 35 && count < 75 && 'PROCESSING LATENT TENSORS...'}
                            {count >= 75 && count < 100 && 'SYNCHRONIZING PROMPT ARCHIVE...'}
                            {count === 100 && 'ACCESS GRANTED'}
                        </span>
                        <span>]</span>
                    </div>
                </div>

                {/* Bottom Bar: Ultra-thin Progress Line & Parameter Tags */}
                <div>
                    {/* Thin Progress Line */}
                    <div className="w-full h-[1px] bg-neutral-900 overflow-hidden mb-4">
                        <div
                            style={{ width: `${count}%` }}
                            className="h-full bg-white transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        <div className="flex gap-4">
                            <span>FLUX.1</span>
                            <span>MIDJOURNEY V6</span>
                            <span>SDXL</span>
                        </div>
                        <div>
                            <span>INITIALIZING INTERACTION</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
