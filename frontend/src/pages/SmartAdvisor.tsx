import { BrainCircuit, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SmartAdvisor() {
  const predictionData = [
    { date: 'Today', predicted: 2950 },
    { date: 'Day 1', predicted: 2965 },
    { date: 'Day 2', predicted: 2980 },
    { date: 'Day 3', predicted: 2975 },
    { date: 'Day 4', predicted: 3010 },
    { date: 'Day 5', predicted: 3045 },
    { date: 'Day 6', predicted: 3030 },
    { date: 'Day 7', predicted: 3060 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#2962FF] text-white flex items-center justify-center shadow-lg shadow-[#2962FF]/20">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Investment Advisor</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">AI-powered trading signals and predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 dark:bg-[#089981]/10 rounded-bl-full -z-10"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">RELIANCE</h3>
              <span className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded">NSE</span>
            </div>

            <div className="text-center py-6 border-y border-gray-200 dark:border-gray-800/50 mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500 dark:bg-[#089981]/20 text-emerald-600 dark:text-[#089981] mb-4 shadow-inner">
                <span className="text-2xl font-black tracking-wider">BUY</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI Confidence Score</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">87%</div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI Reasoning</h4>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#089981] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-white leading-relaxed">
                  Stock shows strong upward trend with RSI above 60 and positive news sentiment regarding Q4 earnings.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#089981] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-white leading-relaxed">
                  Moving Average crossover (50 DMA crossed above 200 DMA) indicates long-term bullish momentum.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-[#E0B324] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-white leading-relaxed">
                  Resistance expected near ₹3050 levels. Consider booking partial profits if momentum slows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">7-Day Price Prediction</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Based on historical patterns and current sentiment</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-[#089981] bg-emerald-500 dark:bg-[#089981]/10 px-3 py-1.5 rounded-lg border border-[#089981]/20">
                <TrendingUp className="w-4 h-4" />
                Target: ₹3060
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2962FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2E39" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#787B86', fontSize: 12 }} dy={10} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} axisLine={false} tickLine={false} tick={{ fill: '#787B86', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#131722', borderColor: '#2A2E39', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#D1D4DC', fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="#2962FF" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 bg-[#2962FF]/10 rounded-xl border border-blue-600 dark:border-[#2962FF]/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-[#2962FF] shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-white">
                <strong>Disclaimer:</strong> AI predictions are based on probabilistic models and historical data. They do not guarantee future performance. Always do your own research before investing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
