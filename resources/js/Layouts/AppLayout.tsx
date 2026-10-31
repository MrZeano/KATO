import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import { LayoutDashboard, Shield, LogIn, LogOut, Menu, X, Plus } from 'lucide-react';
import { PageProps } from '@/types';

interface AppLayoutProps extends PropsWithChildren {
    title?: string;
    delayNavbar?: boolean;
}

export default function AppLayout({ children, title, delayNavbar = false }: AppLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [navVisible, setNavVisible] = useState(!delayNavbar);

    useEffect(() => {
        if (delayNavbar) {
            const timer = setTimeout(() => {
                setNavVisible(true);
            }, 2100);
            return () => clearTimeout(timer);
        }
    }, [delayNavbar]);

    return (
        <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white antialiased">
            {/* Top Navigation Bar - Minimalist Editorial Style with Optional Entrance Delay */}
            <header
                className={`sticky top-0 z-50 backdrop-blur-xl bg-black/85 border-b border-neutral-900 transition-all duration-700 ease-out ${
                    navVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo & Brand (Voyager2 inspired) */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2 group">
                                <span className="text-xl sm:text-2xl font-serif tracking-tight text-white font-medium group-hover:text-neutral-300 transition-colors">
                                    Kato
                                </span>
                                <span className="text-neutral-500 font-light text-xl select-none">—</span>
                            </Link>
                            <span className="hidden md:inline-block text-[11px] font-mono tracking-widest uppercase text-neutral-500 pl-2 border-l border-neutral-800">
                                AI Prompt Archive
                            </span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link
                                href="/#explore"
                                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                            >
                                Explore
                            </Link>
                            <a
                                href="/#models"
                                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                            >
                                Models
                            </a>
                            <a
                                href="/#why-prompt"
                                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                            >
                                Why Prompt
                            </a>

                            {user ? (
                                <div className="flex items-center gap-5 pl-4 border-l border-neutral-800">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-300 hover:text-white transition-colors"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
                                        Dashboard
                                    </Link>

                                    {user.role === 'admin' && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider bg-neutral-900 text-neutral-300 border border-neutral-700">
                                            <Shield className="w-3 h-3 text-neutral-400" /> Admin
                                        </span>
                                    )}

                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-500 hover:text-rose-400 transition-colors"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Keluar
                                    </Link>

                                    <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center font-mono text-xs text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 pl-4 border-l border-neutral-800">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition"
                                    >
                                        <LogIn className="w-3.5 h-3.5" /> Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-xs uppercase tracking-widest font-semibold bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full transition duration-200 shadow-sm"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-neutral-900 space-y-3">
                            <Link
                                href="/#explore"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
                            >
                                Explore
                            </Link>
                            <a
                                href="/#models"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
                            >
                                Models
                            </a>
                            <a
                                href="/#why-prompt"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
                            >
                                Why Prompt
                            </a>
                            {user ? (
                                <div className="pt-2 border-t border-neutral-900 space-y-2">
                                    <Link
                                        href={route('dashboard')}
                                        className="block px-3 py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white"
                                    >
                                        Dashboard Saya ({user.name})
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="w-full text-left px-3 py-2 text-xs uppercase tracking-widest text-rose-400 hover:text-rose-300"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <div className="pt-2 border-t border-neutral-900 flex flex-col gap-2">
                                    <Link
                                        href={route('login')}
                                        className="block text-center px-4 py-2.5 rounded-full text-xs uppercase tracking-widest text-neutral-300 bg-neutral-900 border border-neutral-800"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block text-center px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold text-black bg-white"
                                    >
                                        Daftar Akun
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Flash Message Banner */}
            {flash?.success && (
                <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-200 px-4 py-2.5 text-center text-xs font-mono tracking-wide">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-neutral-900 border-b border-rose-900/50 text-rose-300 px-4 py-2.5 text-center text-xs font-mono tracking-wide">
                    {flash.error}
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer - Minimalist Luxury */}
            <footer className="border-t border-neutral-900 py-12 bg-black text-center text-xs text-neutral-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-serif text-white font-medium text-base">Kato</span>
                        <span className="text-neutral-600">—</span>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                            Curated AI Archive
                        </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-600">
                        &copy; {new Date().getFullYear()} Kato. Built with Laravel, Inertia, React & Tailwind.
                    </p>
                </div>
            </footer>
        </div>
    );
}
