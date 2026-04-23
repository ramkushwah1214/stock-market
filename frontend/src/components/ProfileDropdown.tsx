import React, { useEffect, useRef, useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';


export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (action: () => void | Promise<void>) => {
    void Promise.resolve(action()).finally(() => setIsOpen(false));
  };

  const initials = user?.fullname
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'US';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1E222D] transition-all"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullname || 'User'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</div>
          </div>
          <div
            onClick={() => handleSelect(() => navigate('/app/profile'))}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </div>
          <div
            onClick={() => handleSelect(() => navigate('/app/settings'))}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
          <div
            onClick={() => handleSelect(async () => {
              await logout();
              navigate('/login');
            })}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}
