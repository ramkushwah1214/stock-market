import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Mail, Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';


export default function AuthPage({ isLoginRoute = true }: { isLoginRoute?: boolean }) {
  const [isLogin, setIsLogin] = useState(isLoginRoute);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [investorType, setInvestorType] = useState<'beginner' | 'existing'>('beginner');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user } = useAuth();

  useEffect(() => {
    setIsLogin(isLoginRoute);
    setError(null);
  }, [isLoginRoute]);

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const switchMode = () => {
    const nextIsLogin = !isLogin;
    setIsLogin(nextIsLogin);
    setError(null);
    navigate(nextIsLogin ? '/login' : '/signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ fullname, email, password, investorType });
      }

      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || '/app/dashboard', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(String(err.response?.data?.error || err.response?.data?.message || err.message));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600 dark:text-[#2962FF]">
          <LineChart className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Or{' '}
          <button
            onClick={switchMode}
            className="font-medium text-blue-600 dark:text-[#2962FF] hover:text-blue-600 dark:hover:text-[#2962FF]/80"
          >
            {isLogin ? 'create a new account' : 'sign in to your existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-200 dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    type="text"
                    required
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-600 dark:focus:ring-[#2962FF] focus:border-blue-600 dark:focus:border-[#2962FF] block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-800 rounded-md py-2 border outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-600 dark:focus:ring-[#2962FF] focus:border-blue-600 dark:focus:border-[#2962FF] block w-full pl-10 sm:text-sm border-gray-200 dark:border-gray-800 rounded-md py-2 border outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-600 dark:focus:ring-[#2962FF] focus:border-blue-600 dark:focus:border-[#2962FF] block w-full pl-10 pr-10 sm:text-sm border-gray-200 dark:border-gray-800 rounded-md py-2 border outline-none"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setInvestorType('beginner')}
                    className={`border rounded-lg p-3 text-center transition-colors ${
                      investorType === 'beginner'
                        ? 'border-blue-600 dark:border-[#2962FF] bg-[#2962FF]/10 text-blue-600 dark:text-[#2962FF]'
                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-[#2962FF]/30'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Beginner Investor</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">New to market</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestorType('existing')}
                    className={`border rounded-lg p-3 text-center transition-colors ${
                      investorType === 'existing'
                        ? 'border-blue-600 dark:border-[#2962FF] bg-[#2962FF]/10 text-blue-600 dark:text-[#2962FF]'
                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-[#2962FF]/30'
                    }`}
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Existing Investor</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Portfolio holder</p>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 dark:text-[#2962FF] focus:ring-blue-600 dark:focus:ring-[#2962FF] border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-white">
                  Remember me
                </label>
              </div>

              {isLogin && (
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="font-medium text-blue-600 dark:text-[#2962FF] hover:text-blue-600 dark:hover:text-[#2962FF]/80"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
                {error}
              </div>
            )}

            <div>
              <button
                disabled={submitting}
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 dark:text-white bg-[#2962FF] hover:bg-[#2962FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-[#2962FF] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Secure & Encrypted</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center text-emerald-600 dark:text-[#089981]">
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
