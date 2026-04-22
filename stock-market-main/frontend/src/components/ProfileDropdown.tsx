import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[#2962FF] text-white flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1E222D] transition-all"
      >
        RK
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
          <div
            onClick={() => handleSelect(() => navigate('/app/profile'))}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </div>
          <div
            onClick={() => handleSelect(() => navigate('/app/settings'))}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 cursor-pointer transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
          <div
            onClick={() => handleSelect(() => navigate('/'))}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 cursor-pointer transition-colors text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}
