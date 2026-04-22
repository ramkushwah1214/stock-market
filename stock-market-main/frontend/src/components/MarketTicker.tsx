import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TickerData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  region: 'India';
  currency: string;
}

const DEFAULT_TICKERS: TickerData[] = [
  { id: 'nifty50', name: 'NIFTY 50', symbol: '^NSEI', price: 22150.00, change: 120.50, changePercent: 0.54, region: 'India', currency: '₹' },
  { id: 'sensex', name: 'SENSEX', symbol: '^BSESN', price: 73400.00, change: -80.20, changePercent: -0.11, region: 'India', currency: '₹' },
  { id: 'banknifty', name: 'BANK NIFTY', symbol: '^NSEBANK', price: 46500.00, change: 250.00, changePercent: 0.54, region: 'India', currency: '₹' },
  { id: 'niftyit', name: 'NIFTY IT', symbol: '^CNXIT', price: 35100.00, change: 180.00, changePercent: 0.52, region: 'India', currency: '₹' },
  { id: 'niftyauto', name: 'NIFTY AUTO', symbol: '^CNXAUTO', price: 22400.00, change: -95.00, changePercent: -0.42, region: 'India', currency: '₹' },
  { id: 'niftypharma', name: 'NIFTY PHARMA', symbol: '^CNXPHARMA', price: 18900.00, change: 75.00, changePercent: 0.40, region: 'India', currency: '₹' },
];

export default function MarketTicker() {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedTickers = DEFAULT_TICKERS.map(ticker => {
          const volatility = ticker.price * 0.001;
          const randomChange = (Math.random() - 0.5) * volatility;
          const newPrice = ticker.price + randomChange;
          const newChange = ticker.change + randomChange;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;

          return {
            ...ticker,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        });

        setTickers(updatedTickers);
      } catch (error) {
        console.error('Failed to fetch ticker data:', error);
        setTickers(DEFAULT_TICKERS);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerData();

    const interval = setInterval(fetchTickerData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && tickers.length === 0) {
    return (
      <div className="w-full h-12 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-center sticky top-0 z-50">
        <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const displayTickers = [...tickers, ...tickers, ...tickers];

  return (
    <div className="w-full h-12 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden flex items-center sticky top-0 z-50 relative">
      <div className="hidden md:flex items-center h-full px-4 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A] to-transparent z-20 absolute left-0 border-r border-gray-200 dark:border-gray-800/50 w-32">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] md:pl-32">
        {displayTickers.map((ticker, index) => {
          const isPositive = ticker.change >= 0;
          const isNeutral = ticker.change === 0;

          let colorClass = 'text-gray-500 dark:text-gray-400';
          let bgClass = 'bg-gray-100 dark:bg-gray-800/50';
          let Icon = Minus;

          if (isPositive && !isNeutral) {
            colorClass = 'text-emerald-400';
            bgClass = 'bg-emerald-400/10';
            Icon = TrendingUp;
          } else if (!isPositive && !isNeutral) {
            colorClass = 'text-red-400';
            bgClass = 'bg-red-400/10';
            Icon = TrendingDown;
          }

          return (
            <Link
              key={`${ticker.id}-${index}`}
              to="/app/analysis"
              className="group relative flex items-center gap-3 px-6 py-1 border-r border-gray-200 dark:border-gray-800/50 hover:bg-gray-100 dark:bg-gray-800/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">{ticker.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-slate-500">IN</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                  {ticker.currency}{ticker.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${bgClass} ${colorClass}`}>
                  <Icon className="w-3 h-3" />
                  <span>{ticker.change > 0 ? '+' : ''}{ticker.change.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>({ticker.changePercent > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-900 border border-slate-700 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 dark:text-white font-bold">{ticker.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{ticker.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Price</span>
                  <span className="text-gray-900 dark:text-white font-medium">{ticker.currency}{ticker.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Change</span>
                  <span className={`font-medium ${colorClass}`}>
                    {ticker.change > 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent > 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
