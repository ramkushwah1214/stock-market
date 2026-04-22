import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStockData } from '../hooks/useStockData';

interface StockChartProps {
  symbol: string;
  title?: string;
  height?: number | string;
  showFilters?: boolean;
}

export default function StockChart({ symbol, title, height = 300, showFilters = true }: StockChartProps) {
  const [timeRange, setTimeRange] = useState("1D");
  const { data, loading, error } = useStockData(symbol, timeRange);
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-full flex flex-col">
      {(title || showFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
          
          {showFilters && (
            <div className="flex gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 self-start sm:self-auto">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <button 
                  key={tf} 
                  onClick={() => setTimeRange(tf)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    tf === timeRange 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ height }} className="w-full relative">
        {loading && chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10 rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-rose-500 text-sm font-medium">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Chart data not available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2E39" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#787B86', fontSize: 12 }} 
                dy={10} 
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#787B86', fontSize: 12 }} 
                dx={-10} 
                tickFormatter={(val) => Number(val || 0).toLocaleString('en-IN')}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb', 
                  backgroundColor: '#ffffff', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
                itemStyle={{ color: '#111827', fontWeight: 600 }}
                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                formatter={(value: number) => [`₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2962FF" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6, fill: '#2962FF', stroke: '#fff', strokeWidth: 2 }} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
