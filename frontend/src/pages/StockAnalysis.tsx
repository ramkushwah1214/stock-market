import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import StockChart from '../components/StockChart';

export default function StockAnalysis() {
  const [searchQuery, setSearchQuery] = useState('RELIANCE');

  const stockData = {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    sector: 'Oil & Gas / Conglomerate',
    marketCap: '₹19.85 Lakh Cr',
    currentPrice: 2950.45,
    change: 15.20,
    percentChange: 0.52,
    high: 2980.00,
    low: 2920.10,
    volume: '5.2M',
    peRatio: 28.5,
    dividendYield: '0.35%',
  };

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
            placeholder="Search NSE/BSE stocks..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-blue-600 dark:focus:border-[#2962FF] focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#2962FF]/20 outline-none transition-all shadow-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{searchQuery || stockData.symbol}</h1>
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white text-xs font-medium rounded-md">NSE</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{stockData.name}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div><span className="text-gray-500 dark:text-gray-400">Sector:</span> {stockData.sector}</div>
            <div><span className="text-gray-500 dark:text-gray-400">Mkt Cap:</span> {stockData.marketCap}</div>
          </div>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">₹{stockData.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className={`flex items-center md:justify-end gap-1 mt-2 font-medium text-lg ${stockData.change >= 0 ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
            {stockData.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {stockData.change > 0 ? '+' : ''}{stockData.change} ({stockData.percentChange}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <StockChart symbol={searchQuery || stockData.symbol} title="Price History" height={350} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Day's Range</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">₹{stockData.low} - ₹{stockData.high}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Volume</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{stockData.volume}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-800/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">P/E Ratio</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{stockData.peRatio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Div Yield</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{stockData.dividendYield}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technical Indicators</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">RSI (14)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">62.5</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] rounded font-medium">Neutral</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-[#089981]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">MACD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">12.4</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] rounded font-medium">Bullish</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-600 dark:text-[#E0B324]" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">200 DMA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹2650</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] rounded font-medium">Above</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
