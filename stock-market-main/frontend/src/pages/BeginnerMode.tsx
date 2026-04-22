import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search, TrendingUp, TrendingDown, Info, Activity, BarChart3,
  BrainCircuit, Newspaper, ShieldCheck, Sparkles, ArrowRight
} from 'lucide-react';

import StockChart from '../components/StockChart';
import { yahooFinanceApi } from '../api/yahooFinance';

type AnalyzeResponse = {
  recommendation?: string;
  confidence?: number;
  risk?: string;
  explanation?: string;
  trend?: string;
  sentiment?: string;
  news?: Array<{
    title?: string;
    source?: string;
    sentiment?: string;
  }>;
};

const fetchAnalyze = async (symbol: string) => {
  try {
    return await axios.get<AnalyzeResponse>(`/api/analyze?symbol=${encodeURIComponent(symbol)}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return axios.get<AnalyzeResponse>(`/analyze?symbol=${encodeURIComponent(symbol)}`);
    }
    throw error;
  }
};

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCompact = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
};

const toRiskLabel = (risk?: string) => {
  if (!risk) return 'Moderate';
  return risk.charAt(0).toUpperCase() + risk.slice(1);
};

const getPeers = (symbol: string) => {
  const peerMap: Record<string, string[]> = {
    TCS: ['INFY', 'HCLTECH', 'WIPRO'],
    RELIANCE: ['ONGC', 'BPCL', 'IOC'],
    HDFCBANK: ['ICICIBANK', 'SBIN', 'AXISBANK'],
    INFY: ['TCS', 'HCLTECH', 'WIPRO'],
    TATASTEEL: ['JSWSTEEL', 'HINDALCO', 'SAIL'],
  };

  return peerMap[symbol] || ['RELIANCE', 'TCS', 'HDFCBANK'];
};

type PulseCard = {
  name: string;
  symbol: string;
  value: string;
  change: string;
  percent: string;
  isUp: boolean;
};

type PickCard = {
  symbol: string;
  name: string;
  price: string;
  rec: 'BUY' | 'HOLD' | 'WAIT';
  badgeClass: string;
};

export default function BeginnerMode() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStock, setSearchedStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketPulse, setMarketPulse] = useState<PulseCard[]>([]);
  const [topPicks, setTopPicks] = useState<PickCard[]>([]);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const [nifty, sensex, bankNifty, indiaVix, reliance, tataSteel, hdfcBank] = await Promise.all([
          axios.get('/api/index/NIFTY?range=1D'),
          axios.get('/api/index/SENSEX?range=1D'),
          axios.get('/api/index/BANKNIFTY?range=1D'),
          yahooFinanceApi.getQuote('^INDIAVIX'),
          yahooFinanceApi.getQuote('RELIANCE'),
          yahooFinanceApi.getQuote('TATASTEEL'),
          yahooFinanceApi.getQuote('HDFCBANK'),
        ]);

        setMarketPulse([
          {
            name: 'NIFTY 50',
            symbol: 'NIFTY',
            value: formatCurrency(nifty.data?.price),
            change: `${nifty.data?.change >= 0 ? '+' : ''}${formatCurrency(nifty.data?.change)}`,
            percent: `${nifty.data?.percent >= 0 ? '+' : ''}${Number(nifty.data?.percent || 0).toFixed(2)}%`,
            isUp: Number(nifty.data?.change || 0) >= 0,
          },
          {
            name: 'SENSEX',
            symbol: 'SENSEX',
            value: formatCurrency(sensex.data?.price),
            change: `${sensex.data?.change >= 0 ? '+' : ''}${formatCurrency(sensex.data?.change)}`,
            percent: `${sensex.data?.percent >= 0 ? '+' : ''}${Number(sensex.data?.percent || 0).toFixed(2)}%`,
            isUp: Number(sensex.data?.change || 0) >= 0,
          },
          {
            name: 'NIFTY BANK',
            symbol: 'BANKNIFTY',
            value: formatCurrency(bankNifty.data?.price),
            change: `${bankNifty.data?.change >= 0 ? '+' : ''}${formatCurrency(bankNifty.data?.change)}`,
            percent: `${bankNifty.data?.percent >= 0 ? '+' : ''}${Number(bankNifty.data?.percent || 0).toFixed(2)}%`,
            isUp: Number(bankNifty.data?.change || 0) >= 0,
          },
          {
            name: 'INDIA VIX',
            symbol: '^INDIAVIX',
            value: formatCurrency(indiaVix.price),
            change: `${indiaVix.change >= 0 ? '+' : ''}${formatCurrency(indiaVix.change)}`,
            percent: `${indiaVix.changePercent >= 0 ? '+' : ''}${Number(indiaVix.changePercent || 0).toFixed(2)}%`,
            isUp: Number(indiaVix.change || 0) >= 0,
          },
        ]);

        const buildPick = (quote: any): PickCard => {
          const rec = quote.changePercent > 1 ? 'BUY' : quote.changePercent >= 0 ? 'HOLD' : 'WAIT';
          const badgeClass =
            rec === 'BUY'
              ? 'bg-emerald-500 dark:bg-[#089981]/10 border-[#089981]/20 text-emerald-600 dark:text-[#089981]'
              : rec === 'HOLD'
                ? 'bg-[#2962FF]/10 border-blue-600 dark:border-[#2962FF]/20 text-blue-600 dark:text-[#2962FF]'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-[#E0B324]';

          return {
            symbol: quote.symbol,
            name: quote.name,
            price: formatCurrency(quote.price),
            rec,
            badgeClass,
          };
        };

        setTopPicks([buildPick(reliance), buildPick(tataSteel), buildPick(hdfcBank)]);
      } catch (loadError) {
        console.error('Failed to load beginner mode highlights', loadError);
      }
    };

    loadHighlights();
  }, []);

  const analyzeStock = async (query: string) => {
    const normalizedQuery = query.trim().toUpperCase();
    if (!normalizedQuery) return;

    setSearchQuery(normalizedQuery);
    setIsLoading(true);
    setError(null);

    try {
      const peers = getPeers(normalizedQuery);
      const [analysisRes, quote, info, peerQuotes] = await Promise.all([
        fetchAnalyze(normalizedQuery),
        yahooFinanceApi.getQuote(normalizedQuery),
        yahooFinanceApi.getInfo(normalizedQuery),
        Promise.all(
          peers.map(async (peer) => {
            try {
              return await yahooFinanceApi.getQuote(peer);
            } catch (peerError) {
              return null;
            }
          })
        ),
      ]);

      const analysis = analysisRes.data ?? {};
      if (typeof quote.price !== 'number' || Number.isNaN(quote.price)) {
        throw new Error('Live quote price is unavailable');
      }

      if (!analysis.explanation || !analysis.recommendation) {
        throw new Error('AI analysis is unavailable');
      }

      const similar = peerQuotes
        .filter(Boolean)
        .map((peer: any) => ({
          symbol: peer.symbol || peer.resolvedSymbol || 'N/A',
          price: formatCurrency(peer.price),
          trend: `${peer.changePercent > 0 ? '+' : ''}${Number(peer.changePercent || 0).toFixed(2)}%`,
          rec: peer.changePercent > 1 ? 'BUY' : peer.changePercent >= 0 ? 'HOLD' : 'WAIT',
          isPositive: Number(peer.changePercent || 0) >= 0,
        }));

      setSearchedStock({
        symbol: quote.symbol,
        name: quote.name || info.longName || info.shortName || quote.symbol,
        currentPrice: quote.price,
        priceChange: `${quote.change > 0 ? '+' : ''}${formatCurrency(quote.change)}`,
        percentChange: `${quote.changePercent > 0 ? '+' : ''}${Number(quote.changePercent || 0).toFixed(2)}%`,
        isPositive: Number(quote.change || 0) >= 0,
        overview: {
          high: formatCurrency(quote.high),
          low: formatCurrency(quote.low),
          marketCap: formatCompact(quote.marketCap),
          sector: quote.sector || info.sector || 'N/A',
        },
        info: {
          peRatio: info.trailingPE ?? quote.trailingPE ?? 'N/A',
          eps: typeof info.trailingEps === 'number' ? formatCurrency(info.trailingEps) : 'N/A',
          week52High: typeof info.fiftyTwoWeekHigh === 'number' ? formatCurrency(info.fiftyTwoWeekHigh) : 'N/A',
          week52Low: typeof info.fiftyTwoWeekLow === 'number' ? formatCurrency(info.fiftyTwoWeekLow) : 'N/A',
        },
        ai: {
          recommendation: analysis.recommendation,
          confidence: analysis.confidence ?? 0,
          risk: toRiskLabel(analysis.risk),
          explanation: analysis.explanation,
        },
        insights: {
          trend: `Current trend is ${analysis.trend || 'neutral'} with a daily move of ${Number(quote.changePercent || 0).toFixed(2)}%.`,
          sentiment: `Recent news sentiment looks ${String(analysis.sentiment || 'neutral').toLowerCase()}.`,
          risk: `Risk is marked as ${toRiskLabel(analysis.risk).toLowerCase()} for beginner investors.`,
        },
        news: Array.isArray(analysis.news) ? analysis.news : [],
        similar,
      });
    } catch (analysisError) {
      setSearchedStock(null);
      if (axios.isAxiosError(analysisError)) {
        setError(String(analysisError.response?.data?.error || analysisError.message || 'Stock analysis load nahi ho paya.'));
      } else if (analysisError instanceof Error) {
        setError(analysisError.message);
      } else {
        setError('Stock analysis load nahi ho paya. Symbol check karke dubara try karo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeStock(searchQuery);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 flex flex-col gap-4 text-gray-700 dark:text-white min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-emerald-600 dark:text-[#089981]" />
          AI Guided Beginner Mode
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to understand this stock in one place</p>
      </div>

      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-2 flex items-center gap-3 shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 focus-within:border-blue-600 dark:border-[#2962FF] transition-colors">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI about a stock (e.g., TCS, Reliance)"
            className="w-full bg-transparent border-none outline-none text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-gray-400"
          />
        </form>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-[#2962FF] hover:bg-blue-700 dark:bg-[#1E53E5] disabled:opacity-60 text-gray-900 dark:text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors shrink-0 shadow-lg shadow-[#2962FF]/20"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="w-full rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {!searchedStock ? (
        <div className="w-full flex flex-col gap-6 mt-4">
          <div className="w-full flex flex-col items-center justify-center border border-gray-200 dark:border-gray-800 border-dashed rounded-xl bg-white dark:bg-gray-900/30 py-12 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2962FF]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 p-4 rounded-full mb-4 relative z-10 shadow-lg shadow-black/20">
              <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-[#2962FF]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">Ready to Analyze</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md relative z-10 mb-6">
              Search for any stock above to generate a full-width, premium AI analysis dashboard tailored for beginners.
            </p>

            <div className="flex flex-col items-center gap-3 relative z-10">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Popular Searches</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['TCS', 'RELIANCE', 'INFY', 'HDFCBANK'].map(stock => (
                  <button
                    key={stock}
                    onClick={() => analyzeStock(stock)}
                    className="px-4 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-white hover:bg-gray-200 dark:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:dark:border-gray-700 transition-all"
                  >
                    {stock}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" /> Market Pulse
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {marketPulse.map(idx => (
                <div key={idx.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">{idx.name}</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white mt-1">{idx.value}</span>
                  <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${idx.isUp ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                    {idx.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {idx.change} ({idx.percent})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#089981]" /> AI Top Picks for Beginners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPicks.map(pick => (
                <div
                  key={pick.symbol}
                  onClick={() => analyzeStock(pick.symbol)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:dark:border-gray-700 rounded-xl p-4 flex flex-col cursor-pointer transition-all hover:shadow-lg hover:shadow-black/20 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-base font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:text-[#089981] transition-colors">{pick.symbol}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{pick.name}</div>
                    </div>
                    <div className={`border text-[10px] font-bold px-2 py-1 rounded ${pick.badgeClass}`}>
                      {pick.rec}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">Rs {pick.price}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:text-[#089981] flex items-center gap-1 transition-colors">
                      Analyze <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" /> Stock Market Basics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex gap-4 items-start">
                <div className="bg-[#2962FF]/10 p-3 rounded-lg border border-blue-600 dark:border-[#2962FF]/20 shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-[#2962FF]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">What is Market Cap?</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Market Capitalization is the total value of a company's shares of stock. It helps you understand the size of a company.
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex gap-4 items-start">
                <div className="bg-amber-500 dark:bg-[#E0B324]/10 p-3 rounded-lg border border-[#E0B324]/20 shrink-0">
                  <BarChart3 className="w-6 h-6 text-amber-600 dark:text-[#E0B324]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">What is P/E Ratio?</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Price-to-Earnings ratio compares a company's share price to its earnings per share to help gauge valuation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 animate-in fade-in duration-500">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Company Name</span>
              <div className="text-base font-bold text-gray-900 dark:text-white break-words leading-tight">{searchedStock.name}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Price</span>
              <div className="text-base font-bold text-gray-900 dark:text-white">Rs {formatCurrency(searchedStock.currentPrice)}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Change</span>
              <div className={`text-base font-bold flex items-center gap-1 ${searchedStock.isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                {searchedStock.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {searchedStock.priceChange} ({searchedStock.percentChange})
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Day H/L</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-x-1 leading-tight">
                <span className="text-emerald-600 dark:text-[#089981]">H: Rs {searchedStock.overview.high}</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">|</span>
                <span className="text-rose-600 dark:text-[#F23645]">L: Rs {searchedStock.overview.low}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Market Cap</span>
              <div className="text-base font-bold text-gray-900 dark:text-white truncate">{searchedStock.overview.marketCap}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sector</span>
              <div className="text-base font-bold text-gray-900 dark:text-white truncate">{searchedStock.overview.sector}</div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <BrainCircuit className="w-64 h-64 text-emerald-600 dark:text-[#089981]" />
              </div>

              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-[#089981]" />
                <span className="text-sm font-bold text-emerald-600 dark:text-[#089981] uppercase tracking-widest">AI Recommendation</span>
              </div>

              <div className="flex items-end gap-4 mb-4 relative z-10">
                <div className="text-5xl font-black text-emerald-600 dark:text-[#089981] leading-none tracking-tight">
                  {searchedStock.ai.recommendation}
                </div>
                <div className="flex gap-3 mb-1">
                  <span className="text-xs font-bold bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] px-3 py-1.5 rounded-md border border-[#089981]/30 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> {searchedStock.ai.confidence}% Confidence
                  </span>
                  <span className="text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white px-3 py-1.5 rounded-md border dark:border-gray-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Risk: {searchedStock.ai.risk}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 relative z-10">
                <p className="text-sm md:text-base text-gray-700 dark:text-white leading-relaxed font-medium">
                  "{searchedStock.ai.explanation}"
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-5">
                <Info className="w-5 h-5 text-blue-600 dark:text-[#2962FF]" />
                <span className="text-sm font-bold text-blue-600 dark:text-[#2962FF] uppercase tracking-widest">Why this stock?</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-200 dark:bg-gray-800 p-1.5 rounded-md shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-[#089981]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Trend</div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{searchedStock.insights.trend}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-200 dark:bg-gray-800 p-1.5 rounded-md shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Sentiment</div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{searchedStock.insights.sentiment}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-200 dark:bg-gray-800 p-1.5 rounded-md shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#E0B324]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Risk</div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{searchedStock.insights.risk}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 h-[320px] flex flex-col">
            <StockChart symbol={searchedStock.symbol} title="Price Performance" height="100%" />
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Company Name</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white break-words leading-tight">{searchedStock.name}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sector</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{searchedStock.overview.sector}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Market Cap</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{searchedStock.overview.marketCap}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">P/E Ratio</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{searchedStock.info.peRatio}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">EPS</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">Rs {searchedStock.info.eps}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">52W High / Low</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-x-1 leading-tight">
                <span className="text-emerald-600 dark:text-[#089981]">H: Rs {searchedStock.info.week52High}</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">|</span>
                <span className="text-rose-600 dark:text-[#F23645]">L: Rs {searchedStock.info.week52Low}</span>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wider">News & Sentiment</span>
              </div>
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[240px] pr-2 custom-scrollbar">
                {searchedStock.news.length === 0 && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3.5 text-sm text-gray-500 dark:text-gray-400">
                    News not available for this stock right now.
                  </div>
                )}
                {searchedStock.news.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3.5 flex items-center justify-between gap-4 hover:dark:border-gray-700 cursor-pointer transition-all hover:shadow-md">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                        {item.source}
                      </div>
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 border ${
                      item.sentiment === 'Positive' ? 'bg-emerald-500 dark:bg-[#089981]/10 text-emerald-600 dark:text-[#089981] border-[#089981]/20' :
                      item.sentiment === 'Negative' ? 'bg-rose-500 dark:bg-[#F23645]/10 text-rose-600 dark:text-[#F23645] border-[#F23645]/20' :
                      'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:border-gray-700'
                    }`}>
                      {item.sentiment}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wider">Similar Stocks You Can Consider</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {searchedStock.similar.length === 0 && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3.5 text-sm text-gray-500 dark:text-gray-400">
                    Similar stocks not available.
                  </div>
                )}
                {searchedStock.similar?.map((stock: any, index: number) => (
              
                  <div key={`${stock.symbol ?? 'similar'}-${index}`} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3.5 flex items-center justify-between hover:dark:border-gray-700 cursor-pointer transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-black text-gray-700 dark:text-white border dark:border-gray-700">
                        {(stock.symbol || '?').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol || 'N/A'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rs {stock.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-xs font-bold flex items-center gap-1 ${stock.isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                        {stock.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {stock.trend}
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                        stock.rec === 'BUY' ? 'bg-emerald-500 dark:bg-[#089981]/10 text-emerald-600 dark:text-[#089981] border-[#089981]/20' :
                        stock.rec === 'HOLD' ? 'bg-[#2962FF]/10 text-blue-600 dark:text-[#2962FF] border-blue-600 dark:border-[#2962FF]/20' :
                        'bg-amber-500 dark:bg-[#E0B324]/10 text-amber-600 dark:text-[#E0B324] border-[#E0B324]/20'
                      }`}>
                        {stock.rec}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
