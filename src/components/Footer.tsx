import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-stone-200 mt-auto py-8">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <p className="text-stone-500 text-sm">
                    Designed for the mindful minimalist. No data is stored; all prompts are generated locally.
                </p>
                <p className="text-stone-400 text-xs mt-2">
                    © 2024 The Mindful Log
                </p>
            </div>
        </footer>
    );
};
