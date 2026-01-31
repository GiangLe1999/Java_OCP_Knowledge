'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, HelpCircle, ArrowLeft, LogOut } from 'lucide-react';
import ScrollButtons from '@/components/ScrollButtons'; // Import the component

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
                    <div className="p-6">
                        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8">
                            <ArrowLeft size={20} />
                            <span>Back to Site</span>
                        </Link>

                        <h2 className="text-2xl font-bold text-gradient mb-8">Admin Panel</h2>

                        <nav className="space-y-2">
                            <Link
                                href="/admin"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <LayoutDashboard size={20} />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                href="/admin/topics"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <BookOpen size={20} />
                                <span>Topics</span>
                            </Link>

                            <Link
                                href="/admin/quizzes"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            >
                                <HelpCircle size={20} />
                                <span>Quizzes</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-colors mt-8"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
            <ScrollButtons /> {/* Add the component here */}
        </div>
    );
}