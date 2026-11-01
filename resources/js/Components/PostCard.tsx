import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Copy, Check, Sparkles, User as UserIcon } from 'lucide-react';
import { Post } from '@/types';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyPrompt = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(post.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl">
            {/* Image Preview Container */}
            <Link href={route('posts.show', post.id)} className="block relative overflow-hidden aspect-[4/3] bg-neutral-900">
                <img
                    src={post.thumbnail_path || post.image_path}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                {/* Model AI Badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/15 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-neutral-300" />
                        {post.ai_model}
                    </span>
                </div>

                {/* Quick Copy Button */}
                <button
                    onClick={handleCopyPrompt}
                    title="Salin Prompt"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 backdrop-blur-md text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 border border-white/15 shadow-sm active:scale-95"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                </button>
            </Link>

            {/* Card Content & Metadata */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <Link href={route('posts.show', post.id)}>
                        <h3 className="font-serif text-white group-hover:text-neutral-200 transition-colors line-clamp-1 text-base font-normal tracking-tight">
                            {post.title}
                        </h3>
                    </Link>
                    <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
                        {post.prompt}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span className="inline-flex items-center gap-1 text-neutral-400">
                        <UserIcon className="w-3 h-3 text-neutral-500" />
                        {post.user?.name || 'Creator'}
                    </span>
                    {post.steps && (
                        <span>{post.steps} steps</span>
                    )}
                </div>
            </div>
        </div>
    );
}
