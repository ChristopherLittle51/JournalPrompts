import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity, PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.color = '#a8a29e';

const LABELS = ['Daily', 'Weekly', 'Monthly', 'Unblock', 'AI Chat'];

export const Analytics: React.FC = () => {
    const { user } = useAuth();
    const [loadingData, setLoadingData] = useState(true);
    
    const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0]);
    const [emotionData, setEmotionData] = useState<Record<string, number>>({});
    const [timelineData, setTimelineData] = useState<{ labels: string[], datasets: { label: string; data: number[]; backgroundColor: string }[] }>({ labels: [], datasets: [] });

    React.useEffect(() => {
        if (!user) return;
        
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('entries')
                    .select('category, sentiment, created_at')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: true }); // Order by date for timeline

                if (error) throw error;

                // 1. Category Chart Logic
                const mapping = { 'daily': 0, 'weekly': 1, 'monthly': 2, 'stumped': 3, 'ai': 4 };
                const newCounts = [0, 0, 0, 0, 0];
                
                // 2. Emotion Logic
                const emotionCounts: Record<string, number> = {};
                const timelineMap: Record<string, Record<string, number>> = {}; // Date -> { Happy: 1, Sad: 2 }

                data?.forEach(entry => {
                    // Category
                    const idx = mapping[entry.category as keyof typeof mapping];
                    if (idx !== undefined) newCounts[idx]++;

                    // Emotion
                    if (entry.sentiment) {
                        const sent = entry.sentiment;
                        emotionCounts[sent] = (emotionCounts[sent] || 0) + 1;

                        // Timeline
                        const date = new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        if (!timelineMap[date]) timelineMap[date] = {};
                        timelineMap[date][sent] = (timelineMap[date][sent] || 0) + 1;
                    }
                });
                
                setChartData(newCounts);
                setEmotionData(emotionCounts);

                // Prepare Timeline Data
                const dates = Object.keys(timelineMap);
                // Get all unique emotions found in the timeline
                const allEmotions = Array.from(new Set(data?.map(e => e.sentiment).filter(Boolean) as string[]));
                
                const datasets = allEmotions.map((emotion, i) => ({
                    label: emotion,
                    data: dates.map(date => timelineMap[date][emotion] || 0),
                    backgroundColor: [
                        '#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#9ca3af'
                    ][i % 7], // Rotate colors
                }));

                setTimelineData({ labels: dates, datasets });

            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoadingData(false);
            }
        }
        fetchData();
    }, [user]);

    const barData = {
        labels: LABELS,
        datasets: [{
            label: 'Entries this Month',
            data: chartData,
            backgroundColor: ['#78716c', '#57534e', '#44403c', '#d6d3d1', '#eab308'],
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    const doughnutData = {
        labels: Object.keys(emotionData),
        datasets: [{
            data: Object.values(emotionData),
            backgroundColor: [
                '#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#9ca3af'
            ],
            borderWidth: 0,
        }]
    };

    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#292524',
                padding: 12,
                titleFont: { family: 'Lora' },
                bodyFont: { family: 'Inter' }
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#44403c' }, ticks: { color: '#a8a29e' } },
            x: { grid: { display: false }, ticks: { color: '#d6d3d1' } }
        }
    };

    const doughnutOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
            legend: { position: 'right', labels: { color: '#d6d3d1', font: { family: 'Inter' } } }
        }
    };

    const timelineOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { color: '#d6d3d1' } },
            tooltip: { backgroundColor: '#292524' }
        },
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: '#d6d3d1' } },
            y: { stacked: true, beginAtZero: true, grid: { color: '#44403c' }, ticks: { stepSize: 1, color: '#a8a29e' } }
        }
    };

    return (
        <section id="analytics" className="bg-stone-900 text-stone-100 py-16 mt-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-12">
                     <h3 className="text-3xl serif-font mb-4 text-stone-50">Visualizing Your Growth</h3>
                    <p className="text-stone-400 max-w-2xl">
                        Track categorical themes and emotional patterns over time. Understanding <em>how</em> you feel is just as important as <em>what</em> you do.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* 1. Category Chart */}
                    <div className="md:col-span-2 bg-stone-800 rounded-xl p-6 border border-stone-700 min-h-[300px]">
                        <h4 className="text-stone-300 font-medium mb-4 flex items-center gap-2"><PieChart className="w-4 h-4"/> Categories</h4>
                        {loadingData ? (
                            <div className="flex h-[250px] items-center justify-center"><Activity className="w-6 h-6 animate-pulse text-stone-600"/></div>
                        ) : (
                            <div className="h-[250px] w-full">
                                <Bar data={barData} options={barOptions} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Second Row: Emotions */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Emotion Distribution */}
                    <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
                        <h4 className="text-stone-300 font-medium mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-400"/> Emotion Breakdown</h4>
                        {loadingData ? (
                           <div className="flex h-[250px] items-center justify-center"><Activity className="w-6 h-6 animate-pulse text-stone-600"/></div>
                        ) : (
                            <div className="h-[250px] flex justify-center">
                               {Object.keys(emotionData).length > 0 ? (
                                    <Doughnut data={doughnutData} options={doughnutOptions} />
                               ) : (
                                   <div className="flex items-center justify-center text-stone-500 text-sm italic">No emotion data yet. Start journaling!</div>
                               )}
                            </div>
                        )}
                    </div>

                    {/* Feelings Over Time */}
                    <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
                         <h4 className="text-stone-300 font-medium mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400"/> Feelings Timeline</h4>
                         {loadingData ? (
                           <div className="flex h-[250px] items-center justify-center"><Activity className="w-6 h-6 animate-pulse text-stone-600"/></div>
                        ) : (
                            <div className="h-[250px] w-full">
                                {timelineData.labels.length > 0 ? (
                                    <Bar data={timelineData} options={timelineOptions} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-stone-500 text-sm italic">Not enough data for timeline.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
