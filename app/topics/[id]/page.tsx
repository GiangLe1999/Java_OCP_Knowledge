import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Tag } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import MarkdownText from '@/components/MarkdownText';
import fs from 'fs';
import path from 'path';

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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

    const topic = topics.find((t: any) => t.id === id);

    if (!topic) {
        notFound();
    }

    const category = categories.find((c: any) => c.id === topic.category);
    const parentTopic = parentTopics.find((p: any) => p.id === topic.parentTopicId);

    const relatedTopics = topics
        .filter((t: any) =>
            t.id !== topic.id &&
            (t.category === topic.category ||
                t.parentTopicId === topic.parentTopicId ||
                t.keywords?.some((k: string) => topic.keywords?.includes(k)))
        )
        .slice(0, 4);

    // Simple markdown stripper for preview text
    const stripMarkdown = (text: string): string => {
        return text
            .replace(/[*_~`#>\[\]]/g, '')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 100);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Link href="/topics" className="hover:text-blue-400 transition-colors">
                    Topics
                </Link>
                <span>/</span>
                <Link href={`/topics?category=${topic.category}`} className="hover:text-blue-400 transition-colors">
                    {category?.title}
                </Link>
                {parentTopic && (
                    <>
                        <span>/</span>
                        <span className="text-gray-500">{parentTopic.title}</span>
                    </>
                )}
            </div>

            <Link
                href="/topics"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to all topics</span>
            </Link>

            {/* Topic Header */}
            <div>
                <div className="flex items-start space-x-4 mb-4">
                    <div className="text-5xl w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        {category?.icon}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                            {topic.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="badge bg-blue-600/20 text-blue-400">
                                {category?.title}
                            </span>
                            {parentTopic && (
                                <span className="badge bg-purple-600/20 text-purple-400">
                                    {parentTopic.title}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Keywords */}
                {topic.keywords?.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <Tag size={16} className="text-gray-500" />
                        {topic.keywords.map((keyword: string, i: number) => (
                            <span key={i} className="badge bg-gray-800 text-gray-300">
                                {keyword}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Topic Content */}
            <div className="card">
                <div className="space-y-6">
                    {topic.content?.map((block: any, index: number) => (
                        <div key={index}>
                            {block.type === 'text' ? (
                                <MarkdownText content={block.value} />
                            ) : block.type === 'code' ? (
                                <CodeBlock code={block.value} language="java" />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            {/* Related Topics */}
            {relatedTopics.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Related Topics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedTopics.map((relTopic: any) => {
                            const relCategory = categories.find((c: any) => c.id === relTopic.category);

                            return (
                                <Link
                                    key={relTopic.id}
                                    href={`/topics/${relTopic.id}`}
                                    className="card group"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">{relCategory?.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                {relTopic.title}
                                            </h3>
                                            {relTopic.content && relTopic.content[0] && (
                                                <p className="text-gray-400 text-sm line-clamp-2">
                                                    {relTopic.content[0].type === 'text'
                                                        ? stripMarkdown(relTopic.content[0].value) + '...'
                                                        : 'Code example...'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
