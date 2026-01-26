import Link from 'next/link';
import { BookOpen, Brain, Award, Search, ArrowRight } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const topicsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'topics.json'), 'utf-8')
  );
  const categoriesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'categories.json'), 'utf-8')
  );
  const quizzesData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'quizzes.json'), 'utf-8')
  );

  const topics = topicsData.topics || [];
  const categories = categoriesData.categories || [];
  const quizzes = quizzesData.quizzes || [];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Master Java with
          <br />
          <span className="text-gradient">Interactive Learning</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Comprehensive Java OCA & OCP knowledge base with flashcards, quizzes, and code examples
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/topics" className="btn-primary flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Browse Topics</span>
          </Link>
          <Link href="/quiz" className="btn-secondary flex items-center space-x-2">
            <Award size={20} />
            <span>Take Quiz</span>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center bg-gradient-to-br from-blue-600/10 to-blue-600/5 border-blue-500/30">
          <BookOpen size={40} className="mx-auto mb-4 text-blue-400" />
          <div className="text-4xl font-bold mb-2">{topics.length}</div>
          <div className="text-gray-400">Topics</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-purple-500/30">
          <Brain size={40} className="mx-auto mb-4 text-purple-400" />
          <div className="text-4xl font-bold mb-2">{categories.length}</div>
          <div className="text-gray-400">Categories</div>
        </div>
        <div className="card text-center bg-gradient-to-br from-green-600/10 to-green-600/5 border-green-500/30">
          <Award size={40} className="mx-auto mb-4 text-green-400" />
          <div className="text-4xl font-bold mb-2">{quizzes.length}</div>
          <div className="text-gray-400">Quiz Questions</div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Explore <span className="text-gradient">Categories</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: any) => {
            const topicCount = topics.filter((t: any) => t.category === category.id).length;

            return (
              <Link
                key={category.id}
                href={`/topics?category=${category.id}`}
                className="card-gradient group"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{topicCount} topics</span>
                  <ArrowRight
                    size={20}
                    className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Learning <span className="text-gradient">Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Search size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3">Smart Search</h3>
            <p className="text-gray-400">
              Find topics instantly with powerful search and filtering by keywords and categories
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
              <Brain size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3">Interactive Flashcards</h3>
            <p className="text-gray-400">
              Practice with flip cards featuring questions on front and detailed explanations with code on back
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
              <Award size={32} />
            </div>
            <h3 className="font-bold text-xl mb-3">Challenge Yourself</h3>
            <p className="text-gray-400">
              Test your knowledge with interactive quizzes and get instant feedback on your answers
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center card bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Begin your Java certification journey with {topics.length} curated topics
        </p>
        <Link href="/topics" className="btn-primary inline-flex items-center space-x-2">
          <BookOpen size={20} />
          <span>Start Learning Now</span>
        </Link>
      </section>
    </div>
  );
}
