import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Code, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn } = useAuth();

  // Check for confirmation message in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('confirmed') === 'true') {
      setMessage('Email confirmed successfully! You can now sign in.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white mx-auto mb-4 flex items-center justify-center">
            <Code className="w-8 h-8" style={{ color: '#131313' }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MoviAPI</h1>
          <p className="text-white">Sign in to your account</p>
        </div>

        <div className="border border-white p-8" style={{ backgroundColor: '#212121' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="p-4 border border-green-500 text-green-400 text-sm" style={{ backgroundColor: '#131313' }}>
                {message}
              </div>
            )}
            
            {error && (
              <div className="p-4 border border-red-500 text-red-500 text-sm" style={{ backgroundColor: '#131313' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-white text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white">
              Don't have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-white hover:text-gray-300 font-medium underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}