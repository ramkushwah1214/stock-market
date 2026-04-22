import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  RefreshCw,
  BarChart3,
  Clock,
  Newspaper,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const formatCurrency = (value: unknown) =>
  toNumber(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const normalizeChartData = (payload: unknown) => {
  if (!Array.isArray(payload)) return [];

  return payload
    .map((item: any, index) => {
      const price = toNumber(item?.price ?? item?.close ?? item?.Close, NaN);
      if (!Number.isFinite(price)) return null;

      return {
        ...item,
        time: item?.time ?? item?.date ?? `Point ${index + 1}`,
        price,
      };
    })
    .filter(Boolean);
};

type MoversTab = 'gainers' | 'losers';

const sortMoversForTab = (rows: any[], tab: MoversTab) => {
  const normalizedRows = rows.map((stock: any) => ({
    symbol: stock?.symbol ?? 'N/A',
    name: stock?.name ?? stock?.symbol ?? 'Unknown',
    price: toNumber(stock?.price ?? stock?.currentPrice),
    percent: toNumber(stock?.percent ?? stock?.change),
  }));

  if (tab === 'gainers') {
    return normalizedRows
      .filter(stock => stock.percent > 0)
      .sort((a, b) => b.percent - a.percent);
  }

  return normalizedRows
    .filter(stock => stock.percent < 0)
    .sort((a, b) => a.percent - b.percent);
};

const normalizeMoversResponse = (payload: any, tab: MoversTab) => {
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

  return {
    rows: sortMoversForTab(rows, tab),
    nextPage: Number.isFinite(Number(payload?.nextPage)) ? Number(payload.nextPage) : 1,
    hasMore: Boolean(payload?.hasMore),
  };
};

const fallbackMovers = {
  gainers: [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, percent: 1.24 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3980.2, percent: 0.86 },
    { symbol: 'INFY', name: 'Infosys', price: 1485.6, percent: 0.72 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1420.3, percent: 0.48 },
    { symbol: 'ITC', name: 'ITC', price: 445.1, percent: 0.31 },
  ],
  losers: [
    { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 925.4, percent: -1.08 },
    { symbol: 'WIPRO', name: 'Wipro', price: 512.25, percent: -0.74 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 765.8, percent: -0.52 },
    { symbol: 'AXISBANK', name: 'Axis Bank', price: 1088.15, percent: -0.39 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12050.0, percent: -0.25 },
  ],
};

const getFallbackMovers = (tab: MoversTab) => sortMoversForTab(fallbackMovers[tab], tab);

export default function Dashboard() {
  const [selectedIndex, setSelectedIndex] = useState("NIFTY");
  const [timeRange, setTimeRange] = useState("1D");
  const [data, setData] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [moversTab, setMoversTab] = useState<"gainers" | "losers">("gainers");
  const [moversData, setMoversData] = useState<any[]>([]);
  const [moversPage, setMoversPage] = useState(1);
  const [hasMoreMovers, setHasMoreMovers] = useState(true);
  const [loadingMovers, setLoadingMovers] = useState(false);
  const moversRequestRef = useRef(0);

  const fetchMovers = async (pageToFetch: number, tab: MoversTab, force = false) => {
    if (loadingMovers && !force) return;
    const requestId = ++moversRequestRef.current;
    setLoadingMovers(true);
    try {
      const res = await axios.get(`/api/movers?type=${tab}&page=${pageToFetch}`);
      if (requestId !== moversRequestRef.current) return;

      const newData = normalizeMoversResponse(res.data, tab);
      const rows = newData.rows.length > 0 ? newData.rows : getFallbackMovers(tab);
      
      setMoversData(prev => pageToFetch === 1 ? rows : [...prev, ...rows]);
      setMoversPage(newData.nextPage);
      setHasMoreMovers(newData.rows.length > 0 ? newData.hasMore : false);
    } catch (err) {
      console.error("Error fetching movers:", err);
      if (requestId !== moversRequestRef.current) return;

      setMoversData(prev => pageToFetch === 1 ? getFallbackMovers(tab) : prev);
      setHasMoreMovers(false);
    } finally {
      if (requestId === moversRequestRef.current) {
        setLoadingMovers(false);
      }
    }
  };

  useEffect(() => {
    fetchMovers(1, moversTab, true);
  }, [moversTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMoreMovers &&
        !loadingMovers
      ) {
        fetchMovers(moversPage, moversTab);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [moversPage, hasMoreMovers, loadingMovers, moversTab]);

  const handleTabChange = (tab: MoversTab) => {
    if (tab === moversTab) return;
    setMoversTab(tab);
    setMoversData([]);
    setMoversPage(1);
    setHasMoreMovers(true);
  };

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);
    
    setError(null);
    try {
      const [indexRes, sectorsRes] = await Promise.all([
        axios.get(`/api/index/${selectedIndex}?range=${timeRange}`),
        axios.get('/api/sectors')
      ]);

      const indexData = indexRes.data ?? {};
      setData({
        ...indexData,
        price: toNumber(indexData?.price),
        change: toNumber(indexData?.change),
        percent: toNumber(indexData?.percent),
        high: toNumber(indexData?.high),
        low: toNumber(indexData?.low),
        chartData: normalizeChartData(indexData?.chartData),
        news: Array.isArray(indexData?.news) ? indexData.news : [],
        aiInsights: indexData?.aiInsights ?? {},
        marketOverview: indexData?.marketOverview ?? {},
      });

      const sectorRows = Array.isArray(sectorsRes.data) ? sectorsRes.data : [];
      setSectors(
        sectorRows
          .map((sector: any) => ({
            name: sector?.name ?? 'Unknown',
            change: toNumber(sector?.change),
          }))
          .sort((a: any, b: any) => b.change - a.change)
      );
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load market data. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [selectedIndex, timeRange]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#2962FF]"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading market data...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600 mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connection Error</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
        <button 
          onClick={() => fetchData()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const safeData = data ?? {};
  const price = toNumber(safeData?.price);
  const change = toNumber(safeData?.change);
  const percent = toNumber(safeData?.percent);
  const high = toNumber(safeData?.high);
  const low = toNumber(safeData?.low);
  const chartData = Array.isArray(safeData?.chartData) ? safeData.chartData : [];
  const news = Array.isArray(safeData?.news) ? safeData.news : [];
  const aiInsights = safeData?.aiInsights ?? {};
  const marketOverview = safeData?.marketOverview ?? {};
  const isPositive = change >= 0;
  const chartColor = isPositive ? '#089981' : '#F23645';
  const chartGradientId = `colorPrice-${isPositive ? 'green' : 'red'}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 rounded-lg shadow-lg">
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            ₹{formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Index Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {["NIFTY", "SENSEX", "BANKNIFTY"].map((idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                selectedIndex === idx
                  ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-[#2962FF] shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {idx === "BANKNIFTY" ? "BANK NIFTY" : idx}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-rose-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Update failed</span>}
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'}
          </span>
          <button 
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-[#2962FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`grid grid-cols-2 ${["NIFTY", "SENSEX", "BANKNIFTY"].includes(selectedIndex) ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Current Price</p>
          <h3 className="text-gray-900 dark:text-white text-lg font-semibold">₹{formatCurrency(price)}</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Day Change</p>
          <div className={`flex items-center gap-1 text-lg font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>{Math.abs(change).toFixed(2)} ({Math.abs(percent).toFixed(2)}%)</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Day High / Low</p>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> H: ₹{formatCurrency(high)}
            </span>
            <span className="text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> L: ₹{formatCurrency(low)}
            </span>
          </div>
        </div>
        
        {!["NIFTY", "SENSEX", "BANKNIFTY"].includes(selectedIndex) && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Volume</p>
            <h3 className="text-gray-900 dark:text-white text-lg font-semibold">{safeData?.volume !== 'N/A' && safeData?.volume != null ? safeData.volume : 'Not Available'}</h3>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-[#2962FF]" />
              {selectedIndex === "BANKNIFTY" ? "BANK NIFTY" : selectedIndex} Performance
            </h3>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {['1D', '1W', '1M', '1Y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    timeRange === range
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px]">
            {chartData.length === 0 ? (
              <div className="h-full min-h-[350px] flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                Chart data not available
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dx={-10}
                  tickFormatter={(val) => `₹${Number(val || 0).toLocaleString('en-IN')}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={chartColor} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill={`url(#${chartGradientId})`} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: chartColor }}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Insights & Market Overview */}
        <div className="space-y-6 flex flex-col">
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-[#2962FF]">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Insights</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Recommendation</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  aiInsights?.recommendation === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  aiInsights?.recommendation === 'SELL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {aiInsights?.recommendation ?? 'HOLD'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Confidence</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{toNumber(aiInsights?.confidence)}%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {aiInsights?.explanation ?? 'Market insight is not available right now.'}
              </p>
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              Market Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Market Trend</span>
                <span className={`text-sm font-bold ${marketOverview?.trend === 'Bullish' ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                  {marketOverview?.trend ?? 'Neutral'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Advance / Decline</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{marketOverview?.advanceDecline ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Volatility (VIX)</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{marketOverview?.volatility ?? 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Movers & Losers */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => handleTabChange("gainers")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                moversTab === "gainers" 
                  ? "text-green-500 border-b-2 border-green-500 bg-green-50 dark:bg-green-500/5" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              Top Movers
            </button>
            <button
              onClick={() => handleTabChange("losers")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                moversTab === "losers" 
                  ? "text-green-500 border-b-2 border-green-500 bg-green-50 dark:bg-green-500/5" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              Top Losers
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 font-medium">Symbol</th>
                  <th className="px-6 py-4 font-medium">Company Name</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Change %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {moversData.map((stock: any, idx: number) => {
                  const stockPrice = toNumber(stock?.price);
                  const stockPercent = toNumber(stock?.percent);
                  const isPositive = stockPercent >= 0;
                  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
                  const sign = isPositive ? '+' : '';
                  const arrow = isPositive ? '↑' : '↓';
                  
                  return (
                    <tr key={`${stock?.symbol ?? 'stock'}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {stock?.symbol ?? 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {stock?.name ?? 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                        ₹{formatCurrency(stockPrice)}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${colorClass}`}>
                        {arrow} {sign}{stockPercent.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {loadingMovers && (
              <div className="flex items-center justify-center py-6 gap-2 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-[#2962FF]"></div>
                <span className="text-sm font-medium">Loading more...</span>
              </div>
            )}
            
            {!loadingMovers && moversData.length === 0 && (
              <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                Data not available
              </div>
            )}
          </div>
        </div>

        {/* Sector Performance */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" title="Sector performance based on top stocks">
            Sector Performance
            <Info className="w-4 h-4 text-gray-400" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
            {sectors.map((sector: any, index: number) => {
              const sectorChange = toNumber(sector?.change);
              const isPositive = sectorChange >= 0;
              const isTop = index === 0;
              return (
                <div 
                  key={sector?.name ?? index} 
                  className={`p-3 rounded-lg border ${isTop ? 'border-blue-500 dark:border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-gray-100 dark:border-gray-800'} bg-gray-50 dark:bg-gray-800/30 flex flex-col gap-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isTop ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {sector?.name ?? 'Unknown'}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {Math.abs(sectorChange).toFixed(2)}%
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${Math.min(Math.abs(sectorChange) * 10, 100)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* News & Sentiment */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-blue-600 dark:text-[#2962FF]" />
          Market News & Sentiment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.length === 0 && (
            <div className="md:col-span-3 text-center py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
              News not available
            </div>
          )}
          {news.map((item: any, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{item?.title ?? 'Market update'}</h4>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shrink-0 ml-2 ${
                  item?.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  item?.sentiment === 'Negative' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                  'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {item?.sentiment ?? 'Neutral'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item?.description ?? ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
