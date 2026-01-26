'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownTextProps {
    content: string;
}

export default function MarkdownText({ content }: MarkdownTextProps) {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-3 mt-5" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,

                    // Paragraphs
                    p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,

                    // Lists
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300" {...props} />,
                    li: ({ node, ...props }) => <li className="ml-4" {...props} />,

                    // Tables
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-gray-700 rounded-lg" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-700" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-gray-800/50" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200 border-r border-gray-700 last:border-r-0" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 text-sm text-gray-300 border-r border-gray-700 last:border-r-0" {...props} />,

                    // Links
                    a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,

                    // Strong/Em
                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-gray-200" {...props} />,

                    // Code (inline)
                    code: ({ node, inline, ...props }: any) =>
                        inline ? (
                            <code {...props} />
                        ) : (
                            <code className="block bg-gray-900 p-3 rounded text-sm font-mono text-green-400 overflow-x-auto" {...props} />
                        ),

                    // Blockquote
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 text-gray-400 italic" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
