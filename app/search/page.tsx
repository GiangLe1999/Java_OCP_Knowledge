'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Filter } from 'lucide-react';

export default function SearchPage() {
    const [topics, setTopics] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [topicsRes, categoriesRes] = await Promise.all([
                    fetch('/api/topics'),
                    fetch('/data/categories.json')
                ]);

                setTopics((await topicsRes.json()).topics || []);
                setCategories((await categoriesRes.json()).categories || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const highlightText = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={i} className="bg-yellow-500/30 text-yellow-300 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const filteredTopics = topics.filter(topic => {
        const matchesSearch = !searchTerm ||
            topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.keywords?.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
            topic.content?.some((c: any) =>
                c.type === 'text' && c.value.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-gradient">Search</span> Topics
                </h1>
                <p className="text-gray-400 text-lg">
                    Find Java topics instantly
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
                <input
                    type="text"
                    placeholder="Search by title, keywords, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full pl-14 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
            </div>

            {/* Category Filter */}
            <div>
                <div className="flex items-center space-x-2 mb-3">
                    <Filter size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-400">Filter by category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${selectedCategory === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all flex items-center space-x-1 ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-400">
                {searchTerm ? (
                    <>Found {filteredTopics.length} result{filteredTopics.length !== 1 ? 's' : ''} for "{searchTerm}"</>
                ) : (
                    <>Showing all {filteredTopics.length} topics</>
                )}
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Searching...</p>
                </div>
            ) : filteredTopics.length === 0 ? (
                <div className="text-center py-16">
                    <SearchIcon size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No topics found</p>
                    <p className="text-gray-500 text-sm">Try different keywords or clear filters</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTopics.map((topic) => {
                        const category = categories.find(c => c.id === topic.category);
                        const preview = topic.content?.find((c: any) => c.type === 'text')?.value || '';

                        return (
                            <Link
                                key={topic.id}
                                href={`/topics/${topic.id}`}
                                className="card block hover:border-blue-500/50 transition-all group"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-3xl">{category?.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                            {highlightText(topic.title, searchTerm)}
                                        </h3>

                                        {preview && (
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {highlightText(preview.substring(0, 200), searchTerm)}
                                                {preview.length > 200 && '...'}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            <span className="badge bg-blue-600/20 text-blue-400 text-xs">
                                                {category?.title}
                                            </span>
                                            {topic.keywords?.slice(0, 3).map((keyword: string, i: number) => (
                                                <span key={i} className="badge bg-gray-800 text-gray-400 text-xs">
                                                    {highlightText(keyword, searchTerm)}
                                                </span>
                                            ))}
                                            {topic.keywords?.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{topic.keywords.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
