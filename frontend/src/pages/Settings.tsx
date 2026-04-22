import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Bell, CreditCard, Lock, Key, Smartphone, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-[#2962FF]' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const Row = ({ icon: Icon, title, rightElement, onClick }: any) => (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-5 py-4 border-b border-gray-300 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer last:border-b-0`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{title}</span>
      </div>
      <div className="flex items-center">
        {rightElement || <ChevronRight className="w-5 h-5 text-gray-500" />}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        </div>

        <div className="p-6 space-y-8">
          {/* APP PREFERENCES */}
          <div>
            <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-2 px-2">App Preferences</h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
              <Row
                icon={Moon}
                title="Dark Mode"
                rightElement={<Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />}
                onClick={() => setDarkMode(!darkMode)}
              />
              <Row
                icon={Bell}
                title="Manage Notifications"
                onClick={() => navigate('/app/settings/notifications')}
              />
            </div>
          </div>

          {/* PAYMENTS */}
          <div>
            <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-2 px-2">Payments</h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
              <Row
                icon={CreditCard}
                title="UPI Settings"
                onClick={() => navigate('/app/settings/upi')}
              />
            </div>
          </div>

          {/* PRIVACY & SECURITY */}
          <div>
            <h2 className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-2 px-2">Privacy & Security</h2>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
              <Row
                icon={Lock}
                title="Change Password"
                onClick={() => navigate('/app/settings/password')}
              />
              <Row
                icon={Key}
                title="Change PIN"
                onClick={() => navigate('/app/settings/pin')}
              />
              <Row
                icon={Smartphone}
                title="Active Devices"
                onClick={() => navigate('/app/settings/devices')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
