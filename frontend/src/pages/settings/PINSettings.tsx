import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PINSettings() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl min-h-[600px]">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/app/settings')} className="p-2 hover:bg-gray-200 dark:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Change PIN</h1>
        </div>
        <div className="p-6 max-w-md">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Current PIN</label>
              <input type="password" maxLength={4} placeholder="••••" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-[#2962FF] tracking-widest" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">New PIN</label>
              <input type="password" maxLength={4} placeholder="••••" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-[#2962FF] tracking-widest" />
            </div>
            <button type="submit" className="w-full bg-[#2962FF] hover:bg-blue-600 text-gray-900 dark:text-white font-medium py-2.5 rounded-lg transition-colors mt-6">
              Update PIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
