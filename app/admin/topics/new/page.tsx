'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import ParentTopicSearch from '@/components/ParentTopicSearch';
import MarkdownTextarea from '@/components/MarkdownTextarea';

interface ContentBlock {
    type: 'text' | 'code';
    value: string;
}

export default function NewTopicPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [parentTopicId, setParentTopicId] = useState('');
    const [parentTopicTitle, setParentTopicTitle] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
        { type: 'text', value: '' }
    ]);

    useEffect(() => {
        fetch('/data/categories.json')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []));
    }, []);

    const addContentBlock = (type: 'text' | 'code') => {
        setContentBlocks([...contentBlocks, { type, value: '' }]);
    };

    const updateContentBlock = (index: number, value: string) => {
        const updated = [...contentBlocks];
        updated[index].value = value;
        setContentBlocks(updated);
    };

    const removeContentBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    parentTopicId,
                    parentTopicTitle,
                    content: contentBlocks,
                    keywords
                })
            });

            const data = await res.json();
            if (data.success) {
                router.push('/admin/topics');
            } else {
                alert('Failed to create topic');
            }
        } catch (error) {
            alert('Error creating topic');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Create New Topic</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Topic Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="E.g., Substring() của String và StringBuilder"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setParentTopicId('');
                            setParentTopicTitle('');
                        }}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Parent Topic */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Parent Topic (Medium-level topic)
                    </label>
                    <ParentTopicSearch
                        value={parentTopicId}
                        onChange={(id, title) => {
                            setParentTopicId(id);
                            setParentTopicTitle(title);
                        }}
                        category={category}
                    />
                    {parentTopicTitle && (
                        <p className="mt-2 text-sm text-gray-400">
                            Selected: <span className="text-blue-400">{parentTopicTitle}</span>
                        </p>
                    )}
                </div>

                {/* Keywords */}
                <div>
                    <label className="block text-sm font-medium mb-2">Keywords</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                            placeholder="Add keyword and press Enter"
                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={addKeyword}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {keywords.map(keyword => (
                            <span
                                key={keyword}
                                className="badge bg-blue-600/20 text-blue-400 flex items-center space-x-2"
                            >
                                <span>{keyword}</span>
                                <button
                                    type="button"
                                    onClick={() => removeKeyword(keyword)}
                                    className="hover:text-red-400"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content Blocks */}
                <div>
                    <label className="block text-sm font-medium mb-2">Content *</label>
                    <div className="h-[75vh] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/50">
                        <div className="sticky top-0 bg-gray-800 z-10 p-3 border-b border-gray-700">
                            <div className="flex items-center justify-end">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addContentBlock('text')}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                                    >
                                        + Text Block
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => addContentBlock('code')}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                                    >
                                        + Code Block
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-4">
                            {contentBlocks.map((block, index) => (
                                <div key={index} className="card">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-400">
                                            {block.type === 'text' ? '📝 Text' : '💻 Code'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeContentBlock(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {block.type === 'text' ? (
                                        <MarkdownTextarea
                                            value={block.value}
                                            onChange={(val) => updateContentBlock(index, val)}
                                            rows={4}
                                            placeholder="Paste từ Word/Docs và giữ nguyên format..."
                                        />
                                    ) : (
                                        <CodeEditor
                                            value={block.value}
                                            onChange={(val) => updateContentBlock(index, val || '')}
                                            language="java"
                                            height="200px"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Save size={20} />
                        <span>{loading ? 'Saving...' : 'Save Topic'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}