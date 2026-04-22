import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function UPISettings() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl min-h-[600px]">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/app/settings')} className="p-2 hover:bg-gray-200 dark:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">UPI Settings</h1>
        </div>
        <div className="p-6 space-y-6">
          <button className="flex items-center gap-2 text-blue-600 dark:text-[#2962FF] hover:text-blue-400 font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add New UPI ID
          </button>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-200">user@okicici</p>
                <p className="text-xs text-green-500 mt-1">Primary • Verified</p>
              </div>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-200">user@okhdfcbank</p>
                <p className="text-xs text-gray-500 mt-1">Verified</p>
              </div>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
