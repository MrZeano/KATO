import React from 'react';

interface SplitTextRevealProps {
    text: string;
    trigger?: boolean;
    delay?: number; // Jeda awal (ms) sebelum kata pertama mulai naik
    stagger?: number; // Jeda (ms) antar kata berikutnya
    duration?: number; // Durasi animasi per kata (ms)
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
    subtleRotate?: boolean; // Efek kemiringan mikro 2 derajat saat terbit (opsional)
}

/**
 * SplitTextReveal - Komponen animasi tipografi "Masked Slide-Up" (Split Text Motion).
 *
 * Analogi Android (Jetpack Compose):
 * Mirip dengan memecah teks menjadi kata-kata, lalu setiap kata dibungkus dalam
 * `Box(modifier = Modifier.clipToBounds())` (overflow-hidden mask).
 * Kata di dalamnya memiliki `Modifier.graphicsLayer { translationY = ... }`
 * yang meluncur naik ke atas secara berurutan dengan kurva cubic-bezier.
 */
export default function SplitTextReveal({
    text,
    trigger = true,
    delay = 200,
    stagger = 35,
    duration = 800,
    className = '',
    as: Tag = 'div',
    subtleRotate = false,
}: SplitTextRevealProps) {
    const words = text.split(' ');

    return (
        <Tag className={className}>
            {words.map((word, index) => {
                const wordDelay = delay + index * stagger;

                return (
                    <span
                        key={index}
                        // Stencil mask container: memotong huruf yang berada di bawah lantai teks
                        // pb & -mb memberikan ruang aman agar kaki huruf ('y', 'g', 'p', 'j') tidak terpotong
                        className="inline-block overflow-hidden align-top pb-[0.2em] -mb-[0.2em]"
                    >
                        <span
                            className={`inline-block will-change-transform transition-all ${
                                trigger
                                    ? 'translate-y-0 opacity-100 rotate-0'
                                    : `translate-y-[120%] opacity-0 ${subtleRotate ? 'rotate-[2deg] origin-bottom-left' : ''}`
                            }`}
                            style={{
                                transitionDuration: `${duration}ms`,
                                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Luxury Ease-Out Curve (Zajno/Apple style)
                                transitionDelay: `${wordDelay}ms`,
                            }}
                        >
                            {word}
                        </span>
                        {/* Spasi antar kata di luar mask agar jarak antar kata alami */}
                        {index < words.length - 1 && (
                            <span className="inline-block">&nbsp;</span>
                        )}
                    </span>
                );
            })}
        </Tag>
    );
}

