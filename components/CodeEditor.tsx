'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    height?: string;
}

export default function CodeEditor({
    value,
    onChange,
    language = 'java',
    height = '300px'
}: CodeEditorProps) {
    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
            <Editor
                height={height}
                language={language}
                value={value}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                }}
            />
        </div>
    );
}
