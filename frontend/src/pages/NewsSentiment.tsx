import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

type NewsItem = {
  source?: string;
  title?: string;
  description?: string;
  sentiment?: string;
  publishedAt?: string;
  url?: string;
  link?: string;
};

export default function NewsSentiment() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/market-data');
        const data = await response.json();
        setNews(Array.isArray(data.news) ? data.news : []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] border-[#089981]/30';
      case 'Negative': return 'bg-rose-500 dark:bg-[#F23645]/20 text-rose-600 dark:text-[#F23645] border-[#F23645]/20';
      default: return 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-700';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <TrendingUp className="w-4 h-4" />;
      case 'Negative': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const formatPublishedAt = (value?: string) => {
    if (!value) return 'Latest update';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Latest update';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#2962FF]"></div>
    </div>;
  }

  const positiveCount = news.filter((n) => n.sentiment === 'Positive').length;
  const negativeCount = news.filter((n) => n.sentiment === 'Negative').length;
  const neutralCount = news.filter((n) => n.sentiment === 'Neutral').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#2962FF] text-white flex items-center justify-center shadow-lg shadow-[#2962FF]/20">
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market News & Sentiment</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">AI-analyzed financial headlines from India</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bullish Sentiment</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-[#089981] mt-1">{positiveCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500 dark:bg-[#089981]/10 flex items-center justify-center text-emerald-600 dark:text-[#089981]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Neutral Sentiment</p>
            <p className="text-3xl font-bold text-gray-700 dark:text-white mt-1">{neutralCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <Minus className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bearish Sentiment</p>
            <p className="text-3xl font-bold text-rose-600 dark:text-[#F23645] mt-1">{negativeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-500 dark:bg-[#F23645]/10 flex items-center justify-center text-rose-600 dark:text-[#F23645]">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {news.length === 0 && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-sm text-gray-500 dark:text-gray-400">
            No news is available right now. Try refreshing in a few minutes.
          </div>
        )}

        {news.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:dark:border-gray-700 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.source || 'Market Desk'}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">• {formatPublishedAt(item.publishedAt)}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#2962FF] transition-colors">
                {item.title || 'Market update'}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold ${getSentimentColor(item.sentiment || 'Neutral')}`}>
                {getSentimentIcon(item.sentiment || 'Neutral')}
                {item.sentiment || 'Neutral'}
              </div>
              <button
                type="button"
                disabled={!item.url && !item.link}
                onClick={() => window.open(item.url || item.link, '_blank', 'noopener,noreferrer')}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:bg-gray-800 rounded-full transition-colors disabled:opacity-40"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
