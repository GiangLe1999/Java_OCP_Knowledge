'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

interface ParentTopic {
    id: string;
    title: string;
    category: string;
}

interface ParentTopicSearchProps {
    value: string;
    onChange: (id: string, title: string) => void;
    category: string;
}

export default function ParentTopicSearch({ value, onChange, category }: ParentTopicSearchProps) {
    const [search, setSearch] = useState('');
    const [parentTopics, setParentTopics] = useState<ParentTopic[]>([]);
    const [filteredTopics, setFilteredTopics] = useState<ParentTopic[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateNew, setShowCreateNew] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    useEffect(() => {
        fetch('/api/parent-topics')
            .then(res => res.json())
            .then(data => {
                setParentTopics(data.parentTopics || []);
            });
    }, []);

    useEffect(() => {
        const filtered = parentTopics.filter(topic =>
            topic.title.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || topic.category === category)
        );
        setFilteredTopics(filtered);
        setShowCreateNew(search.length > 0 && filtered.length === 0);
    }, [search, parentTopics, category]);

    const handleSelect = (topic: ParentTopic) => {
        onChange(topic.id, topic.title);
        setSearch(topic.title);
        setIsOpen(false);
    };

    const handleCreateNew = async () => {
        if (!newTopicTitle.trim() || !category) return;

        try {
            const res = await fetch('/api/parent-topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTopicTitle,
                    category: category,
                    description: ''
                })
            });

            const data = await res.json();
            if (data.success) {
                setParentTopics([...parentTopics, data.parentTopic]);
                onChange(data.parentTopic.id, data.parentTopic.title);
                setSearch(data.parentTopic.title);
                setNewTopicTitle('');
                setShowCreateNew(false);
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Failed to create parent topic:', error);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search or create parent topic..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        {filteredTopics.length > 0 ? (
                            filteredTopics.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => handleSelect(topic)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                                >
                                    <div className="font-medium">{topic.title}</div>
                                    <div className="text-sm text-gray-400">{topic.category}</div>
                                </button>
                            ))
                        ) : showCreateNew ? (
                            <div className="p-4">
                                <p className="text-sm text-gray-400 mb-3">No parent topic found. Create new?</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTopicTitle}
                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                        placeholder="Enter parent topic title"
                                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleCreateNew()}
                                    />
                                    <button
                                        onClick={handleCreateNew}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center space-x-2"
                                    >
                                        <Plus size={16} />
                                        <span>Create</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-sm text-gray-400 text-center">
                                {category ? 'No parent topics found' : 'Please select a category first'}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
