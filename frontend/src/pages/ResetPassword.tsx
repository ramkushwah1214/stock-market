import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('/api/reset-password', { 
        token,
        newPassword 
      });
      
      setMessage({ type: 'success', text: response.data.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to reset password. The link may be invalid or expired.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600 dark:text-[#2962FF]">
          <LineChart className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-200 dark:border-gray-800">
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">New Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-600 dark:focus:ring-[#2962FF] focus:border-blue-600 dark:focus:border-[#2962FF] block w-full pl-10 pr-10 sm:text-sm border-gray-200 dark:border-gray-800 rounded-md py-2 border outline-none" 
                  placeholder="••••••••" 
                  disabled={message?.type === 'success'}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Confirm New Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-600 dark:focus:ring-[#2962FF] focus:border-blue-600 dark:focus:border-[#2962FF] block w-full pl-10 pr-10 sm:text-sm border-gray-200 dark:border-gray-800 rounded-md py-2 border outline-none" 
                  placeholder="••••••••" 
                  disabled={message?.type === 'success'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading || message?.type === 'success'}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 dark:text-white bg-[#2962FF] hover:bg-[#2962FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-[#2962FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
