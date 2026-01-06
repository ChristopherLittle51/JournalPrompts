import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type TooltipItem, type ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useGemini } from '../hooks/useGemini';
import { Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#a8a29e';

const LABELS = ['Gratitude', 'Anxiety', 'Work Focus', 'Health', 'Creativity', 'Family'];

export const Analytics: React.FC = () => {
    const { analyzeLog, loading } = useGemini();
    const [logInput, setLogInput] = useState('');
    const [result, setResult] = useState<{ category: string, insight: string } | null>(null);
    
    // Store data in state. In a real app, this would be persistent.
    const [chartData, setChartData] = useState<number[]>([24, 12, 18, 20, 8, 15]);

    const handleAnalyze = async () => {
        if (!logInput.trim()) return;

        const analysis = await analyzeLog(logInput);
        if (analysis) {
            setResult(analysis);
            
            // Update Chart
            const index = LABELS.indexOf(analysis.category);
            if (index !== -1) {
                const newData = [...chartData];
                newData[index] += 1;
                setChartData(newData);
            }
        }
    };

    const data = {
        labels: LABELS,
        datasets: [{
            label: 'Entries this Month',
            data: chartData,
            backgroundColor: [
                '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c'
            ],
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#292524',
                titleFont: { family: 'Lora', size: 14 },
                bodyFont: { family: 'Inter', size: 13 },
                padding: 12,
                displayColors: false,
                callbacks: { label: function(context: TooltipItem<'bar'>) { return ` ${context.parsed.y} Entries`; } }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#44403c', borderDash: [4, 4] },
                ticks: { color: '#a8a29e' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#d6d3d1' }
            }
        }
    };

    return (
        <section id="analytics" className="bg-stone-900 text-stone-100 py-16 mt-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Context + Analyzer */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div>
                            <h3 className="text-3xl serif-font mb-4 text-stone-50">Visualizing Your Growth</h3>
                            <p className="text-stone-400 mb-4 text-sm">
                                Track categorical themes in your entries (e.g., Focus, Anxiety, Gratitude) to spot patterns over time.
                            </p>
                        </div>

                        {/* Analyzer Card */}
                        <div className="bg-stone-800 rounded-lg p-5 border border-stone-700">
                            <h4 className="text-amber-400 text-sm font-semibold mb-2 uppercase tracking-wide flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Rapid Log Analyzer
                            </h4>
                            <p className="text-stone-400 text-xs mb-3">Paste a quick summary of your day below. The AI will categorize it and add it to the chart.</p>
                            <textarea 
                                value={logInput}
                                onChange={(e) => setLogInput(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded p-2 text-stone-300 text-sm mb-3 focus:outline-none focus:border-amber-700" 
                                rows={3} 
                                placeholder="e.g., Had a tough meeting but proud I stayed calm..."
                            />
                            <button 
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-amber-800 hover:bg-amber-900 text-amber-100 py-2 rounded text-sm font-medium transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-amber-100/30 border-l-amber-100 rounded-full animate-spin" /> : 'Analyze & Track'}
                            </button>
                            
                            {/* Result Area */}
                            {result && (
                                <div className="mt-4 pt-4 border-t border-stone-700 fade-in">
                                    <div className="text-xs text-stone-500 uppercase mb-1">Theme Detected</div>
                                    <div className="text-white font-semibold mb-2">{result.category}</div>
                                    <div className="text-xs text-stone-500 uppercase mb-1">Insight</div>
                                    <div className="text-stone-300 text-sm italic leading-relaxed">"{result.insight}"</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column: Chart */}
                    <div className="md:col-span-2 bg-stone-800 rounded-xl p-6 border border-stone-700 flex flex-col justify-center min-h-[350px]">
                        <div className="w-full h-[300px] md:h-[350px]">
                            <Bar data={data} options={options as ChartOptions<'bar'>} />
                        </div>
                        <div className="mt-4 text-center text-xs text-stone-500">
                            *Chart updates dynamically when you use the Analyzer
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
