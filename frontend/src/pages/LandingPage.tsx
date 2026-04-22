import React from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, BarChart2, Globe, Zap, Shield, ChevronRight, LineChart, Menu, BrainCircuit, Sparkles, Activity, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';
import MarketTicker from '../components/MarketTicker';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-600 dark:text-gray-300 selection:bg-indigo-500/30 overflow-x-hidden">
      
      <MarketTicker />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 bg-transparent absolute top-12 w-full z-40">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gray-900 dark:text-white" />
          </div>
          <span>AI Invest</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800/60 rounded-full px-2 py-1.5 backdrop-blur-md shadow-lg shadow-black/20">
          <a href="#features" className="px-5 py-2 rounded-full hover:bg-gray-100 dark:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300">
            Platform
          </a>
          <a href="#markets" className="px-5 py-2 rounded-full hover:bg-gray-100 dark:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300">
            Intelligence
          </a>
          <a href="#community" className="px-5 py-2 rounded-full hover:bg-gray-100 dark:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white transition-all duration-300">
            Solutions
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors">
            Get Started
          </Link>
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center min-h-screen justify-center">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-slate-700/50 text-indigo-400 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Investing</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter leading-[1.1] max-w-5xl"
        >
          Invest with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">artificial intelligence.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl font-light"
        >
          Leave the complex charts behind. Our AI analyzes millions of data points to give you clear, actionable investment insights in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10"
        >
          <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-gray-900 dark:text-white font-medium text-lg rounded-full hover:bg-indigo-700 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
            Start Investing Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Floating UI Elements Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative w-full max-w-5xl h-[400px] md:h-[500px] rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 overflow-hidden shadow-2xl flex items-center justify-center"
        >
          {/* Abstract Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
          
          {/* Floating Cards */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-center w-full px-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full md:w-80 shadow-xl transform md:-translate-y-8">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">R</div>
                <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">+2.4%</span>
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium text-lg">Reliance Ind.</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">AI Confidence: 92%</p>
              <div className="h-16 w-full flex items-end gap-1">
                {[40, 30, 50, 40, 60, 50, 70, 60, 80, 70, 90, 100].map((h, i) => (
                  <div key={i} className="w-full bg-blue-500/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>

            {/* Card 2 - Center Focus */}
            <div className="bg-white dark:bg-gray-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 w-full md:w-96 shadow-[0_0_50px_rgba(79,70,229,0.15)] z-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white font-medium">Smart Portfolio</h3>
                  <p className="text-indigo-400 text-sm">Optimized 2 mins ago</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Tech Growth</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Green Energy</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">30%</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full md:w-80 shadow-xl transform md:translate-y-8 hidden md:block">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-gray-900 dark:text-white font-medium">Market Pulse</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                "Tech sector showing strong accumulation patterns. Consider increasing exposure to mid-cap IT."
              </p>
              <button className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-slate-700 transition-colors">
                View Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-8">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Trusted by innovative investors at</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex whitespace-nowrap items-center gap-16 md:gap-32 py-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><Globe className="w-8 h-8 text-blue-400"/> GlobalTech</div>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><Zap className="w-8 h-8 text-amber-400"/> NexusCap</div>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><Shield className="w-8 h-8 text-emerald-400"/> SecureFund</div>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><BarChart2 className="w-8 h-8 text-indigo-400"/> AlphaVentures</div>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><LineChart className="w-8 h-8 text-purple-400"/> QuantEdge</div>
                <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white mx-8"><Activity className="w-8 h-8 text-rose-400"/> ApexTrading</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-200 dark:border-gray-800/50 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Assets Analyzed", value: "$2B+" },
              { label: "Active Users", value: "50k+" },
              { label: "AI Predictions", value: "1M+" },
              { label: "Avg. Return", value: "18.4%" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Intelligence over information.</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">We process the noise so you don't have to. Experience a platform designed for clarity, speed, and precision.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Feature */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
            <BrainCircuit className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Predictive AI Models</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">Our proprietary algorithms analyze historical data, sentiment, and macro-economic factors to forecast potential market movements with high accuracy.</p>
          </div>
          
          {/* Small Feature */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <Zap className="w-10 h-10 text-amber-400 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Alerts</h3>
            <p className="text-gray-500 dark:text-gray-400">Get notified instantly when your portfolio needs attention or a new opportunity arises.</p>
          </div>

          {/* Small Feature */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
            <Shield className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Risk Management</h3>
            <p className="text-gray-500 dark:text-gray-400">Automated stop-losses and portfolio rebalancing to protect your downside.</p>
          </div>

          {/* Large Feature */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 relative overflow-hidden">
            <Globe className="w-10 h-10 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Global Sentiment Analysis</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">We track news, social media, and financial reports globally to gauge the true sentiment around any asset before you invest.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">How AI Invest Works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">Three simple steps to smarter investing.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-purple-500/0 -translate-y-1/2 z-0"></div>
          
          {[
            { step: "01", title: "Connect Account", desc: "Securely link your brokerage account in seconds.", icon: <Shield className="w-6 h-6 text-indigo-400" /> },
            { step: "02", title: "AI Analysis", desc: "Our models analyze your portfolio and market conditions.", icon: <BrainCircuit className="w-6 h-6 text-purple-400" /> },
            { step: "03", title: "Execute Trades", desc: "Review AI recommendations and execute with one click.", icon: <Zap className="w-6 h-6 text-amber-400" /> }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center bg-white dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                {item.icon}
              </div>
              <div className="text-indigo-500 font-mono font-bold text-xl mb-2">{item.step}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800/50">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/50 border border-slate-700/50 text-emerald-400 text-sm font-medium mb-6"
          >
            <Users className="w-4 h-4" />
            <span>Community Driven</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Don't just take our word for it.</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">See how AI Invest is transforming the portfolios of thousands of investors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Rahul S.", role: "Day Trader", text: "The predictive AI models spotted the tech breakout 2 days before the mainstream news. Incredible tool." },
            { name: "Priya M.", role: "Long-term Investor", text: "I've completely automated my portfolio rebalancing. The risk management features let me sleep peacefully." },
            { name: "Amit K.", role: "Financial Analyst", text: "The global sentiment analysis aggregates data that would take my team hours to compile. A game changer." }
          ].map((testimonial, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-indigo-500/30 transition-all hover:-translate-y-1 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed relative z-10">"{testimonial.text}"</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-gray-900 dark:text-white font-bold shadow-lg">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium text-sm">{testimonial.name}</div>
                  <div className="text-slate-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-gradient-to-b from-slate-900 to-[#050505] border border-gray-200 dark:border-gray-800 rounded-3xl p-12 relative overflow-hidden group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative z-10 tracking-tight">Stop guessing. Start knowing.</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 relative z-10">Join thousands of modern investors using AI to build wealth.</p>
          <motion.div
            animate={{ 
              boxShadow: ["0px 0px 0px 0px rgba(99,102,241,0.6)", "0px 0px 20px 15px rgba(99,102,241,0)", "0px 0px 0px 0px rgba(99,102,241,0)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block rounded-full relative z-10"
          >
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-slate-200 transition-all">
              Create Free Account
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gray-900 dark:text-white" />
            </div>
            <span>AI Invest</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-slate-600 text-sm">© 2026 AI Invest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

