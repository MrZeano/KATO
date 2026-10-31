import React, { useMemo } from 'react';

interface FlickerTextProps {
    text: string;
    trigger?: boolean;
    delay?: number; // Jeda awal (ms) sebelum animasi karakter pertama dimulai
    stagger?: number; // Jeda (ms) antar kemunculan huruf yang diacak
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

/**
 * FlickerText - Komponen teks dengan efek "Shuffled Character Flicker" (Gaya Refactory).
 *
 * Analogi Android:
 * Mirip dengan @Composable Text kustom di Jetpack Compose di mana setiap huruf
 * memiliki Animatable(alpha = 0f) yang di-trigger bergantian secara acak
 * menggunakan coroutine delay.
 */
export default function FlickerText({
    text,
    trigger = true,
    delay = 280,
    stagger = 28,
    className = '',
    as: Tag = 'h1',
}: FlickerTextProps) {
    // 1. Pecah teks menjadi kata (words) dan huruf (chars)
    // Trik "words wrapping": kata dibungkus span inline-block whitespace-nowrap agar kata
    // tidak terpotong canggung saat teks berpindah baris (responsive line break).
    const { words, orderMap } = useMemo(() => {
        const rawWords = text.split(' ');
        let totalNonSpaceChars = 0;

        rawWords.forEach((word) => {
            totalNonSpaceChars += word.length;
        });

        // 2. Acak urutan kemunculan karakter menggunakan algoritma Fisher-Yates shuffle
        // Sama persis seperti gsap.utils.shuffle([...chars]) pada Refactory
        const indices = Array.from({ length: totalNonSpaceChars }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Map indeks urutan global karakter -> nomor giliran tampil (order step)
        const orderMap = new Map<number, number>();
        indices.forEach((shuffledIndex, orderIndex) => {
            orderMap.set(shuffledIndex, orderIndex);
        });

        return { words: rawWords, orderMap };
    }, [text]);

    // Counter lokal selama render traversal
    let globalCharIndex = 0;

    return (
        <Tag className={className}>
            {/* Scoped CSS Keyframe untuk kedipan huruf (0 -> 1 -> 0 -> 1) */}
            <style>{`
                @keyframes refactory-flicker {
                    0% {
                        opacity: 0;
                    }
                    33% {
                        opacity: 1;
                    }
                    66% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>

            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split('').map((char, charIndex) => {
                        const currentCharIndex = globalCharIndex++;
                        const order = orderMap.get(currentCharIndex) ?? 0;
                        const charDelay = delay + order * stagger;

                        return (
                            <span
                                key={charIndex}
                                className="inline-block will-change-transform"
                                style={
                                    trigger
                                        ? {
                                              animation: 'refactory-flicker 220ms ease-in-out forwards',
                                              animationDelay: `${charDelay}ms`,
                                              opacity: 0,
                                          }
                                        : { opacity: 0 }
                                }
                            >
                                {char}
                            </span>
                        );
                    })}
                    {/* Spasi antar kata tetap terjaga dimensinya */}
                    {wordIndex < words.length - 1 && (
                        <span className="inline-block">&nbsp;</span>
                    )}
                </span>
            ))}
        </Tag>
    );
}

