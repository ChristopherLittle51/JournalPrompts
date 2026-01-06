import { useState } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Fallback data
const fallbackPrompts: Record<string, string[]> = {
    daily: [ "What is one thing I have the power to control today?", "What would make today feel like a success?", "Who can I support or encourage today?" ],
    weekly: [ "What was my biggest win this week?", "Where did I waste the most time this week?", "Did I live by my core values this week?" ],
    monthly: [ "How have I changed in the last 30 days?", "What goals are no longer relevant?", "What was the dominant emotion of this month?" ],
    stumped: [ "Describe the room you are in right now in extreme detail.", "List 10 things that are blue.", "What is a problem you solved recently?" ],
    ai: [ "Start by describing your situation above..." ]
};

const categorySystemPrompts: Record<string, string> = {
    daily: "Generate a single, deep, introspective journaling prompt for a Daily Log. Focus on gratitude, stoicism, intention setting, or immediate reflection. Keep it under 20 words. Do not give advice, just the question.",
    weekly: "Generate a single, tactical journaling prompt for a Weekly Review. Focus on analyzing the past week's performance, habits, wins, or preparing for the next week. Keep it under 25 words. Do not give advice, just the question.",
    monthly: "Generate a single, strategic journaling prompt for a Monthly Reset. Focus on long-term goals, life trajectory, emotional patterns, or big-picture alignment. Keep it under 25 words. Do not give advice, just the question.",
    stumped: "Generate a single, creative lateral-thinking journaling prompt to cure writer's block. Focus on sensory details, simple lists, childhood memories, or hypothetical scenarios. Keep it fun and low-pressure. Keep it under 20 words."
};

export type AnalyzeResult = {
    category: string;
    insight: string;
};

export function useGemini() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePrompt = async (category: string, userContext?: string): Promise<string> => {
        setLoading(true);
        setError(null);
        let instruction = "";

        if (category === 'ai') {
            if (!userContext) {
                setLoading(false);
                return "Please type a little context first so I can help.";
            }
            instruction = `You are a stoic, mindful journaling assistant. The user provides this context: "${userContext}". Ask ONE deep, introspective question that helps them explore this feeling or situation. Do not give advice. Do not be preachy. Keep it under 2 sentences. The output should be just the question.`;
        } else {
            instruction = categorySystemPrompts[category] + " Ensure the response is unique and thoughtful.";
        }

        try {
            if (!API_KEY) throw new Error("No API Key");

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: instruction }]
                    }]
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text.trim();
            // Remove quotes if present
            return aiText.replace(/^"|"$/g, '');

        } catch (err) {
            console.error(err);
             // Fallback
             if (category !== 'ai') {
                const pool = fallbackPrompts[category];
                const randomIndex = Math.floor(Math.random() * pool.length);
                setError("Offline mode: Showing curated prompt.");
                return pool[randomIndex];
            } else {
                setError("The AI is meditating (server busy or no key). Try again.");
                return "Start by describing your situation above...";
            }
        } finally {
            setLoading(false);
        }
    };

    const digDeeper = async (currentPrompt: string): Promise<string | null> => {
        if (currentPrompt.includes("Start by describing") || currentPrompt.includes("Please type")) return null;
        
        setLoading(true);
        try {
             if (!API_KEY) throw new Error("No API Key");
             
             const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `The current journaling prompt is: ${currentPrompt}. The user is stumped or wants to go deeper. Provide a single follow-up question that asks "Why" or probes the underlying root cause of this topic. Keep it short, kind, but piercing. Output ONLY the question.`
                        }]
                    }]
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return data.candidates[0].content.parts[0].text.replace(/^"|"$/g, '');

        } catch (err) {
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const analyzeLog = async (logText: string): Promise<AnalyzeResult | null> => {
        if (!logText) return null;
        setLoading(true);

        try {
            if (!API_KEY) throw new Error("No API Key");

            const prompt = `Analyze this journal entry: "${logText}". 
            1. Classify it into exactly one of these categories: Gratitude, Anxiety, Work Focus, Health, Creativity, Family. 
            2. Provide a one-sentence stoic or mindful insight about this entry. 
            Return strictly JSON: { "category": "CategoryName", "insight": "Your insight here" }`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return JSON.parse(data.candidates[0].content.parts[0].text);

        } catch (err) {
             console.error("Analysis failed", err);
             setError("Could not analyze log. Try again.");
             return null;
        } finally {
            setLoading(false);
        }
    };

    return { generatePrompt, digDeeper, analyzeLog, loading, error };
}
