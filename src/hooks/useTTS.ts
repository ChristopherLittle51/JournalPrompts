import { useState } from 'react';
import { addWavHeader } from '../utils/audio';

// Allow API key to be passed or accessed from env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

export function useTTS() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = async (text: string) => {
        if (!text || text.includes("Tell me briefly") || text.includes("Please type")) return;

        setIsSpeaking(true);

        try {
            // Remove quotes for cleaner speech
            const cleanText = text.replace(/"/g, '');

            if (API_KEY) {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: cleanText }] }],
                        generationConfig: {
                            responseModalities: ["AUDIO"],
                            speechConfig: {
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: "Puck" }
                                }
                            }
                        }
                    })
                });

                if (!response.ok) throw new Error('TTS API Error');
                const data = await response.json();
                const audioContent = data.candidates[0].content.parts[0].inlineData.data;

                const audioBytes = Uint8Array.from(atob(audioContent), c => c.charCodeAt(0));
                const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                const audioContext = new AudioContextClass();
                
                const wavBytes = addWavHeader(audioBytes, 24000, 1);
                const audioBuffer = await audioContext.decodeAudioData(wavBytes.buffer as ArrayBuffer);
                
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start(0);
                
                source.onended = () => setIsSpeaking(false);
            } else {
                 // Fallback to Browser Speech Synthesis
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
            }

        } catch (error) {
            console.error("TTS Error", error);
            // Fallback
            const utterance = new SpeechSynthesisUtterance(text.replace(/"/g, ''));
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } finally {
             // In case of error or non-async fallback start, ensure state is reset eventually if not handled by onend
             // But for now, we rely on onend callbacks or quick failures
             if (!API_KEY) {
                 // SpeechSynthesis is synchronous in triggering but async in playing.
             }
        }
    };

    return { speak, isSpeaking };
}
