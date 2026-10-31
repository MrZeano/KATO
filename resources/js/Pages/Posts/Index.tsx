import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PostCard from '@/Components/PostCard';
import HeroCarousel from '@/Components/HeroCarousel';
import AiModelsSection from '@/Components/AiModelsSection';
import PromptComparisonSection from '@/Components/PromptComparisonSection';
import IntroSplash from '@/Components/IntroSplash';
import { PaginatedData, Post } from '@/types';

interface IndexProps {
    posts: PaginatedData<Post>;
    featuredPosts?: Post[];
    filters: {
        q: string;
        model: string;
    };
    availableModels: string[];
}

export default function Index({ posts, featuredPosts = [], filters, availableModels }: IndexProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [selectedModel, setSelectedModel] = useState(filters.model || '');
    const [isRevealed, setIsRevealed] = useState(false);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilters(search, selectedModel);
    };

    const handleModelSelect = (model: string) => {
        const newModel = selectedModel === model ? '' : model;
        setSelectedModel(newModel);
        applyFilters(search, newModel);

        // Smooth scroll to feed section if clicked from models section
        const feedElement = document.getElementById('explore');
        if (feedElement) {
            feedElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleReset = () => {
        setSearch('');
        setSelectedModel('');
        router.get(route('home'), {}, { preserveState: true });
    };

    const applyFilters = (query: string, model: string) => {
        router.get(
            route('home'),
            {
                q: query || undefined,
                model: model || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout delayNavbar={true}>
            <Head title="Kato — Curated AI Image & Prompt Archive" />

            {/* Entrance Zajno-Style Kinetic Preloader & Curtain Reveal */}
            <IntroSplash onRevealStart={() => setIsRevealed(true)} />

            {/* Hero Scale-Up Transition Container (Zajno 3D Depth Effect) */}
            <div
                className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-center will-change-transform ${
                    isRevealed
                        ? 'scale-100 opacity-100 rounded-none'
                        : 'scale-[0.93] opacity-60 rounded-3xl overflow-hidden'
                }`}
            >
                {/* 1. Hero 3D Perspective Curved Carousel Section */}
                <HeroCarousel posts={featuredPosts} />

                {/* 2. AI Models Ecosystem Strip */}
                <AiModelsSection
                    selectedModel={selectedModel}
                    onSelectModel={handleModelSelect}
                />

                {/* 3. Interactive Why Prompt Matters Comparison Section */}
                <PromptComparisonSection />

                {/* 4. Explore Feed Gallery Section */}
                <section id="explore" className="py-24 bg-black border-t border-neutral-900 scroll-mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Title & Search Header */}
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-2">
                                Public Archive
                            </p>
                            <h2 className="text-3xl sm:text-5xl font-serif text-white font-normal tracking-tight">
                                Explore Verified AI Prompts
                            </h2>
                            <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto">
                                Telusuri katalog karya seni AI yang telah disetujui kurator, lengkap dengan prompt salin-langsung dan parameter teknis.
                            </p>

                            {/* Search Bar Input (Minimalist Luxury) */}
                            <form onSubmit={handleSearch} className="mt-8 relative max-w-xl mx-auto">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 w-4 h-4 text-neutral-500 pointer-events-none" />
                                    <input
                                        id="search-input"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari gaya seni, cyberpunk, studio portrait, macro..."
                                        className="w-full pl-11 pr-24 py-3.5 rounded-full bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white text-xs sm:text-sm transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold uppercase tracking-wider transition duration-150"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>

                            {/* Filter Chips by AI Model */}
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    onClick={() => handleModelSelect('')}
                                    className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                                        selectedModel === ''
                                            ? 'bg-white text-black font-semibold shadow-md'
                                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                                    }`}
                                >
                                    All Models
                                </button>
                                {availableModels.map((model) => (
                                    <button
                                        key={model}
                                        onClick={() => handleModelSelect(model)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                                            selectedModel === model
                                                ? 'bg-white text-black font-semibold shadow-md'
                                                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                                    }`}
                                >
                                        {model}
                                    </button>
                                ))}

                                {(search || selectedModel) && (
                                    <button
                                        onClick={handleReset}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-neutral-400 hover:text-rose-400 bg-neutral-950 border border-neutral-800 transition"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Posts Grid Gallery */}
                        {posts.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {posts.data.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20 px-4 bg-neutral-950 rounded-3xl border border-neutral-900 max-w-md mx-auto">
                                <Filter className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                                <h3 className="font-serif text-lg text-white font-medium">Tidak ada gambar ditemukan</h3>
                                <p className="mt-2 text-xs text-neutral-400 font-light">
                                    Coba gunakan kata kunci pencarian lain atau hilangkan filter model AI.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-5 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono tracking-wider transition border border-neutral-800"
                                >
                                    Reset Filter Pencarian
                                </button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {posts.links && posts.links.length > 3 && (
                            <div className="mt-16 flex justify-center items-center gap-1.5">
                                {posts.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3.5 py-2 text-xs font-mono rounded-xl text-neutral-600 bg-neutral-950 border border-neutral-900 select-none"
                                            />
                                        );
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => router.get(link.url!, {}, { preserveState: true, preserveScroll: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3.5 py-2 text-xs font-mono rounded-xl transition-all ${
                                                link.active
                                                    ? 'bg-white text-black font-semibold shadow-md'
                                                    : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
