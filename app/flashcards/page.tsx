'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import MarkdownText from '@/components/MarkdownText';

export default function FlashcardsPage() {
    const [topics, setTopics] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
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

    const filteredTopics = selectedCategory === 'all'
        ? topics
        : topics.filter(t => t.category === selectedCategory);

    const currentTopic = filteredTopics[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % filteredTopics.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + filteredTopics.length) % filteredTopics.length);
    };

    const shuffle = () => {
        const randomIndex = Math.floor(Math.random() * filteredTopics.length);
        setCurrentIndex(randomIndex);
        setIsFlipped(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading flashcards...</p>
                </div>
            </div>
        );
    }

    if (filteredTopics.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 mb-4">No topics available for flashcards</p>
                <p className="text-sm text-gray-500">Add some topics in the admin panel first</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-gradient">Flashcards</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Review Java concepts with interactive flashcards
                </p>
            </div>

            {/* Category Selection */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button
                    onClick={() => {
                        setSelectedCategory('all');
                        setCurrentIndex(0);
                        setIsFlipped(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                >
                    All ({topics.length})
                </button>
                {categories.map((category) => {
                    const count = topics.filter(t => t.category === category.id).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setCurrentIndex(0);
                                setIsFlipped(false);
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${selectedCategory === category.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.title} ({count})</span>
                        </button>
                    );
                })}
            </div>

            <div className="text-center text-gray-400">
                Card {currentIndex + 1} of {filteredTopics.length}
            </div>

            {/* Flashcard */}
            <div className="perspective-1000">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                        }`}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}>
                        <div className="card h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50">
                            <div className="text-sm text-gray-400 mb-4">Question</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
                                {currentTopic?.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {currentTopic?.keywords?.slice(0, 3).map((keyword: string, i: number) => (
                                    <span key={i} className="badge bg-blue-600/30 text-blue-300">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute bottom-8 text-gray-500 text-sm">
                                Click to flip
                            </div>
                        </div>
                    </div>

                    {/* Back */}
                    <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}`}>
                        <div className="card h-full flex flex-col p-8 bg-gradient-to-br from-green-600/20 to-cyan-600/20 border-2 border-green-500/50 overflow-y-auto">
                            <div className="text-sm text-gray-400 mb-4 text-center">Answer</div>
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {currentTopic?.content?.map((block: any, i: number) => (
                                    <div key={i}>
                                        {block.type === 'text' ? (
                                            <div className="text-sm">
                                                <MarkdownText content={block.value} />
                                            </div>
                                        ) : block.type === 'code' ? (
                                            <div className="text-xs">
                                                <CodeBlock code={block.value} language="java" />
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center text-gray-500 text-sm mt-4">
                                Click to flip back
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
                <button onClick={prevCard} className="btn-secondary flex items-center space-x-2">
                    <ChevronLeft size={20} />
                    <span>Previous</span>
                </button>

                <button onClick={shuffle} className="btn-secondary flex items-center space-x-2">
                    <Shuffle size={20} />
                    <span>Shuffle</span>
                </button>

                <button onClick={nextCard} className="btn-secondary flex items-center space-x-2">
                    <span>Next</span>
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
