import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gradient">Java Knowledge Hub</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng học tập Java OCA & OCP toàn diện với hơn 500 chủ đề, flashcards tương tác và quiz.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/topics" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Browse Topics
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link href="/flashcards" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Flashcards
                                </Link>
                            </li>
                            <li>
                                <Link href="/quiz" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    Take a Quiz
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Stats */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>📚 500+ Topics covered</li>
                            <li>🎯 7 Major categories</li>
                            <li>⚡ Interactive learning</li>
                            <li>🚀 Always improving</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-sm flex items-center space-x-2">
                        <span>Made with</span>
                        <Heart size={16} className="text-red-500" fill="currentColor" />
                        <span>for Java learners</span>
                    </p>

                    <p className="text-gray-500 text-sm">
                        © 2026 Java Knowledge Hub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
