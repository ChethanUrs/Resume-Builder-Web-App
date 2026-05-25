import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    if (!email || !password) {
      setValidationError('Please fill in all email and password fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 relative">
      
      {/* Visual background lights */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl z-10">
        
        {/* Logo Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-2xl text-white shadow-lg mb-3">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-display bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Elevate<span className="text-primary-500">Chat</span>
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Connect instantly with real-time messages and WebRTC video calls.</p>
        </div>

        {/* Validation Errors */}
        {(validationError || apiError) && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{validationError || apiError}</span>
          </div>
        )}

        {/* Input fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="glass-input w-full pl-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-11"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary-500 hover:underline">
            Register Account
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
