'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, BookOpen, Zap, Trophy } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">☕</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gradient">Java Hub</h1>
                            <p className="text-xs text-gray-400">OCA & OCP</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/topics" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                            <BookOpen size={18} />
                            <span>Topics</span>
                        </Link>
                        <Link href="/search" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                            <Search size={18} />
                            <span>Search</span>
                        </Link>
                        <Link href="/flashcards" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                            <Zap size={18} />
                            <span>Flashcards</span>
                        </Link>
                        <Link href="/quiz" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                            <Trophy size={18} />
                            <span>Quiz</span>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 space-y-3 border-t border-gray-800">
                        <Link
                            href="/topics"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BookOpen size={20} />
                            <span>Topics</span>
                        </Link>
                        <Link
                            href="/search"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Search size={20} />
                            <span>Search</span>
                        </Link>
                        <Link
                            href="/flashcards"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Zap size={20} />
                            <span>Flashcards</span>
                        </Link>
                        <Link
                            href="/quiz"
                            className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Trophy size={20} />
                            <span>Quiz</span>
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
