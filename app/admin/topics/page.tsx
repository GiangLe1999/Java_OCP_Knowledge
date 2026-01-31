import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import fs from 'fs';
import path from 'path';

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

    const getCategoryById = (id: string) => categories.find((c: any) => c.id === id);
    const getParentTopicById = (id: string) => parentTopics.find((p: any) => p.id === id);

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
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left py-3 px-4">Title</th>
                                    <th className="text-left py-3 px-4">Category</th>
                                    <th className="text-left py-3 px-4">Parent Topic</th>
                                    <th className="text-left py-3 px-4">Keywords</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topics.map((topic: any) => {
                                    const category = getCategoryById(topic.category);
                                    const parentTopic = getParentTopicById(topic.parentTopicId);

                                    return (
                                        <tr key={topic.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                            <td className="py-3 px-4">
                                                <div className="font-medium">{topic.title}</div>
                                                <div className="text-xs text-gray-500">ID: {topic.id}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {category && (
                                                    <span className="badge bg-blue-600/20 text-blue-400">
                                                        {category.icon} {category.title}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {parentTopic ? (
                                                    <span className="text-sm text-gray-300">{parentTopic.title}</span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {topic.keywords?.slice(0, 3).map((keyword: string, i: number) => (
                                                        <span key={i} className="text-xs badge bg-gray-700 text-gray-300">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                    {topic.keywords?.length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{topic.keywords.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/topics/${topic.id}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-gray-700 rounded"
                                                        title="View Topic"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/topics/${topic.id}`}
                                                        className="p-2 hover:bg-gray-700 rounded"
                                                        title="Edit Topic"
                                                    >
                                                        <Edit size={16} />
                                                    </Link>
                                                    <button className="p-2 hover:bg-red-900/30 text-red-400 rounded" title="Delete Topic">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
