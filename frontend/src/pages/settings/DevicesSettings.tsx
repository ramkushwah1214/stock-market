import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone as PhoneIcon } from 'lucide-react';

export default function DevicesSettings() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl min-h-[600px]">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/app/settings')} className="p-2 hover:bg-gray-200 dark:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Active Devices</h1>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-400 mb-4">You are currently logged in on these devices. If you don't recognize a device, log out immediately.</p>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                  <Monitor className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">MacBook Pro - Chrome</p>
                  <p className="text-xs text-green-500 mt-1">Active Now • Mumbai, India</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                  <PhoneIcon className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">iPhone 13 - iOS App</p>
                  <p className="text-xs text-gray-500 mt-1">Last seen 2 days ago • Delhi, India</p>
                </div>
              </div>
              <button className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
