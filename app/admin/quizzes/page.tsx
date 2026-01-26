import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function QuizzesListPage() {
    const quizzesData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'quizzes.json'), 'utf-8')
    );
    const topicsData = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data', 'topics.json'), 'utf-8')
    );

    const quizzes = quizzesData.quizzes || [];
    const topics = topicsData.topics || [];

    const getTopicById = (id: string) => topics.find((t: any) => t.id === id);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-600/20 text-green-400';
            case 'medium': return 'bg-yellow-600/20 text-yellow-400';
            case 'hard': return 'bg-red-600/20 text-red-400';
            default: return 'bg-gray-600/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Quiz Management</h1>
                    <p className="text-gray-400 mt-1">Manage quiz questions and answers</p>
                </div>
                <Link href="/admin/quizzes/new" className="btn-primary flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Quiz</span>
                </Link>
            </div>

            <div className="space-y-4">
                {quizzes.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-400 mb-4">Chưa có quiz nào</p>
                        <Link href="/admin/quizzes/new" className="btn-primary inline-flex items-center space-x-2">
                            <Plus size={18} />
                            <span>Create First Quiz</span>
                        </Link>
                    </div>
                ) : (
                    quizzes.map((quiz: any) => {
                        const relatedTopic = getTopicById(quiz.relatedTopicId);

                        return (
                            <div key={quiz.id} className="card">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">{quiz.question}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
                                                {quiz.difficulty}
                                            </span>
                                            {relatedTopic && (
                                                <span className="badge bg-blue-600/20 text-blue-400">
                                                    {relatedTopic.title.substring(0, 40)}...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/quizzes/${quiz.id}`}
                                            className="p-2 hover:bg-gray-700 rounded"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button className="p-2 hover:bg-red-900/30 text-red-400 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400 font-medium">✓</span>
                                        <span className="text-green-300">{quiz.correctAnswer}</span>
                                    </div>
                                    {quiz.wrongAnswers?.map((answer: string, index: number) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <span className="text-red-400 font-medium">✗</span>
                                            <span className="text-gray-400">{answer}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
