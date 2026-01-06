import React from 'react';

export const Methodology: React.FC = () => {
    return (
        <section id="methodology" className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                    <h3 className="text-3xl serif-font mb-6 text-stone-800">The Architecture of Reflection</h3>
                    <p className="mb-4 text-stone-600 leading-relaxed">
                        A bullet journal fails when it becomes a chore. This system divides reflection into three distinct energy levels tailored to your natural rhythm.
                    </p>
                    <ul className="space-y-4 mt-6">
                        <li className="flex items-start">
                            <span className="mr-3 text-stone-400 text-xl">01</span>
                            <div>
                                <h4 className="font-semibold text-stone-800">The Daily Rapid Log</h4>
                                <p className="text-sm text-stone-600 mt-1">Short, actionable inputs. Focus on "What is happening?" and "How do I want to feel?". Takes &lt; 5 minutes.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-stone-400 text-xl">02</span>
                            <div>
                                <h4 className="font-semibold text-stone-800">The Weekly Review</h4>
                                <p className="text-sm text-stone-600 mt-1">Tactical analysis. Closing open loops, migrating tasks, and checking alignment with immediate goals.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-stone-400 text-xl">03</span>
                            <div>
                                <h4 className="font-semibold text-stone-800">The Monthly Deep Dive</h4>
                                <p className="text-sm text-stone-600 mt-1">Strategic overhaul. A time to question the path itself, not just the steps. Requires 30+ minutes of deep work.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                
                {/* Quick Tips Card */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
                    <h4 className="text-xl serif-font mb-4">When you feel "Stumped"</h4>
                    <p className="text-stone-600 mb-6 text-sm">
                        Writer's block in journaling usually means you are judging your thoughts before you write them. The "Stumped" mode in the engine above uses lateral thinking prompts to bypass your internal editor.
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-200 p-4">
                        <p className="text-sm text-amber-900 italic">
                            "The goal is not to write something profound. The goal is simply to keep the ink flowing until the truth comes out."
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
