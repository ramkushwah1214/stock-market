import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, Plus, X, Bot, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import axios from 'axios';

export default function StockComparison() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['RELIANCE', 'TCS']);
  const [timeRange, setTimeRange] = useState('1M');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = ['#2962FF', '#089981', '#E0B324'];

  const fetchComparison = async () => {
    if (selectedStocks.length === 0) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const symbols = selectedStocks.map(s => {
        const trimmed = s.trim();
        return trimmed.includes('.NS') ? trimmed : `${trimmed}.NS`;
      }).join(',');
      const res = await axios.get(`/api/compare?stocks=${symbols}&range=${timeRange}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching comparison:", err);
      setError("Failed to fetch comparison data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [selectedStocks, timeRange]);

  const handleAddStock = () => {
    if (searchQuery && selectedStocks.length < 3 && !selectedStocks.includes(searchQuery.toUpperCase())) {
      setSelectedStocks([...selectedStocks, searchQuery.toUpperCase()]);
      setSearchQuery('');
    }
  };

  const handleRemoveStock = (stock: string) => {
    setSelectedStocks(selectedStocks.filter(s => s !== stock));
  };

  const formatNumber = (num: number, isPercent = false) => {
    if (num === undefined || num === null) return 'N/A';
    if (isPercent) return `${(num * 100).toFixed(2)}%`;
    if (num >= 1e12) return `₹${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)}Cr`;
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const getMetricColor = (stocks: any[], metric: string, currentVal: number, higherIsBetter = true) => {
    if (!stocks || stocks.length < 2 || currentVal === undefined) return '';
    const vals = stocks.map(s => s[metric]).filter(v => v !== undefined && v !== null);
    if (vals.length === 0) return '';
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    
    if (currentVal === max) return higherIsBetter ? 'text-green-500' : 'text-red-500';
    if (currentVal === min) return higherIsBetter ? 'text-red-500' : 'text-green-500';
    return '';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#2962FF] text-white flex items-center justify-center shadow-lg shadow-[#2962FF]/20">
          <ArrowRightLeft className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Comparison</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Compare up to 3 stocks side-by-side with AI analysis</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
              placeholder="Enter stock symbol (e.g., INFY)" 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-blue-600 dark:focus:border-[#2962FF] focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#2962FF]/20 outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:text-gray-400"
              disabled={selectedStocks.length >= 3}
            />
          </div>
          <button 
            onClick={handleAddStock}
            disabled={selectedStocks.length >= 3 || !searchQuery}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2962FF] text-white text-sm font-medium rounded-xl hover:bg-blue-700 dark:bg-[#1E53E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add to Compare
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {selectedStocks.map((stock, idx) => (
            <div key={stock} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
              <span className="font-bold text-gray-900 dark:text-white">{stock}</span>
              <button onClick={() => handleRemoveStock(stock)} className="p-1 hover:bg-gray-200 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-[#2962FF]"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Analyzing stocks...</p>
          </div>
        ) : data && data.stocks && data.stocks.length > 0 ? (
          <div className="space-y-8">
            
            {/* AI Suggestion Card */}
            {data.aiSuggestion && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Suggestion</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Best Stock</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      🏆 {data.aiSuggestion.bestStock}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      📊 {data.aiSuggestion.confidence}%
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reason</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      💡 {data.aiSuggestion.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 text-sm font-bold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-4 w-1/4">Metric</th>
                    {data.stocks.map((stock: any, idx: number) => (
                      <th key={stock.symbol} className="px-6 py-4 w-1/4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
                          {stock.symbol}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Price</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Change %</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className={`px-6 py-4 font-bold ${stock.percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <div className="flex items-center gap-1">
                          {stock.percent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {stock.percent > 0 ? '+' : ''}{stock.percent.toFixed(2)}%
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">P/E Ratio</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className={`px-6 py-4 font-bold ${getMetricColor(data.stocks, 'peRatio', stock.peRatio, false)}`}>
                        {stock.peRatio ? stock.peRatio.toFixed(2) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Profit Growth</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className={`px-6 py-4 font-bold ${getMetricColor(data.stocks, 'profitGrowth', stock.profitGrowth, true)}`}>
                        {formatNumber(stock.profitGrowth, true)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Revenue Growth</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className={`px-6 py-4 font-bold ${getMetricColor(data.stocks, 'revenueGrowth', stock.revenueGrowth, true)}`}>
                        {formatNumber(stock.revenueGrowth, true)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Dividend Yield</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className={`px-6 py-4 font-bold ${getMetricColor(data.stocks, 'dividendYield', stock.dividendYield, true)}`}>
                        {formatNumber(stock.dividendYield, true)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Market Cap</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                        {formatNumber(stock.marketCap)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Sector</td>
                    {data.stocks.map((stock: any) => (
                      <td key={stock.symbol} className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                        {stock.sector}
                      </td>
                    ))}
                  </tr>
                  {/* Mini Charts Row */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-500 dark:text-gray-400 mb-2">Trend</div>
                      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                        {['1D', '1W', '1M', '1Y'].map(range => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                              timeRange === range
                                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </td>
                    {data.stocks.map((stock: any, idx: number) => (
                      <td key={stock.symbol} className="px-6 py-4">
                        <div className="h-20 w-full">
                          {stock.chartData && stock.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={stock.chartData}>
                                <YAxis domain={['auto', 'auto']} hide />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke={colors[idx]} 
                                  strokeWidth={2} 
                                  dot={false} 
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center text-xs text-gray-400">No data</div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Add stocks to start comparing their performance.
          </div>
        )}
      </div>
    </div>
  );
}
