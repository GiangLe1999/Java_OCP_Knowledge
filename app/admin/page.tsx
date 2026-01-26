import Link from 'next/link';
import { BookOpen, HelpCircle, Plus } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function AdminDashboard() {
    const dataDir = path.join(process.cwd(), 'data');
    const publicDataDir = path.join(process.cwd(), 'public', 'data');

    const topics = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics.json'), 'utf-8'));
    const quizzes = JSON.parse(fs.readFileSync(path.join(dataDir, 'quizzes.json'), 'utf-8'));
    const parentTopics = JSON.parse(fs.readFileSync(path.join(dataDir, 'parent-topics.json'), 'utf-8'));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Quản lý nội dung Java Knowledge</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-blue-600/10 border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Topics</p>
                            <p className="text-3xl font-bold">{topics?.topics?.length}</p>
                        </div>
                        <BookOpen size={40} className="text-blue-400" />
                    </div>
                </div>

                <div className="card bg-purple-600/10 border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Parent Topics</p>
                            <p className="text-3xl font-bold">{parentTopics.parentTopics.length}</p>
                        </div>
                        <BookOpen size={40} className="text-purple-400" />
                    </div>
                </div>

                <div className="card bg-green-600/10 border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Total Quizzes</p>
                            <p className="text-3xl font-bold">{quizzes.quizzes.length}</p>
                        </div>
                        <HelpCircle size={40} className="text-green-400" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/admin/topics/new" className="card-gradient group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">Create New Topic</h3>
                                <p className="text-sm text-gray-400">Add a new Java knowledge topic</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/quizzes/new" className="card-gradient group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1 group-hover:text-green-400 transition-colors">Create New Quiz</h3>
                                <p className="text-sm text-gray-400">Add a new quiz question</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
