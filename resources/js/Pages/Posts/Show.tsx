import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Copy, Check, Sparkles, User as UserIcon, Calendar, Layers, Sliders, Cpu, Hash } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PostCard from '@/Components/PostCard';
import { Post } from '@/types';

interface ShowProps {
    post: Post;
    relatedPosts: Post[];
}

export default function Show({ post, relatedPosts }: ShowProps) {
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedNegPrompt, setCopiedNegPrompt] = useState(false);

    const handleCopy = (text: string, type: 'prompt' | 'neg') => {
        navigator.clipboard.writeText(text);
        if (type === 'prompt') {
            setCopiedPrompt(true);
            setTimeout(() => setCopiedPrompt(false), 2000);
        } else {
            setCopiedNegPrompt(true);
            setTimeout(() => setCopiedNegPrompt(false), 2000);
        }
    };

    return (
        <AppLayout>
            <Head title={`${post.title} - Kato AI Showcase`} />

            {/* Back Button */}
            <div className="mb-6">
                <Link
                    href={route('home')}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Galeri
                </Link>
            </div>

            {/* Main Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Image Viewer (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                        <img
                            src={post.image_path}
                            alt={post.title}
                            className="w-full h-auto object-contain max-h-[750px] mx-auto"
                        />
                    </div>
                </div>

                {/* Right Column: Metadata & Prompt Inspector (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Header: Title, Creator, Date */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <Sparkles className="w-3.5 h-3.5" />
                                {post.ai_model}
                            </span>
                            {post.status !== 'approved' && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                    post.status === 'pending'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}>
                                    {post.status}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                            {post.title}
                        </h1>

                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <UserIcon className="w-4 h-4 text-slate-500" />
                                {post.user?.name || 'Kreator Anonim'}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {new Date(post.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Prompt Box */}
                    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 relative group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Positive Prompt
                            </span>
                            <button
                                onClick={() => handleCopy(post.prompt, 'prompt')}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm shadow-indigo-600/30"
                            >
                                {copiedPrompt ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Tersalin!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" /> Salin Prompt
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 select-all">
                            {post.prompt}
                        </p>
                    </div>

                    {/* Negative Prompt (if exists) */}
                    {post.negative_prompt && (
                        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Negative Prompt
                                </span>
                                <button
                                    onClick={() => handleCopy(post.negative_prompt!, 'neg')}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                >
                                    {copiedNegPrompt ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-300" /> Tersalin!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" /> Salin
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 select-all">
                                {post.negative_prompt}
                            </p>
                        </div>
                    )}

                    {/* Technical Generation Parameters */}
                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                            Parameter Teknis AI
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                                <span className="text-slate-500 block flex items-center gap-1">
                                    <Hash className="w-3 h-3" /> Seed
                                </span>
                                <span className="font-mono text-slate-200 font-medium mt-0.5 block truncate">
                                    {post.seed || 'Random'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                                <span className="text-slate-500 block flex items-center gap-1">
                                    <Layers className="w-3 h-3" /> Steps
                                </span>
                                <span className="font-mono text-slate-200 font-medium mt-0.5 block">
                                    {post.steps ?? '-'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                                <span className="text-slate-500 block flex items-center gap-1">
                                    <Sliders className="w-3 h-3" /> CFG Scale
                                </span>
                                <span className="font-mono text-slate-200 font-medium mt-0.5 block">
                                    {post.cfg_scale ?? '-'}
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                                <span className="text-slate-500 block flex items-center gap-1">
                                    <Cpu className="w-3 h-3" /> Sampler
                                </span>
                                <span className="font-mono text-slate-200 font-medium mt-0.5 block truncate">
                                    {post.sampler || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <div className="mt-16 pt-10 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                            Karya Terkait dengan {post.ai_model}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedPosts.map((related) => (
                            <PostCard key={related.id} post={related} />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
