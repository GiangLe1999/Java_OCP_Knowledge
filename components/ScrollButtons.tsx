'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ScrollButtons() {
    const [position, setPosition] = useState<'top' | 'middle' | 'bottom'>('top');

    useEffect(() => {
        const handleScroll = () => {
            const isTop = window.scrollY < 50;
            // Check if the user is within 50px of the bottom
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            // Check if the page is scrollable at all
            const isScrollable = document.documentElement.scrollHeight > window.innerHeight;

            if (!isScrollable) {
                setPosition('top'); // Or some other default for non-scrollable pages
            } else if (isTop) {
                setPosition('top');
            } else if (isBottom) {
                setPosition('bottom');
            } else {
                setPosition('middle');
            }
        };

        // Add event listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center space-y-3">
            {/* Show Scroll to Top button when not at the top */}
            {(position === 'middle' || position === 'bottom') && (
                <button
                    onClick={scrollToTop}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 animate-fade-in"
                    title="Scroll to Top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
            
            {/* Show Scroll to Bottom button when not at the bottom */}
            {(position === 'middle' || position === 'top') && (
                <button
                    onClick={scrollToBottom}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 animate-fade-in"
                    title="Scroll to Bottom"
                >
                    <ArrowDown size={24} />
                </button>
            )}
        </div>
    );
}