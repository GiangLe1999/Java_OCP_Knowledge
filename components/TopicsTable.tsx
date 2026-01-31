'use client';

import Link from 'next/link';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function TopicsTable({ topics, categories, parentTopics }: { topics: any[], categories: any[], parentTopics: any[] }) {

    const getCategoryById = (id: string) => categories.find((c: any) => c.id === id);
    const getParentTopicById = (id: string) => parentTopics.find((p: any) => p.id === id);

    return (
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
    );
}
