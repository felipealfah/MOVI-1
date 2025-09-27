import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Code } from 'lucide-react';

export default function AuthCallback() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Wait a moment for the auth state to update
      setTimeout(async () => {
        await refreshUser();
        // Redirect to dashboard
        window.location.href = '/';
      }, 2000);
    };

    handleCallback();
  }, [refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
      <div className="text-center">
        <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
          <Code className="w-8 h-8 animate-pulse" style={{ color: '#131313' }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">MoviAPI</h1>
        <p className="text-white opacity-60">Confirming your email...</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}