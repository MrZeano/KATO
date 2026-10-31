import React from 'react';

interface OrreryBackgroundProps {
    isRevealed?: boolean;
}

/**
 * OrreryBackground - Latar belakang diagram mekanikal jam astronomi / siklus AI (Cyclical Orrery).
 *
 * Terinspirasi dari diagram jam "CYCLICAL":
 * - Cincin orbit konsentris bernuansa stealth (abu-abu gelap semi-transparan).
 * - Multi-layer rotasi mekanis lambat (searah & berlawanan jarum jam).
 * - Berkas cahaya putih (White Comet Beam / Laser Tracer) yang meluncur melingkari orbit secara berkala.
 * - Sumbu radial jarum planet yang menyapu koordinat panggung di balik carousel kartu.
 *
 * Analogi Android:
 * Seperti membuat Custom View / Compose Canvas dengan rememberInfiniteTransition()
 * yang merender multi-layer Path dan PathEffect.dashPathEffect dengan rotasi lambat.
 */
export default function OrreryBackground({ isRevealed = true }: OrreryBackgroundProps) {
    return (
        <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden transition-opacity duration-1000 ease-out z-0 ${
                isRevealed ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
                // Masking radial halus di pinggiran agar lingkaran menyatu mulus dengan kegelapan layar
                maskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.5) 70%, transparent 95%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.5) 70%, transparent 95%)',
            }}
            aria-hidden="true"
        >
            <style>{`
                @keyframes orrery-spin-cw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes orrery-spin-ccw {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes orrery-spin-needle {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes orrery-beam-outer {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -2387.6; }
                }
                @keyframes orrery-beam-inner {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 1570.8; }
                }
                @keyframes orrery-radial-pulse {
                    0% { stroke-dashoffset: 80; opacity: 0; }
                    15% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { stroke-dashoffset: -460; opacity: 0; }
                }
                @keyframes orrery-node-blink {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.4); }
                }
            `}</style>

            <svg
                viewBox="0 0 1000 1000"
                className="w-[880px] sm:w-[1100px] md:w-[1300px] h-[880px] sm:h-[1100px] md:h-[1300px] max-w-none text-white will-change-transform"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Filter Glow Neon Putih untuk Berkas Cahaya yang Melintas */}
                <defs>
                    <filter id="whiteGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="whiteGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur1" />
                        <feGaussianBlur stdDeviation="2" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur1" />
                            <feMergeNode in="blur2" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ==========================================================
                    LAYER 1: STATIC BACKGROUND GEOMETRY (Garis Statis Abu Gelap)
                   ========================================================== */}
                <g opacity="0.45">
                    {/* Crosshair Axes & Center Origin Grid */}
                    <line x1="500" y1="30" x2="500" y2="970" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 9" />
                    <line x1="30" y1="500" x2="970" y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 9" />
                    
                    {/* Lingkaran Luar Statis */}
                    <circle cx="500" cy="500" r="475" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="455" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="290" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="210" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="140" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <circle cx="500" cy="500" r="70" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
                    <circle cx="500" cy="500" r="8" fill="rgba(255,255,255,0.2)" />
                </g>

                {/* ==========================================================
                    LAYER 2: SLOW ROTATING TRACK A (Putaran Lambat Searah Jarum Jam - 140s)
                    Cincin Dotted & Busur Skala Derajat Luar
                   ========================================================== */}
                <g style={{ transformOrigin: '500px 500px', animation: 'orrery-spin-cw 140s linear infinite' }}>
                    {/* Dotted Astronomical Compass Track (r = 460) */}
                    <circle
                        cx="500"
                        cy="500"
                        r="460"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                        strokeDasharray="2 12"
                    />

                    {/* Skala Busur Segmen Luar */}
                    <path
                        d="M 500,60 A 440,440 0 0,1 880,280"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 120,720 A 440,440 0 0,1 280,880"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                        strokeDasharray="4 8"
                    />

                    {/* Technical Micro Text di sepanjang orbit */}
                    <text
                        x="520"
                        y="48"
                        fill="rgba(255,255,255,0.22)"
                        fontSize="8"
                        fontFamily="monospace"
                        letterSpacing="0.25em"
                    >
                        CYCLICAL ORBIT // LATENT HARMONICS // REF.2026
                    </text>
                    <text
                        x="180"
                        y="920"
                        fill="rgba(255,255,255,0.18)"
                        fontSize="7"
                        fontFamily="monospace"
                        letterSpacing="0.2em"
                    >
                        SYS.ORRERY // AXIS-SYNC
                    </text>
                </g>

                {/* ==========================================================
                    LAYER 3: COUNTER-ROTATING TRACK B (Berputar Berlawanan Arah - 95s)
                    Cincin Busur Tebal & Node Planet Menengah
                   ========================================================== */}
                <g style={{ transformOrigin: '500px 500px', animation: 'orrery-spin-ccw 95s linear infinite' }}>
                    {/* Busur Lengkung Tebal (Segmented Dark Arc r = 380) */}
                    <path
                        d="M 880,500 A 380,380 0 0,1 500,880"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M 120,500 A 380,380 0 0,1 500,120"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1.5"
                        strokeDasharray="6 14"
                    />

                    {/* Dotted Inner Wheel (r = 290) */}
                    <circle
                        cx="500"
                        cy="500"
                        r="290"
                        stroke="rgba(255,255,255,0.10)"
                        strokeWidth="1.2"
                        strokeDasharray="3 8"
                    />

                    {/* Planet Nodes (Bulatan planet dengan label angka mikro seperti di gambar) */}
                    <g transform="translate(770, 500)">
                        <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        <circle cx="0" cy="0" r="4" fill="rgba(255,255,255,0.5)" />
                        <text x="18" y="3" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">01</text>
                    </g>
                    <g transform="translate(230, 500)">
                        <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.4)" />
                        <text x="-26" y="3" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">07</text>
                    </g>
                    <g transform="translate(500, 210)">
                        <circle cx="0" cy="0" r="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="0" cy="0" r="5" fill="rgba(255,255,255,0.45)" />
                        <text x="12" y="-12" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">14</text>
                    </g>

                    {/* Teks Melingkar "PLANET SYNC A" */}
                    <text
                        x="510"
                        y="196"
                        fill="rgba(255,255,255,0.2)"
                        fontSize="7"
                        fontFamily="monospace"
                        letterSpacing="0.18em"
                    >
                        PLANET SYNC A - TENSOR DYNAMICS
                    </text>
                </g>

                {/* ==========================================================
                    LAYER 4: PLANETARY NEEDLE ALIGNMENT AXIS (Jarum Radial Panjang - 70s)
                    Menghubungkan planet-planet dalam garis lurus seperti jarum jam kosmik
                   ========================================================== */}
                <g style={{ transformOrigin: '500px 500px', animation: 'orrery-spin-needle 70s linear infinite' }}>
                    {/* Sumbu needle utama menembus panggung */}
                    <line
                        x1="500"
                        y1="40"
                        x2="500"
                        y2="960"
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth="1.5"
                    />

                    {/* Node Planet di sepanjang Needle (seperti manik-manik planet pada gambar) */}
                    <circle cx="500" cy="65" r="7" fill="white" filter="url(#whiteGlow)" opacity="0.8" />
                    <circle cx="500" cy="180" r="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <circle cx="500" cy="270" r="10" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                    <circle cx="500" cy="350" r="5" fill="white" opacity="0.6" />
                    <circle cx="500" cy="620" r="22" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    <circle cx="500" cy="730" r="8" fill="rgba(255,255,255,0.2)" />
                    <circle cx="500" cy="850" r="13" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

                    {/* Sumbu sekunder bersudut 62 derajat */}
                    <line
                        x1="220"
                        y1="220"
                        x2="780"
                        y2="780"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                        strokeDasharray="2 6"
                    />
                    <circle cx="730" cy="730" r="15" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" />
                    <circle cx="270" cy="270" r="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" />

                    {/* ==========================================================
                        ANIMASI 1: PULSA SINAR PUTIH RADIAL (Meluncur keluar di jarum)
                       ========================================================== */}
                    <line
                        x1="500"
                        y1="500"
                        x2="500"
                        y2="40"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#whiteGlow)"
                        style={{
                            strokeDasharray: '90 460',
                            animation: 'orrery-radial-pulse 4.5s ease-out infinite',
                        }}
                    />
                </g>

                {/* ==========================================================
                    LAYER 5: THE WHITE TRAVELING BEAMS (Animasi Cahaya Putih Berjalan Melingkar)
                   ========================================================== */}
                {/* 1. Berkas Cahaya Putih Meluncur di Orbit Luar (r = 380) */}
                <circle
                    cx="500"
                    cy="500"
                    r="380"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#whiteGlowStrong)"
                    style={{
                        strokeDasharray: '160 2227', // Panjang berkas 160px, celah 2227px
                        animation: 'orrery-beam-outer 8s linear infinite',
                    }}
                />

                {/* 2. Berkas Cahaya Putih Meluncur Berlawanan di Orbit Dalam (r = 250) */}
                <circle
                    cx="500"
                    cy="500"
                    r="250"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    filter="url(#whiteGlow)"
                    style={{
                        strokeDasharray: '110 1460', // Panjang berkas 110px, celah 1460px
                        animation: 'orrery-beam-inner 10.5s linear infinite',
                    }}
                />

                {/* 3. Pulsing White Node Beacons (Titik-titik berdenyut putih halus) */}
                <circle
                    cx="500"
                    cy="120"
                    r="3"
                    fill="white"
                    filter="url(#whiteGlow)"
                    style={{ animation: 'orrery-node-blink 3s ease-in-out infinite' }}
                />
                <circle
                    cx="790"
                    cy="500"
                    r="3.5"
                    fill="white"
                    filter="url(#whiteGlow)"
                    style={{ animation: 'orrery-node-blink 3.8s ease-in-out infinite 1.2s' }}
                />
                <circle
                    cx="500"
                    cy="880"
                    r="3"
                    fill="white"
                    filter="url(#whiteGlow)"
                    style={{ animation: 'orrery-node-blink 4.2s ease-in-out infinite 2s' }}
                />
            </svg>
        </div>
    );
}

