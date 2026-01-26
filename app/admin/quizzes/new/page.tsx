'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

export default function NewQuizPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);

    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [wrongAnswer1, setWrongAnswer1] = useState('');
    const [wrongAnswer2, setWrongAnswer2] = useState('');
    const [wrongAnswer3, setWrongAnswer3] = useState('');
    const [relatedTopicId, setRelatedTopicId] = useState('');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

    useEffect(() => {
        fetch('/api/topics')
            .then(res => res.json())
            .then(data => setTopics(data.topics || []));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    correctAnswer,
                    wrongAnswers: [wrongAnswer1, wrongAnswer2, wrongAnswer3],
                    relatedTopicId,
                    difficulty
                })
            });

            const data = await res.json();
            if (data.success) {
                router.push('/admin/quizzes');
            } else {
                alert('Failed to create quiz');
            }
        } catch (error) {
            alert('Error creating quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                    <label className="block text-sm font-medium mb-2">Question *</label>
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        rows={3}
                        placeholder="Enter quiz question..."
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Correct Answer */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-green-400">
                        Correct Answer *
                    </label>
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                        placeholder="Enter the correct answer"
                        className="w-full px-4 py-3 bg-green-900/20 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Wrong Answers */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-red-400">
                        Wrong Answers * (3 required)
                    </label>

                    <input
                        type="text"
                        value={wrongAnswer1}
                        onChange={(e) => setWrongAnswer1(e.target.value)}
                        required
                        placeholder="Wrong answer 1"
                        className="w-full px-4 py-3 bg-red-900/20 border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="text"
                        value={wrongAnswer2}
                        onChange={(e) => setWrongAnswer2(e.target.value)}
                        required
                        placeholder="Wrong answer 2"
                        className="w-full px-4 py-3 bg-red-900/20 border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <input
                        type="text"
                        value={wrongAnswer3}
                        onChange={(e) => setWrongAnswer3(e.target.value)}
                        required
                        placeholder="Wrong answer 3"
                        className="w-full px-4 py-3 bg-red-900/20 border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                {/* Related Topic */}
                <div>
                    <label className="block text-sm font-medium mb-2">Related Topic (Optional)</label>
                    <select
                        value={relatedTopicId}
                        onChange={(e) => setRelatedTopicId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">No related topic</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>
                                {topic.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium mb-2">Difficulty *</label>
                    <div className="flex gap-4">
                        {['easy', 'medium', 'hard'].map((level) => (
                            <label key={level} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={level}
                                    checked={difficulty === level}
                                    onChange={(e) => setDifficulty(e.target.value as any)}
                                    className="w-4 h-4"
                                />
                                <span className="capitalize">{level}</span>
                            </label>
                        ))}
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
                        <span>{loading ? 'Saving...' : 'Save Quiz'}</span>
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
