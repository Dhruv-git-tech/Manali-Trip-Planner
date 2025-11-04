import React, { useState, useEffect } from 'react';
import { getPlaceInfo } from '../utils/gemini';
import { Sparkles, Globe, MapPin } from 'lucide-react';
import { Place } from '../types';

interface GeminiInfoCardProps {
  placeName: string;
  onFetched: (description: string, sources: Place['sources']) => void;
  cachedDescription?: string;
  cachedSources?: Place['sources'];
}

const GeminiInfoCard: React.FC<GeminiInfoCardProps> = ({ placeName, onFetched, cachedDescription, cachedSources }) => {
  const [info, setInfo] = useState<{ text: string, sources: Place['sources'] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cachedDescription && cachedSources) {
      setInfo({ text: cachedDescription, sources: cachedSources });
      setLoading(false);
      return;
    }

    const fetchInfo = async () => {
      setLoading(true);
      const result = await getPlaceInfo(placeName);
      setInfo(result);
      onFetched(result.text, result.sources);
      setLoading(false);
    };

    fetchInfo();
  }, [placeName, onFetched, cachedDescription, cachedSources]);

  if (loading) {
    return (
      <div className="p-4 mt-2 text-center text-gray-600 bg-yellow-50 rounded-lg dark:bg-gray-700 dark:text-gray-300">
        <div className="flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-500 animate-pulse" />
            <span>Getting fresh info...</span>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="p-4 mt-2 space-y-3 bg-yellow-50 rounded-lg dark:bg-gray-700">
      <div className="flex items-start">
        <Sparkles className="flex-shrink-0 w-6 h-6 mt-1 mr-3 text-yellow-500" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200">{info.text}</p>
      </div>
      {info.sources && info.sources.length > 0 && (
          <div>
            <h4 className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                <Globe size={12} className="mr-1.5" /> SOURCES
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
                {info.sources.map((source, index) => (
                    <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full hover:underline dark:bg-teal-900 dark:text-teal-300">
                        {source.type === 'map' && <MapPin size={12} className="mr-1" />}
                        {source.title}
                    </a>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default GeminiInfoCard;