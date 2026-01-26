'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme
import 'prismjs/components/prism-java';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = 'java' }: CodeBlockProps) {
    useEffect(() => {
        Prism.highlightAll();
    }, [code]);

    return (
        <pre className="rounded-lg overflow-x-auto">
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
}
