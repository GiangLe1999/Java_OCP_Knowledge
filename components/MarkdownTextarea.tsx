'use client';

import { useRef, useState } from 'react';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

interface MarkdownTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
}

export default function MarkdownTextarea({
    value,
    onChange,
    placeholder = 'Enter text content...',
    rows = 4,
    className = ''
}: MarkdownTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showPasteHint, setShowPasteHint] = useState(false);

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const clipboardData = e.clipboardData;
        const htmlData = clipboardData.getData('text/html');

        // If there's HTML data (from Word, Google Docs, etc.)
        if (htmlData) {
            e.preventDefault();

            // Clean HTML before conversion
            const cleanHtml = cleanWordHtml(htmlData);

            // Convert HTML to Markdown
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                bulletListMarker: '-',
                codeBlockStyle: 'fenced',
                emDelimiter: '*',
                strongDelimiter: '**'
            });

            // Add GFM (GitHub Flavored Markdown) for tables support
            turndownService.use(gfm);

            // Remove Word comments and other unwanted elements
            turndownService.remove(['style', 'script', 'head', 'meta', 'link']);

            // Convert HTML to Markdown
            let markdown = turndownService.turndown(cleanHtml);

            // Post-processing to normalize bullets and spacing
            markdown = markdown
                // Replace common bullet characters with hyphen-space
                .replace(/^[ \t]*[•●○·][ \t]*/gm, '- ')
                // Ensure proper spacing for list items (if turndown missed it or weird HTML)
                .replace(/^(\s*)-([^\s])/gm, '$1- $2');

            // Insert markdown at cursor position
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newValue = value.substring(0, start) + markdown + value.substring(end);
                onChange(newValue);

                // Set cursor position after inserted text
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
                    textarea.focus();
                }, 0);
            }

            // Show hint
            setShowPasteHint(true);
            setTimeout(() => setShowPasteHint(false), 3000);
        }
        // Otherwise, let default paste behavior happen
    };

    // Clean Word HTML to remove metadata and unwanted styles
    const cleanWordHtml = (html: string): string => {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Remove Word-specific elements
        const elementsToRemove = tempDiv.querySelectorAll('style, script, meta, link, xml, o\\:p, w\\:sdt');
        elementsToRemove.forEach(el => el.remove());

        // Remove Word comments (<!--[if ...]> format)
        let cleanedHtml = tempDiv.innerHTML;
        cleanedHtml = cleanedHtml.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
        cleanedHtml = cleanedHtml.replace(/<!--[\s\S]*?-->/g, '');

        // Remove inline styles but keep structure
        tempDiv.innerHTML = cleanedHtml;
        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach(el => {
            // Remove all attributes except meaningful ones
            const attrs = Array.from(el.attributes);
            attrs.forEach(attr => {
                if (!['href', 'src', 'alt', 'title'].includes(attr.name)) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        return tempDiv.innerHTML;
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={handlePaste}
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            />

            {showPasteHint && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-fade-in">
                    ✓ Converted to Markdown
                </div>
            )}

            <div className="mt-2 text-xs text-gray-500">
                💡 Tip: Paste từ Word/Google Docs sẽ tự động convert sang Markdown (giữ lists, bold, tables...)
            </div>
        </div>
    );
}
