import React, { useState, useEffect } from 'react';
import { getTravelTips } from '../utils/gemini';
import { Lightbulb, Globe, Sparkles } from 'lucide-react';

const TravelTipsCard: React.FC = () => {
    const [tips, setTips] = useState<{ text: string, sources: { uri: string; title: string; }[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            const result = await getTravelTips();
            setTips(result);
            setLoading(false);
        };
        fetchTips();
    }, []);

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800 dark:text-white">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                Manali Pro-Tips
            </h2>
            {loading ? (
                <div className="flex items-center justify-center py-4 text-gray-500">
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    Fetching latest travel tips...
                </div>
            ) : tips ? (
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    <p>{tips.text}</p>
                    {tips.sources && tips.sources.length > 0 && (
                        <div>
                            <h4 className="flex items-center mt-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                                <Globe size={12} className="mr-1.5" /> SOURCES
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {tips.sources.map((source, index) => (
                                    <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full hover:underline dark:bg-teal-900 dark:text-teal-300">
                                        {source.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-500">Could not load tips.</p>
            )}
        </div>
    );
};

export default TravelTipsCard;