import { useState } from 'react';
import { Copy, Check, Sliders, Eye, Wand2, Compass, Layers, Camera } from 'lucide-react';

interface ComparisonData {
    tag: string;
    label: string;
    prompt: string;
    negative_prompt: string;
    image_url: string;
    params: {
        steps: number;
        cfg: number;
        sampler: string;
        seed: string;
    };
    critique: string;
    highlights: string[];
}

const COMPARISON_DATA: Record<'simple' | 'engineered', ComparisonData> = {
    simple: {
        tag: 'Vague & Ambiguous',
        label: 'Simple Prompt',
        prompt: 'a futuristic city, cyberpunk style, neon lights',
        negative_prompt: 'None',
        image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=900&q=80',
        params: {
            steps: 15,
            cfg: 4.0,
            sampler: 'Euler',
            seed: 'Random / Unfixed',
        },
        critique: 'Model menebak 90% parameter visual secara acak. Menghasilkan geometri repetitif tanpa kedalaman fokus, pencahayaan datar, dan komposisi yang tidak terarah.',
        highlights: [
            'Komposisi flat tanpa foreground / background separation',
            'Pencahayaan neon oversaturated tanpa pantulan realistis',
            'Kurangnya spesifikasi optik kamera dan tekstur material',
        ],
    },
    engineered: {
        tag: 'Controlled & Intentional',
        label: 'Engineered Prompt',
        prompt: 'Cinematic 35mm wide-angle photograph of Neo-Shinjuku metropolis at blue hour, volumetric cyan and amber neon haze, rain-slicked asphalt reflecting towering holographic billboards, intricate architectural brutalism, octane render, photorealistic, 8k, f/1.8, ISO 200, 1/125s shutter',
        negative_prompt: 'blurry, flat lighting, oversaturated, cartoon, lowres, distorted architecture, watermark, deformed geometry',
        image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80',
        params: {
            steps: 45,
            cfg: 7.5,
            sampler: 'DPM++ 2M Karras',
            seed: '8492048102 (Reproducible)',
        },
        critique: 'Prompt mengunci seluruh parameter penting: focal length (35mm), aperture (f/1.8), kondisi atmosfer (blue hour, rain-slicked asphalt), dan gaya arsitektur sehingga menghasilkan karya kelas galeri yang konsisten.',
        highlights: [
            'Volumetric lighting & raytraced wet reflections',
            'Spesifikasi optik (f/1.8, shallow depth of field)',
            'Negative prompt aktif membersihkan noise dan artefak',
        ],
    },
};

export default function PromptComparisonSection() {
    const [mode, setMode] = useState<'simple' | 'engineered'>('engineered');
    const [copied, setCopied] = useState(false);
    const data = COMPARISON_DATA[mode];

    const handleCopy = () => {
        navigator.clipboard.writeText(data.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="why-prompt" className="py-24 bg-black border-t border-neutral-900 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-3">
                        The Science of AI Generation
                    </p>
                    <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight leading-tight">
                        Why Prompt Engineering Matters
                    </h2>
                    <p className="mt-4 text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
                        Prompt bukan sekadar perintah kata; ia adalah pemandu ruang laten (*latent space vector*) yang menentukan komposisi, fisika optik kamera, hingga materialitas gambar.
                    </p>

                    {/* Interactive Mode Toggle Button */}
                    <div className="mt-8 inline-flex items-center p-1 rounded-full bg-neutral-950 border border-neutral-800">
                        <button
                            onClick={() => setMode('simple')}
                            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                                mode === 'simple'
                                    ? 'bg-neutral-800 text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Simple Prompt
                        </button>
                        <button
                            onClick={() => setMode('engineered')}
                            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                                mode === 'engineered'
                                    ? 'bg-white text-black font-semibold shadow-md'
                                    : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            Engineered Prompt
                        </button>
                    </div>
                </div>

                {/* Interactive Comparison Card Stage */}
                <div className="bg-neutral-950 rounded-3xl border border-neutral-800/80 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Left: Image Canvas with Transition */}
                        <div className="lg:col-span-5 relative min-h-[360px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-neutral-900">
                            <img
                                key={data.image_url}
                                src={data.image_url}
                                alt={data.label}
                                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20">
                                    <Eye className="w-3.5 h-3.5" />
                                    {data.tag}
                                </span>
                            </div>

                            <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-neutral-300">
                                <p className="font-mono text-[11px] text-neutral-400 mb-1 uppercase tracking-wider">
                                    Visual Assessment
                                </p>
                                <p className="leading-relaxed font-light">{data.critique}</p>
                            </div>
                        </div>

                        {/* Right: Technical Prompt Breakdown */}
                        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                            <div>
                                {/* Prompt Box */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <Wand2 className="w-3.5 h-3.5 text-neutral-400" />
                                        Injected Prompt
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" /> Tersalin
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" /> Salin
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-black border border-neutral-900 font-mono text-xs sm:text-[13px] text-neutral-200 leading-relaxed min-h-[96px] flex items-center">
                                    "{data.prompt}"
                                </div>

                                {/* Negative Prompt */}
                                <div className="mt-4">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block mb-1.5">
                                        Negative Prompt (Noise Filter)
                                    </span>
                                    <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-900 font-mono text-xs text-neutral-400">
                                        {data.negative_prompt}
                                    </div>
                                </div>

                                {/* Technical Generation Parameters */}
                                <div className="mt-6 pt-6 border-t border-neutral-900">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-3 flex items-center gap-1.5">
                                        <Sliders className="w-3.5 h-3.5" /> Parameter Engine
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                        <div className="p-3 rounded-xl bg-black border border-neutral-900">
                                            <p className="text-[10px] font-mono text-neutral-500 uppercase">Steps</p>
                                            <p className="text-sm font-mono text-white font-medium mt-0.5">{data.params.steps}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black border border-neutral-900">
                                            <p className="text-[10px] font-mono text-neutral-500 uppercase">CFG Scale</p>
                                            <p className="text-sm font-mono text-white font-medium mt-0.5">{data.params.cfg}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black border border-neutral-900">
                                            <p className="text-[10px] font-mono text-neutral-500 uppercase">Sampler</p>
                                            <p className="text-xs font-mono text-white font-medium mt-1 truncate">{data.params.sampler}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black border border-neutral-900">
                                            <p className="text-[10px] font-mono text-neutral-500 uppercase">Seed</p>
                                            <p className="text-[11px] font-mono text-neutral-300 font-medium mt-1 truncate">{data.params.seed}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Highlights */}
                                <div className="mt-6 space-y-2">
                                    {data.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 font-light">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                            <span>{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Pillars of Prompt Engineering Guide */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
                        <div className="p-2.5 rounded-xl bg-neutral-900 w-fit mb-3 text-white">
                            <Compass className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-white text-base mb-1">1. Subject & Silhouette</h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Definisikan subjek utama secara presisi, hindari istilah generik tanpa konteks tindakan atau proporsi.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
                        <div className="p-2.5 rounded-xl bg-neutral-900 w-fit mb-3 text-white">
                            <Camera className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-white text-base mb-1">2. Optics & Camera</h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Sebutkan focal length lensa (35mm, 85mm), bukaan aperture (f/1.4), dan shutter speed untuk kedalaman fokus realistis.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
                        <div className="p-2.5 rounded-xl bg-neutral-900 w-fit mb-3 text-white">
                            <Layers className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-white text-base mb-1">3. Volumetric Lighting</h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Arahkan pencahayaan: chiaroscuro, golden hour, neon haze, atau rim lighting untuk memberi volume 3D pada objek.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-900">
                        <div className="p-2.5 rounded-xl bg-neutral-900 w-fit mb-3 text-white">
                            <Sliders className="w-4 h-4" />
                        </div>
                        <h4 className="font-serif text-white text-base mb-1">4. Engine Hyperparameters</h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                            Sesuaikan CFG Scale (5.0 - 8.0) dan sampling steps (30 - 50) agar model tidak over-fit atau menghasilkan distorsi.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

