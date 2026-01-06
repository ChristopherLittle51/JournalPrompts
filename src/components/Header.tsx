import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <span className="text-2xl text-stone-600">✦</span>
                <h1 className="text-xl font-semibold tracking-tight text-stone-800 serif-font">The Mindful Log</h1>
            </div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium text-stone-500">
                <a href="#generator" className="hover:text-stone-800 transition-colors">Prompt Engine</a>
                <a href="#methodology" className="hover:text-stone-800 transition-colors">Methodology</a>
                <a href="#analytics" className="hover:text-stone-800 transition-colors">Tracking</a>
            </nav>
        </div>
    </header>
  );
};
