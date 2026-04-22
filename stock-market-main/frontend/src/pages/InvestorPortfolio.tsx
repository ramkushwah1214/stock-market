import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine } from 'recharts';
import { Briefcase, ChevronDown, ChevronUp, BrainCircuit, Activity, ShieldCheck, TrendingUp, PieChart as PieChartIcon, Wallet, Plus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const generateChartData = (basePrice: number) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    date: `Day ${i + 1}`,
    price: basePrice + (Math.random() - 0.5) * (basePrice * 0.05)
  }));
};

const defaultPortfolioData = [
  { 
    id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 50, buyPrice: 2800.00, currentPrice: 2950.45, dayChange: 12.50, dayChangePercent: 0.42,
    overview: { high: 2980.00, low: 2910.00, mcap: '19.8T', sector: 'Energy' },
    info: { pe: 28.5, eps: 103.4, week52High: 3024.90, week52Low: 2220.30 },
    chartData: generateChartData(2950),
    ai: { rec: 'HOLD', confidence: 85, risk: 'Moderate', reason: 'This stock is showing stable growth with positive sentiment. Holding is recommended, but additional buying can be considered on dips.' }
  },
  { 
    id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 20, buyPrice: 3850.00, currentPrice: 3980.20, dayChange: -15.30, dayChangePercent: -0.38,
    overview: { high: 4010.00, low: 3950.00, mcap: '14.5T', sector: 'IT' },
    info: { pe: 32.1, eps: 124.5, week52High: 4150.00, week52Low: 3100.00 },
    chartData: generateChartData(3980),
    ai: { rec: 'BUY MORE', confidence: 92, risk: 'Low', reason: 'Strong quarterly results and solid deal pipeline. The current dip presents a good opportunity to accumulate more shares.' }
  },
  { 
    id: 3, symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 100, buyPrice: 1600.00, currentPrice: 1420.30, dayChange: 5.20, dayChangePercent: 0.36,
    overview: { high: 1440.00, low: 1410.00, mcap: '10.8T', sector: 'Banking' },
    info: { pe: 15.4, eps: 92.3, week52High: 1750.00, week52Low: 1360.00 },
    chartData: generateChartData(1420),
    ai: { rec: 'BUY MORE', confidence: 78, risk: 'Moderate', reason: 'Currently trading at a discount to historical averages. Long-term fundamentals remain intact despite short-term margin pressures.' }
  },
  { 
    id: 4, symbol: 'INFY', name: 'Infosys', quantity: 40, buyPrice: 1400.00, currentPrice: 1485.60, dayChange: 18.40, dayChangePercent: 1.25,
    overview: { high: 1500.00, low: 1470.00, mcap: '6.2T', sector: 'IT' },
    info: { pe: 24.8, eps: 59.8, week52High: 1730.00, week52Low: 1215.00 },
    chartData: generateChartData(1485),
    ai: { rec: 'HOLD', confidence: 88, risk: 'Low', reason: 'Steady performance with predictable margins. Maintain current position as valuation is fair.' }
  },
];

const COLORS = ['#2962FF', '#089981', '#E0B324', '#8b5cf6', '#ec4899'];

import StockChart from '../components/StockChart';

export default function InvestorPortfolio() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState('1M');
  const [portfolioTimeFilter, setPortfolioTimeFilter] = useState('1M');
  
  const [portfolio, setPortfolio] = useState<any[]>(() => {
    const saved = localStorage.getItem('portfolio');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultPortfolioData;
      }
    }
    return defaultPortfolioData;
  });

  const [liveData, setLiveData] = useState<Record<string, any>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', quantity: '', buyPrice: '' });
  const [successMessage, setSuccessMessage] = useState('');
  
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editBuyPrice, setEditBuyPrice] = useState<string>('');
  const [stockToDelete, setStockToDelete] = useState<{id: number, symbol: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Fix old stocks with missing or "Unknown" sectors
  useEffect(() => {
    const needsUpdate = portfolio.some(p => !p.overview?.sector || p.overview.sector === 'Unknown');
    if (!needsUpdate) return;

    let isMounted = true;
    const fixSectors = async () => {
      const newPortfolio = await Promise.all(portfolio.map(async (item) => {
        if (!item.overview?.sector || item.overview.sector === 'Unknown') {
          try {
            const res = await fetch(`/api/stock-info/${item.symbol}`);
            if (res.ok) {
              const data = await res.json();
              return {
                ...item,
                overview: {
                  ...item.overview,
                  sector: data.sector || 'Other'
                }
              };
            }
          } catch (e) {
            console.error("Failed to fix sector for", item.symbol);
          }
          return {
            ...item,
            overview: {
              ...item.overview,
              sector: 'Other'
            }
          };
        }
        return item;
      }));

      if (isMounted) {
        setPortfolio(newPortfolio);
      }
    };

    fixSectors();
    return () => { isMounted = false; };
  }, [portfolio]);

  useEffect(() => {
    let isMounted = true;
    const symbols = portfolio.map(p => p.symbol);
    if (symbols.length === 0) return;

    const fetchPrices = async () => {
      try {
        const newLiveData: Record<string, any> = {};
        await Promise.all(symbols.map(async (symbol) => {
          let formattedSymbol = symbol;
          if (!formattedSymbol.includes('.') && !formattedSymbol.startsWith('^')) {
            formattedSymbol = `${formattedSymbol}.NS`;
          }
          const res = await fetch(`/api/quote/${formattedSymbol}`);
          if (res.ok) {
            newLiveData[symbol] = await res.json();
          }
        }));
        if (isMounted) {
          setLiveData(prev => ({ ...prev, ...newLiveData }));
        }
      } catch (error) {
        console.error("Failed to fetch live prices", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [portfolio.map(p => p.symbol).join(',')]);

  const displayPortfolio = useMemo(() => {
    return portfolio.map(item => {
      let finalSector = item.overview?.sector;
      if (!finalSector || finalSector === 'Unknown') finalSector = 'Other';

      const live = liveData[item.symbol];
      if (live) {
        return {
          ...item,
          currentPrice: live.currentPrice || item.currentPrice,
          dayChange: live.dayChange || item.dayChange,
          dayChangePercent: live.dayChangePercent || item.dayChangePercent,
          name: live.name || item.name,
          overview: {
            ...item.overview,
            high: live.high || item.overview?.high,
            low: live.low || item.overview?.low,
            mcap: live.mcap || item.overview?.mcap,
            sector: finalSector
          }
        };
      }
      return {
        ...item,
        overview: {
          ...item.overview,
          sector: finalSector
        }
      };
    });
  }, [portfolio, liveData]);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStock.symbol || !newStock.quantity || !newStock.buyPrice) return;
    
    const qty = parseFloat(newStock.quantity);
    const price = parseFloat(newStock.buyPrice);
    
    if (qty <= 0 || price <= 0) return;

    let sector = "Other";
    let companyName = newStock.symbol.toUpperCase();
    
    try {
      const cacheKey = `stock_info_${newStock.symbol.toUpperCase()}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        sector = data.sector && data.sector !== "Unknown" ? data.sector : "Other";
        if (data.name) companyName = data.name;
      } else {
        const res = await fetch(`/api/stock-info/${newStock.symbol}`);
        if (res.ok) {
          const data = await res.json();
          sector = data.sector && data.sector !== "Unknown" ? data.sector : "Other";
          if (data.name) companyName = data.name;
          localStorage.setItem(cacheKey, JSON.stringify({ sector, name: companyName }));
        } else {
          sector = "Other";
        }
      }
    } catch (err) {
      console.error("Failed to fetch stock info", err);
      sector = "Other";
    }

    const stockToAdd = {
      id: Date.now(),
      symbol: newStock.symbol.toUpperCase(),
      name: companyName,
      quantity: qty,
      buyPrice: price,
      currentPrice: price, // Temporary until live data fetches
      dayChange: 0,
      dayChangePercent: 0,
      overview: { high: price, low: price, mcap: 'N/A', sector: sector },
      info: { pe: 0, eps: 0, week52High: price, week52Low: price },
      chartData: generateChartData(price),
      ai: { rec: 'HOLD', confidence: 50, risk: 'Unknown', reason: 'Newly added stock. Waiting for AI analysis.' }
    };

    setPortfolio([...portfolio, stockToAdd]);
    setIsAddModalOpen(false);
    setNewStock({ symbol: '', quantity: '', buyPrice: '' });
    
    setSuccessMessage('Stock added successfully ✅');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setEditingRow(item.id);
    setEditQuantity(item.quantity.toString());
    setEditBuyPrice(item.buyPrice.toString());
  };

  const handleSaveEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const newQty = Number(editQuantity);
    const newPrice = Number(editBuyPrice);
    if (newQty > 0 && newPrice > 0) {
      setPortfolio(prev => prev.map(stock => stock.id === id ? { ...stock, quantity: newQty, buyPrice: newPrice } : stock));
      setSuccessMessage('Stock updated ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setEditingRow(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRow(null);
  };

  const handleDelete = (e: React.MouseEvent, id: number, symbol: string) => {
    e.stopPropagation();
    setStockToDelete({ id, symbol });
  };

  const confirmDelete = () => {
    if (stockToDelete) {
      setPortfolio(prev => prev.filter(stock => stock.id !== stockToDelete.id));
      setSuccessMessage('Stock removed ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
      setStockToDelete(null);
    }
  };

  // Calculate Portfolio Metrics
  const { totalInvested, currentValue, todaysGain } = useMemo(() => {
    let invested = 0;
    let current = 0;
    let gain = 0;
    displayPortfolio.forEach(item => {
      invested += item.buyPrice * item.quantity;
      current += item.currentPrice * item.quantity;
      gain += item.dayChange * item.quantity;
    });
    return { totalInvested: invested, currentValue: current, todaysGain: gain };
  }, [displayPortfolio]);

  const totalPL = currentValue - totalInvested;
  const totalPLPercent = (totalPL / totalInvested) * 100;
  const todaysGainPercent = (todaysGain / (currentValue - todaysGain)) * 100;

  // Generate Portfolio Chart Data
  const portfolioChartData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      date: `Day ${i + 1}`,
      value: totalInvested + (i * (totalPL / 30)) + (Math.random() - 0.5) * (totalInvested * 0.02)
    }));
  }, [totalInvested, totalPL]);

  // Generate Sector Allocation Data
  const sectorAllocation = useMemo(() => {
    const allocation: Record<string, number> = {};
    displayPortfolio.forEach(item => {
      const val = item.currentPrice * item.quantity;
      allocation[item.overview.sector] = (allocation[item.overview.sector] || 0) + val;
    });
    return Object.entries(allocation).map(([name, value]) => ({ name, value }));
  }, [displayPortfolio]);

  // Generate Profit/Loss Chart Data
  const profitLossChartData = useMemo(() => {
    return displayPortfolio.map(item => ({
      name: item.symbol,
      profit: (item.currentPrice - item.buyPrice) * item.quantity
    }));
  }, [displayPortfolio]);

  return (
    <div className="w-full px-4 sm:px-6 py-4 flex flex-col gap-6 text-gray-700 dark:text-white min-h-screen bg-white dark:bg-gray-900 relative">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium animate-in fade-in slide-in-from-top-4">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investor Portfolio</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your holdings and get AI-driven insights.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </button>
      </div>

      {/* Dashboard Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="w-24 h-24 text-blue-600 dark:text-[#2962FF]" />
            </div>
            <div className="relative z-10">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Current Value</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              <div className={`text-sm font-medium flex items-center gap-1 ${todaysGain >= 0 ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                {todaysGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                {todaysGain >= 0 ? '+' : ''}₹{todaysGain.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({todaysGain >= 0 ? '+' : ''}{todaysGainPercent.toFixed(2)}%) Today
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Invested</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Return</div>
              <div className={`text-lg font-bold ${totalPL >= 0 ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                {totalPL >= 0 ? '+' : ''}₹{totalPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                <div className="text-xs opacity-80">{totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Profit/Loss per Stock</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2E39" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1E222D', borderColor: '#2A2E39', borderRadius: '8px', color: '#D1D4DC' }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Profit/Loss']}
                />
                <ReferenceLine y={0} stroke="#2A2E39" />
                <Bar dataKey="profit" radius={[4, 4, 4, 4]}>
                  {profitLossChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#089981' : '#F23645'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm mt-2">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Your Holdings</h3>
          <span className="text-xs font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white px-3 py-1 rounded-full">{displayPortfolio.length} Assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-900 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 sm:px-6 py-4 font-medium">Stock Name</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Quantity</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Buy Price</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Current Price</th>
                <th className="px-4 sm:px-6 py-4 font-medium text-right">Profit / Loss</th>
                <th className="px-4 sm:px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              {displayPortfolio.map((item) => {
                const pl = (item.currentPrice - item.buyPrice) * item.quantity;
                const plPercent = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
                const isProfit = pl >= 0;
                const isExpanded = expandedRow === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                      className={`cursor-pointer transition-colors ${isExpanded ? 'bg-gray-200 dark:bg-gray-800/40' : 'hover:bg-gray-200 dark:bg-gray-800/20'}`}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white text-base">{item.symbol}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right font-medium text-gray-700 dark:text-white">
                        {editingRow === item.id ? (
                          <input 
                            type="number" 
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded outline-none text-right"
                            min="0.01"
                            step="0.01"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-gray-500 dark:text-gray-400">
                        {editingRow === item.id ? (
                          <input 
                            type="number" 
                            value={editBuyPrice}
                            onChange={(e) => setEditBuyPrice(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-24 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded outline-none text-right"
                            min="0.01"
                            step="0.01"
                          />
                        ) : (
                          `₹${item.buyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right font-medium text-gray-900 dark:text-white">₹{item.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className={`font-bold ${isProfit ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                          {isProfit ? '+' : ''}₹{pl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-xs font-medium ${isProfit ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                          {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-gray-500 dark:text-gray-400 flex items-center justify-end gap-2">
                        {editingRow === item.id ? (
                          <>
                            <button onClick={(e) => handleSaveEdit(e, item.id)} className="p-1 text-emerald-600 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors" title="Save">
                              <Check className="w-5 h-5" />
                            </button>
                            <button onClick={handleCancelEdit} className="p-1 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors" title="Cancel">
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => handleEditClick(e, item)}
                              className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors text-blue-600 dark:text-blue-400"
                              title="Edit Stock"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, item.id, item.symbol)}
                              className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition-colors text-rose-600 dark:text-rose-400"
                              title="Delete Stock"
                            >
                              🗑
                            </button>
                            <div className="ml-2">
                              {isExpanded ? <ChevronUp className="w-5 h-5 inline" /> : <ChevronDown className="w-5 h-5 inline" />}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b-0">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-white dark:bg-gray-900"
                            >
                              <div className="p-4 sm:px-6 py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-6">
                                
                                {/* Stock Overview Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Stock Name</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.name}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Current Price</span>
                                    <div className="text-base font-bold text-gray-900 dark:text-white">₹{item.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Price Change</span>
                                    <div className={`text-base font-bold ${item.dayChange >= 0 ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                                      {item.dayChange >= 0 ? '+' : ''}₹{item.dayChange.toFixed(2)} ({item.dayChange >= 0 ? '+' : ''}{item.dayChangePercent}%)
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Day H/L</span>
                                    <div className="text-sm xl:text-base font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-x-1 leading-tight">
                                      <span>₹{item.overview.high}</span>
                                      <span className="text-gray-500 dark:text-gray-400 font-normal">/</span>
                                      <span className="text-gray-700 dark:text-white">₹{item.overview.low}</span>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Market Cap</span>
                                    <div className="text-base font-bold text-gray-900 dark:text-white">{item.overview.mcap}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sector</span>
                                    <div className="text-base font-bold text-gray-900 dark:text-white">{item.overview.sector}</div>
                                  </div>
                                </div>

                                {/* Chart */}
                                <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 h-[400px]">
                                  <StockChart symbol={item.symbol} title="Price Trend" height="100%" />
                                </div>

                                {/* Stock Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Company Name</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.name}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sector</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.overview.sector}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">P/E Ratio</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{item.info.pe}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">EPS</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">₹{item.info.eps}</div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col justify-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">52W High / Low</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-x-1 leading-tight">
                                      <span>₹{item.info.week52High}</span>
                                      <span className="text-gray-500 dark:text-gray-400 font-normal">/</span>
                                      <span className="text-gray-700 dark:text-white">₹{item.info.week52Low}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Portfolio Insight Panel */}
                                <div className="bg-[#2962FF]/10 border border-blue-600 dark:border-[#2962FF]/20 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                  <div className="flex flex-wrap gap-6 w-full md:w-auto">
                                    <div>
                                      <div className="text-xs text-blue-600 dark:text-[#2962FF] font-bold uppercase tracking-wider mb-1">Your Buy Price</div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">₹{item.buyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-blue-600 dark:text-[#2962FF] font-bold uppercase tracking-wider mb-1">Current Price</div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">₹{item.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-blue-600 dark:text-[#2962FF] font-bold uppercase tracking-wider mb-1">Profit / Loss</div>
                                      <div className={`text-lg font-bold ${isProfit ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#F23645]'}`}>
                                        {isProfit ? '+' : ''}₹{pl.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({isProfit ? '+' : ''}{plPercent.toFixed(2)}%)
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-full md:w-auto bg-white dark:bg-gray-900/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-[#2962FF] flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                                      You are currently in {Math.abs(plPercent).toFixed(2)}% {isProfit ? 'profit' : 'loss'} on this stock.
                                    </span>
                                  </div>
                                </div>

                                {/* AI Recommendation */}
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
                                  <div className={`absolute top-0 left-0 w-1.5 h-full ${item.ai.rec === 'BUY MORE' ? 'bg-emerald-500 dark:bg-[#089981]' : item.ai.rec === 'SELL' ? 'bg-rose-500 dark:bg-[#F23645]' : 'bg-amber-500 dark:bg-[#E0B324]'}`}></div>
                                  
                                  <div className="flex flex-col items-center justify-center min-w-[160px] p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <BrainCircuit className={`w-8 h-8 mb-2 ${item.ai.rec === 'BUY MORE' ? 'text-emerald-600 dark:text-[#089981]' : item.ai.rec === 'SELL' ? 'text-rose-600 dark:text-[#F23645]' : 'text-amber-600 dark:text-[#E0B324]'}`} />
                                    <div className={`text-xl font-black tracking-wider ${item.ai.rec === 'BUY MORE' ? 'text-emerald-600 dark:text-[#089981]' : item.ai.rec === 'SELL' ? 'text-rose-600 dark:text-[#F23645]' : 'text-amber-600 dark:text-[#E0B324]'}`}>
                                      {item.ai.rec}
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex flex-wrap gap-3">
                                      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <Activity className="w-4 h-4 text-emerald-600 dark:text-[#089981]" />
                                        <span className="text-xs font-bold text-gray-700 dark:text-white">Confidence Score: {item.ai.confidence}%</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-[#2962FF]" />
                                        <span className="text-xs font-bold text-gray-700 dark:text-white">Risk Level: {item.ai.risk}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                      {item.ai.reason}
                                    </p>
                                  </div>
                                </div>

                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Stock Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Stock to Portfolio</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddStock} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Symbol</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. TCS, INFY"
                    value={newStock.symbol}
                    onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 10"
                    value={newStock.quantity}
                    onChange={(e) => setNewStock({...newStock, quantity: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buy Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 1500.50"
                    value={newStock.buyPrice}
                    onChange={(e) => setNewStock({...newStock, buyPrice: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Add Stock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {stockToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Remove Stock</h3>
                <button onClick={() => setStockToDelete(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{stockToDelete.symbol}</span> from your portfolio? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setStockToDelete(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
