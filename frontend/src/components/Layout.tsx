import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  LineChart, 
  BrainCircuit, 
  ArrowRightLeft, 
  Newspaper, 
  Bot, 
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProfileDropdown from './ProfileDropdown';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Beginner Mode', path: '/app/beginner', icon: GraduationCap },
    { name: 'Investor Portfolio', path: '/app/portfolio', icon: Briefcase },
    { name: 'Stock Analysis', path: '/app/analysis', icon: LineChart },
    { name: 'Smart Advisor', path: '/app/advisor', icon: BrainCircuit },
    { name: 'Stock Comparison', path: '/app/compare', icon: ArrowRightLeft },
    { name: 'News Sentiment', path: '/app/news', icon: Newspaper },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans relative w-full overflow-hidden">
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-800 z-50 flex flex-col transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-300 dark:border-gray-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-[#2962FF] font-bold text-xl">
            <LineChart className="w-6 h-6" />
            <span className="text-gray-900 dark:text-white">AI Invest</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:bg-gray-800 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#2962FF]/10 text-blue-600 dark:text-[#2962FF]" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(true)}
              className="text-gray-900 dark:text-white text-xl p-2 rounded-md hover:bg-gray-200 dark:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden md:block">
              InsightVest
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 dark:bg-[#089981]/10 text-emerald-600 dark:text-[#089981] text-xs font-medium border border-[#089981]/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#089981] animate-pulse"></span>
              Market Open
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <input 
                type="text" 
                placeholder="Search stocks, indices..." 
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-blue-600 dark:focus:border-[#2962FF] outline-none transition-all w-64"
              />
            </div>
            
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <ProfileDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
          
          {/* AI Chatbot Floating Avatar */}
          <button 
            onClick={() => navigate('/app/chat')}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 animate-pulse"
            title="Ask AI"
          >
            <Bot className="w-6 h-6 text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}
