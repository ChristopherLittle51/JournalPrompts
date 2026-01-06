import React from 'react';

export const Hero: React.FC = () => {
    return (
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
            <h2 className="text-4xl md:text-5xl serif-font text-stone-800 mb-4 leading-tight">
                Intentional journaling, <br/>infinitely varied.
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                A structured routine powered by AI. Generate infinite, deep questions for your daily, weekly, and monthly logs—or ask our Coach for specific guidance.
            </p>
            <div className="flex justify-center">
                <a href="#generator" className="bg-stone-800 text-stone-50 px-8 py-3 rounded-full font-medium transition-all btn-hover">
                    Start Journaling
                </a>
            </div>
        </section>
    );
};
