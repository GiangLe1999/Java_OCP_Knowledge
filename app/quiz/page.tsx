'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function QuizPage() {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('/api/quizzes');
                const data = await res.json();
                setQuizzes(data.quizzes || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowResult(true);

        if (answer === quizzes[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion + 1 < quizzes.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizComplete(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizComplete(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 mb-4">No quiz questions available</p>
                <p className="text-sm text-gray-500">Add quiz questions in the admin panel first</p>
            </div>
        );
    }

    if (quizComplete) {
        const percentage = Math.round((score / quizzes.length) * 100);

        return (
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <Trophy size={80} className="mx-auto text-yellow-500" />
                <h1 className="text-4xl md:text-5xl font-bold">
                    Quiz <span className="text-gradient">Complete!</span>
                </h1>

                <div className="card bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50">
                    <div className="text-6xl font-bold text-gradient mb-4">
                        {percentage}%
                    </div>
                    <p className="text-xl text-gray-300 mb-2">
                        You scored {score} out of {quizzes.length}
                    </p>
                    <p className="text-gray-400">
                        {percentage >= 80 ? 'Excellent work! 🎉' :
                            percentage >= 60 ? 'Good job! Keep practicing! 👍' :
                                'Keep learning! You\'ll get better! 💪'}
                    </p>
                </div>

                <button
                    onClick={restartQuiz}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                >
                    <RotateCcw size={20} />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    const question = quizzes[currentQuestion];
    const allAnswers = [...(question.wrongAnswers || []), question.correctAnswer]
        .sort(() => Math.random() - 0.5);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-gradient">Java Quiz</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Test your knowledge
                </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Question {currentQuestion + 1} of {quizzes.length}</span>
                <span>Score: {score}/{quizzes.length}</span>
            </div>

            <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
                />
            </div>

            <div className="card bg-gradient-to-br from-gray-900 to-gray-800">
                <h2 className="text-xl md:text-2xl font-semibold mb-6">
                    {question.question}
                </h2>

                <div className="space-y-3">
                    {allAnswers.map((answer, index) => {
                        const isSelected = selectedAnswer === answer;
                        const isCorrect = answer === question.correctAnswer;
                        const showCorrect = showResult && isCorrect;
                        const showWrong = showResult && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => !showResult && handleAnswer(answer)}
                                disabled={showResult}
                                className={`w-full p-4 rounded-lg text-left transition-all font-medium ${showCorrect
                                        ? 'bg-green-600/30 border-2 border-green-500 text-green-300'
                                        : showWrong
                                            ? 'bg-red-600/30 border-2 border-red-500 text-red-300'
                                            : isSelected
                                                ? 'bg-blue-600/30 border-2 border-blue-500'
                                                : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{answer}</span>
                                    {showCorrect && <CheckCircle size={24} className="text-green-500" />}
                                    {showWrong && <XCircle size={24} className="text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <button onClick={nextQuestion} className="btn-primary w-full">
                            {currentQuestion + 1 === quizzes.length ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
