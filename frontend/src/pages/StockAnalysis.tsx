import { useEffect, useState } from 'react';
import { Activity, BarChart2, Search, TrendingDown, TrendingUp } from 'lucide-react';

import StockChart from '../components/StockChart';
import { yahooFinanceApi, type YahooQuote } from '../api/yahooFinance';

const formatNumber = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return value.toLocaleString('en-IN');
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatCompactMarketCap = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
};

export default function StockAnalysis() {
  const [searchQuery, setSearchQuery] = useState('RELIANCE');
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE');
  const [stockData, setStockData] = useState<YahooQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadQuote = async () => {
      if (!selectedSymbol.trim()) {
        setStockData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await yahooFinanceApi.getQuote(selectedSymbol.trim().toUpperCase());
        if (!ignore) {
          setStockData(data);
        }
      } catch (err) {
        console.error('Failed to load Yahoo Finance quote', err);
        if (!ignore) {
          setStockData(null);
          setError('Failed to load stock details');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadQuote();
    return () => {
      ignore = true;
    };
  }, [selectedSymbol]);

  const activeSymbol = stockData?.symbol || selectedSymbol || 'RELIANCE';
  const stockExchange = stockData?.exchange || 'NSE';
  const isPositive = (stockData?.change || 0) >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Analysis</h2>
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSelectedSymbol(searchQuery.trim().toUpperCase());
              }
            }}
            placeholder="Search NSE/BSE stocks and press Enter..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-blue-600 dark:focus:border-[#2962FF] focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#2962FF]/20 outline-none transition-all shadow-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{activeSymbol}</h1>
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white text-xs font-medium rounded-md">{stockExchange}</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{stockData?.name || 'Live market data from Yahoo Finance'}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div><span className="text-gray-500 dark:text-gray-400">Sector:</span> {stockData?.sector || 'N/A'}</div>
            <div><span className="text-gray-500 dark:text-gray-400">Mkt Cap:</span> {formatCompactMarketCap(stockData?.marketCap)}</div>
          </div>
          {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
        </div>

        <div className="text-left md:text-right">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {loading ? 'Loading...' : `Rs ${formatCurrency(stockData?.price)}`}
          </div>
          <div className={`flex items-center md:justify-end gap-1 mt-2 font-medium text-lg ${isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {stockData ? `${stockData.change > 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)` : 'No price data'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <StockChart symbol={activeSymbol} title="Price History" height={350} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Day's Range</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">Rs {formatCurrency(stockData?.low)} - Rs {formatCurrency(stockData?.high)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Volume</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{formatNumber(stockData?.volume)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">P/E Ratio</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{stockData?.trailingPE ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Div Yield</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {typeof stockData?.dividendYield === 'number' ? `${(stockData.dividendYield * 100).toFixed(2)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Market Snapshot</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">Previous Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Rs {formatCurrency(stockData?.previousClose)}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded font-medium">Market</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-[#089981]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Rs {formatCurrency(stockData?.open)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${isPositive ? 'bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981]' : 'bg-rose-500/10 text-rose-600 dark:text-[#F23645]'}`}>
                    {isPositive ? 'Bullish Day' : 'Weak Day'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-600 dark:text-[#E0B324]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">Industry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{stockData?.industry || 'N/A'}</span>
                  <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-[#E0B324] rounded font-medium">Info</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
