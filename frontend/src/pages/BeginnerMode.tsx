import React, { useState } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Info, Activity, BarChart3, 
  BrainCircuit, Newspaper, ShieldCheck, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import StockChart from '../components/StockChart';

export default function BeginnerMode() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStock, setSearchedStock] = useState<any>(null);

  const analyzeStock = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    
    const mockChartData = [
      { time: '09:15', price: 3850 }, { time: '10:00', price: 3890 },
      { time: '11:00', price: 3875 }, { time: '12:00', price: 3920 },
      { time: '13:00', price: 3910 }, { time: '14:00', price: 3950 },
      { time: '15:00', price: 3980 }, { time: '15:30', price: 3975 },
    ];

    setSearchedStock({
      symbol: searchQuery.toUpperCase(),
      name: searchQuery.toUpperCase() === 'TCS' ? 'Tata Consultancy Services' : 
            searchQuery.toUpperCase() === 'RELIANCE' ? 'Reliance Industries' : 'Sample Company Ltd',
      currentPrice: 3975.20,
      priceChange: '+125.50',
      percentChange: '+3.26%',
      isPositive: true,
      overview: {
        high: '3,985.00', low: '3,840.50',
        marketCap: '14.5T', sector: 'IT Services'
      },
      info: {
        peRatio: '28.5', eps: '139.40',
        week52High: '4,254.75', week52Low: '3,070.25'
      },
      chartData: mockChartData,
      ai: {
        recommendation: 'BUY',
        confidence: 82,
        risk: 'Low',
        explanation: 'This stock is trending upward and news is positive. It may be a good time to consider buying.'
      },
      insights: {
        trend: 'Consistent higher highs over the last 5 days.',
        sentiment: 'Strongly bullish due to recent earnings beat.',
        risk: 'Low volatility, safe for beginner portfolios.'
      },
      news: [
        { title: 'TCS secures major European contract in digital transformation', source: 'Economic Times', sentiment: 'Positive' },
        { title: 'IT Sector shows resilience in Q3 despite global headwinds', source: 'Moneycontrol', sentiment: 'Neutral' },
        { title: 'Minor profit booking expected next week across tech stocks', source: 'Mint', sentiment: 'Negative' }
      ],
      similar: [
        { symbol: 'INFY', price: '1,420.50', trend: '+1.2%', rec: 'BUY', isPositive: true },
        { symbol: 'HCLTECH', price: '1,150.75', trend: '+0.8%', rec: 'HOLD', isPositive: true },
        { symbol: 'WIPRO', price: '480.20', trend: '-0.5%', rec: 'WAIT', isPositive: false }
      ]
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeStock(searchQuery);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 flex flex-col gap-4 text-gray-700 dark:text-white min-h-screen bg-white dark:bg-gray-900">
      
      {/* Header Section */}
      <div className="w-full flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-emerald-600 dark:text-[#089981]" />
          AI Guided Beginner Mode
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Everything you need to understand this stock in one place</p>
      </div>

      {/* 1. Search Bar (Full Width) */}
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
        <button onClick={handleSearch} className="bg-[#2962FF] hover:bg-blue-700 dark:bg-[#1E53E5] text-gray-900 dark:text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors shrink-0 shadow-lg shadow-[#2962FF]/20">
          Analyze
        </button>
      </div>

      {!searchedStock ? (
        <div className="w-full flex flex-col gap-6 mt-4">
          {/* Hero Section */}
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

          {/* Market Pulse */}
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" /> Market Pulse
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'NIFTY 50', value: '22,453.30', change: '+120.40', percent: '+0.54%', isUp: true },
                { name: 'SENSEX', value: '73,806.15', change: '+350.20', percent: '+0.48%', isUp: true },
                { name: 'NIFTY BANK', value: '47,320.80', change: '-110.50', percent: '-0.23%', isUp: false },
                { name: 'INDIA VIX', value: '12.45', change: '-0.30', percent: '-2.35%', isUp: false }
              ].map(idx => (
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

          {/* AI Top Picks */}
          <div className="w-full">
            <h3 className="text-sm font-bold text-gray-700 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#089981]" /> AI Top Picks for Beginners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,950.00', rec: 'BUY', badgeClass: 'bg-emerald-500 dark:bg-[#089981]/10 border-[#089981]/20 text-emerald-600 dark:text-[#089981]' },
                { symbol: 'TATASTEEL', name: 'Tata Steel', price: '155.20', rec: 'BUY', badgeClass: 'bg-emerald-500 dark:bg-[#089981]/10 border-[#089981]/20 text-emerald-600 dark:text-[#089981]' },
                { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,440.50', rec: 'HOLD', badgeClass: 'bg-[#2962FF]/10 border-blue-600 dark:border-[#2962FF]/20 text-blue-600 dark:text-[#2962FF]' }
              ].map(pick => (
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
                    <div className="text-sm font-bold text-gray-900 dark:text-white">₹{pick.price}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:text-[#089981] flex items-center gap-1 transition-colors">
                      Analyze <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Market Basics / Learning */}
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
                    Market Capitalization is the total value of a company's shares of stock. It helps you understand the size of a company (Large Cap, Mid Cap, Small Cap).
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
                    Price-to-Earnings ratio compares a company's share price to its earnings per share. A lower P/E might mean the stock is undervalued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 animate-in fade-in duration-500">
          
          {/* 2. Stock Overview (Full Width Cards) */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Company Name</span>
              <div className="text-base font-bold text-gray-900 dark:text-white break-words leading-tight">{searchedStock.name}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Price</span>
              <div className="text-base font-bold text-gray-900 dark:text-white">₹{searchedStock.currentPrice.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Change</span>
              <div className={`text-base font-bold flex items-center gap-1 ${searchedStock.isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                {searchedStock.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {searchedStock.priceChange}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Day H/L</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-x-1 leading-tight">
                <span className="text-emerald-600 dark:text-[#089981]">H: ₹{searchedStock.overview.high}</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">|</span>
                <span className="text-rose-600 dark:text-[#F23645]">L: ₹{searchedStock.overview.low}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Market Cap</span>
              <div className="text-base font-bold text-gray-900 dark:text-white truncate">₹{searchedStock.overview.marketCap}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sector</span>
              <div className="text-base font-bold text-gray-900 dark:text-white truncate">{searchedStock.overview.sector}</div>
            </div>
          </div>

          {/* 3. AI Recommendation (60%) & Insight Panel (40%) */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: AI Recommendation (60% -> col-span-7) */}
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

            {/* Right: Why this stock (40% -> col-span-5) */}
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

          {/* 4. Price Chart (Full Width) */}
          <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 h-[320px] flex flex-col">
            <StockChart symbol={searchedStock.symbol} title="Price Performance" height="100%" />
          </div>

          {/* 5. Stock Information (Below Chart - Full Width Grid) */}
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
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">₹{searchedStock.overview.marketCap}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">P/E Ratio</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{searchedStock.info.peRatio}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">EPS</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white truncate">₹{searchedStock.info.eps}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center col-span-2 md:col-span-2 xl:col-span-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">52W High / Low</span>
              <div className="text-sm font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row sm:items-center gap-x-1 leading-tight">
                <span className="text-emerald-600 dark:text-[#089981]">H: ₹{searchedStock.info.week52High}</span>
                <span className="text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">|</span>
                <span className="text-rose-600 dark:text-[#F23645]">L: ₹{searchedStock.info.week52Low}</span>
              </div>
            </div>
          </div>

          {/* 6. News (60%) & 7. Similar Stocks (40%) */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* News + Sentiment (60% -> col-span-7) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wider">News & Sentiment</span>
              </div>
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[240px] pr-2 custom-scrollbar">
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

            {/* Similar Stocks (40% -> col-span-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wider">Similar Stocks You Can Consider</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {searchedStock.similar.map((stock: any) => (
                  <div key={stock.symbol} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3.5 flex items-center justify-between hover:dark:border-gray-700 cursor-pointer transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-black text-gray-700 dark:text-white border dark:border-gray-700">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">₹{stock.price}</div>
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
