import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Code, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export default function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, name);
      
      // Check if Supabase is configured and email confirmation is required
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isConfigured = supabaseUrl && supabaseUrl.includes('supabase.co');
      
      if (isConfigured && result) {
        // Show confirmation message for Supabase signups (email confirmation required)
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Show success message if email confirmation is required
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white mx-auto mb-4 flex items-center justify-center">
              <Code className="w-8 h-8" style={{ color: '#131313' }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">MoviAPI</h1>
            <p className="text-white">Account created successfully!</p>
          </div>

          <div className="border border-white p-8" style={{ backgroundColor: '#212121' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-4">Check your email</h2>
              <p className="text-white mb-6">
                We've sent a confirmation link to <strong>{email}</strong>. 
                Please check your email and click the link to activate your account.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-white opacity-60">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full bg-white text-black font-medium py-3 hover:bg-gray-100 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onToggleMode}
                  className="w-full border border-white text-white font-medium py-3 hover:bg-white hover:text-black transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white mx-auto mb-4 flex items-center justify-center">
            <Code className="w-8 h-8" style={{ color: '#131313' }} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MoviAPI</h1>
          <p className="text-white">Create your account</p>
        </div>

        <div className="border border-white p-8" style={{ backgroundColor: '#212121' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-500 text-red-500 text-sm" style={{ backgroundColor: '#131313' }}>
                {error}
              </div>
            )}

            <div className="p-4 border border-blue-500 text-blue-400 text-sm" style={{ backgroundColor: '#131313' }}>
              <p className="font-medium mb-2">New Account Benefits:</p>
              <ul className="text-xs space-y-1">
                <li>• Email verification required for security</li>
                <li>• Start with 0 credits - purchase credits to begin</li>
                <li>• Automatic API key generation</li>
                <li>• Full access to all APIs</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-white text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                  style={{ backgroundColor: '#131313' }}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white">
              Already have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-white hover:text-gray-300 font-medium underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}