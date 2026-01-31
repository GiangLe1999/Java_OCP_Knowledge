import Link from 'next/link';
import { Plus } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import TopicsTable from '@/components/TopicsTable'; // Import the new client component

export default async function TopicsListPage() {
    const topicsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'topics.json'), 'utf-8')
    );
    const categoriesData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'categories.json'), 'utf-8')
    );
    const parentTopicsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'parent-topics.json'), 'utf-8')
    );

    const topics = topicsData.topics || [];
    const categories = categoriesData.categories || [];
    const parentTopics = parentTopicsData.parentTopics || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Topics Management</h1>
                    <p className="text-gray-400 mt-1">Manage all Java knowledge topics</p>
                </div>
                <Link href="/admin/topics/new" className="btn-primary flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Topic</span>
                </Link>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    {topics.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 mb-4">Chưa có topic nào</p>
                            <Link href="/admin/topics/new" className="btn-primary inline-flex items-center space-x-2">
                                <Plus size={18} />
                                <span>Create First Topic</span>
                            </Link>
                        </div>
                    ) : (
                        <TopicsTable topics={topics} categories={categories} parentTopics={parentTopics} />
                    )}
                </div>
            </div>
        </div>
    );
}