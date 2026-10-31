import { Cpu, Zap, Palette, Layers, ArrowUpRight } from 'lucide-react';

interface AiModelInfo {
    id: string;
    name: string;
    creator: string;
    badge: string;
    description: string;
    tags: string[];
}

const AI_MODELS: AiModelInfo[] = [
    {
        id: 'FLUX.1',
        name: 'FLUX.1',
        creator: 'Black Forest Labs',
        badge: '12B Flow Transformer',
        description: 'Model open-weight generasi terbaru dengan akurasi rendering teks sempurna dan anatomi fotorealistik.',
        tags: ['Text Precision', 'Hands & Anatomy', 'Photorealism'],
    },
    {
        id: 'Midjourney v6',
        name: 'Midjourney v6',
        creator: 'Midjourney Research',
        badge: 'Aesthetic Engine',
        description: 'Standar emas untuk estetika sinematik, kedalaman atmosfer, serta pencahayaan dramatis bergaya editorial.',
        tags: ['Cinematic Lighting', 'Textures', 'Artistic Direction'],
    },
    {
        id: 'SDXL',
        name: 'Stable Diffusion XL',
        creator: 'Stability AI',
        badge: 'Open Ecosystem',
        description: 'Fleksibilitas tak terbatas dengan dukungan ribuan checkpoint kustom, LoRA styles, dan kontrol ControlNet.',
        tags: ['LoRA Ecosystem', 'ControlNet', 'Fine-Tuning'],
    },
    {
        id: 'DALL-E 3',
        name: 'DALL-E 3',
        creator: 'OpenAI',
        badge: 'LLM Native Prompting',
        description: 'Pemahaman bahasa alami mendalam yang mampu menerjemahkan deskripsi rumit dan relasi spasial tanpa prompt khusus.',
        tags: ['Natural Language', 'Concept Fusion', 'Composition'],
    },
];

interface AiModelsSectionProps {
    selectedModel: string;
    onSelectModel: (model: string) => void;
}

export default function AiModelsSection({ selectedModel, onSelectModel }: AiModelsSectionProps) {
    return (
        <section id="models" className="py-20 bg-black border-t border-neutral-900 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-2">
                            Supported Architectures
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal tracking-tight">
                            Generative AI Models Ecosystem
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md leading-relaxed">
                        Setiap model memiliki karakteristik, parameter bias, dan keunggulan estetika unik. Pilih model untuk menelusuri koleksi prompt terkait.
                    </p>
                </div>

                {/* Model Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {AI_MODELS.map((model) => {
                        const isSelected = selectedModel === model.id;
                        return (
                            <div
                                key={model.id}
                                onClick={() => onSelectModel(model.id)}
                                className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                                    isSelected
                                        ? 'bg-neutral-900 border border-white text-white shadow-xl shadow-white/5'
                                        : 'bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-600 hover:bg-neutral-900/60'
                                }`}
                            >
                                <div>
                                    {/* Top Bar with Creator & Indicator */}
                                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-4">
                                        <span>{model.creator}</span>
                                        <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                            isSelected ? 'text-white' : 'text-neutral-500'
                                        }`} />
                                    </div>

                                    {/* Model Title */}
                                    <h3 className="text-xl font-serif text-white font-medium mb-1">
                                        {model.name}
                                    </h3>
                                    <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-300 mb-3">
                                        {model.badge}
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                                        {model.description}
                                    </p>
                                </div>

                                {/* Feature Tags */}
                                <div className="pt-4 border-t border-neutral-900 flex flex-wrap gap-1.5">
                                    {model.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md text-[10px] font-mono text-neutral-400 bg-neutral-900/80 border border-neutral-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

