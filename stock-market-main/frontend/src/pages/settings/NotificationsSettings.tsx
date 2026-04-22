import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotificationsSettings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-[#2962FF]' : 'bg-gray-600'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl min-h-[600px]">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/app/settings')} className="p-2 hover:bg-gray-200 dark:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Notifications</h1>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-200">Email Notifications</p>
                <p className="text-xs text-gray-500 mt-1">Receive daily summaries and alerts</p>
              </div>
              <Toggle enabled={email} onToggle={() => setEmail(!email)} />
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-200">Push Notifications</p>
                <p className="text-xs text-gray-500 mt-1">Instant alerts on your device</p>
              </div>
              <Toggle enabled={push} onToggle={() => setPush(!push)} />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-gray-200">SMS Alerts</p>
                <p className="text-xs text-gray-500 mt-1">Important security and trade alerts</p>
              </div>
              <Toggle enabled={sms} onToggle={() => setSms(!sms)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
