'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Grid, List } from 'lucide-react';

export default function TopicsPage() {
    const [topics, setTopics] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [parentTopics, setParentTopics] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [topicsRes, categoriesRes, parentTopicsRes] = await Promise.all([
                    fetch('/api/topics'),
                    fetch('/data/categories.json'),
                    fetch('/api/parent-topics')
                ]);

                const topicsData = await topicsRes.json();
                const categoriesData = await categoriesRes.json();
                const parentTopicsData = await parentTopicsRes.json();

                setTopics(topicsData.topics || []);
                setCategories(categoriesData.categories || []);
                setParentTopics(parentTopicsData.parentTopics || []);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getCategoryById = (id: string) => categories.find(c => c.id === id);
    const getParentTopicById = (id: string) => parentTopics.find(p => p.id === id);

    // Strip markdown syntax for preview text
    const stripMarkdown = (text: string): string => {
        return text
            .replace(/[*_~`#>\[\]]/g, '')  // Remove markdown symbols
            .replace(/\n+/g, ' ')           // Replace newlines with space
            .replace(/\s+/g, ' ')           // Normalize spaces
            .trim();
    };

    const filteredTopics = topics.filter(topic => {
        const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
        const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.keywords?.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading topics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Browse <span className="text-gradient">Java Topics</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Explore {topics.length} topics across {categories.length} categories
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search topics by title or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    All Categories
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        <span>{category.icon}</span>
                        <span>{category.title}</span>
                    </button>
                ))}
            </div>

            <div className="text-gray-400">
                Showing {filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'}
            </div>

            {/* Topics Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.map((topic) => {
                        const category = getCategoryById(topic.category);
                        const parentTopic = getParentTopicById(topic.parentTopicId);

                        return (
                            <Link
                                key={topic.id}
                                href={`/topics/${topic.id}`}
                                className="card-gradient group"
                            >
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className="text-2xl">{category?.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                            {topic.title}
                                        </h3>
                                        {parentTopic && (
                                            <p className="text-xs text-gray-500 mb-2">{parentTopic.title}</p>
                                        )}
                                    </div>
                                </div>

                                {topic.content && topic.content[0] && (
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {topic.content[0].type === 'text' ? stripMarkdown(topic.content[0].value).substring(0, 150) : 'Code example...'}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <span className="badge bg-blue-600/20 text-blue-400 text-xs">
                                        {category?.title}
                                    </span>
                                    {topic.keywords?.slice(0, 2).map((keyword: string, i: number) => (
                                        <span key={i} className="badge bg-gray-800 text-gray-400 text-xs">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTopics.map((topic) => {
                        const category = getCategoryById(topic.category);
                        const parentTopic = getParentTopicById(topic.parentTopicId);

                        return (
                            <Link
                                key={topic.id}
                                href={`/topics/${topic.id}`}
                                className="card flex items-center space-x-4 group"
                            >
                                <div className="text-3xl">{category?.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                                        {topic.title}
                                    </h3>
                                    {parentTopic && (
                                        <p className="text-xs text-gray-500 mb-1">{parentTopic.title}</p>
                                    )}
                                    {topic.content && topic.content[0] && (
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {topic.content[0].type === 'text' ? stripMarkdown(topic.content[0].value).substring(0, 200) : 'Code example...'}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className="badge bg-blue-600/20 text-blue-400 text-xs">
                                        {category?.title}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {filteredTopics.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-400 text-lg">No topics found matching your criteria.</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        className="mt-4 text-blue-400 hover:text-blue-300"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
