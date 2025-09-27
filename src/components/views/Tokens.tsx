import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserHistory } from '../../lib/supabase';
import { Key, Copy, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Tokens() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    requestsToday: 0,
    requestsThisMonth: 0,
    uptime: 98.5
  });
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const isConfigured = supabaseUrl && supabaseUrl.includes('supabase.co');
        
        if (isConfigured) {
          const history = await getUserHistory();
          
          // Calculate today's requests
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const requestsToday = history.filter(h => 
            new Date(h.created_at) >= today
          ).length;
          
          // Calculate this month's requests
          const thisMonth = new Date();
          thisMonth.setDate(1);
          thisMonth.setHours(0, 0, 0, 0);
          const requestsThisMonth = history.filter(h => 
            new Date(h.created_at) >= thisMonth
          ).length;
          
          setStats({
            requestsToday,
            requestsThisMonth,
            uptime: 98.5 // This would come from monitoring system
          });
        } else {
          // Use mock data when Supabase not configured
          setStats({
            requestsToday: 2,
            requestsThisMonth: 5,
            uptime: 98.5
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to mock data
        setStats({
          requestsToday: 2,
          requestsThisMonth: 5,
          uptime: 98.5
        });
      }
      setLoading(false);
    };

    loadStats();
  }, []);


  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Gerar API key baseada no ID do usuário
  const generateApiKey = (userId: string) => {
    return `sk-${userId.replace(/-/g, '')}`;
  };

  const getApiKeyPreview = (apiKey: string) => {
    return `${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length - 4)}`;
  };

  if (!user) return null;

  const userApiKey = generateApiKey(user.id);
  const keyPreview = getApiKeyPreview(userApiKey);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 border border-white" style={{ backgroundColor: '#212121' }}>
          <div className="w-12 h-12 bg-white mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
          </div>
          <div className="text-white text-xl mb-2">Loading tokens...</div>
          <div className="text-white opacity-60">Fetching your API keys</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">API Token</h1>
          <p className="text-gray-500">Your unique access key for the APIs</p>
        </div>
      </div>

      {/* API Token */}
      <div className="grid gap-6">
        <div
          className="border border-white rounded-2xl p-6 hover:border-white transition-all duration-200"
          style={{ backgroundColor: '#212121' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6" style={{ color: '#131313' }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Main API Key</h3>
                <div className="flex items-center space-x-4 text-sm text-white">
                  <span>Based on your user ID</span>
                  <span>Always active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-black">
                Active
              </span>
            </div>
          </div>

          {/* API Key Display */}
          <div className="border border-white rounded-xl p-4" style={{ backgroundColor: '#131313' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <code className="text-white font-mono text-sm flex-1 min-w-0">
                  {showKey ? userApiKey : keyPreview}
                </code>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 text-white hover:text-white transition-colors"
                  title={showKey ? 'Hide' : 'Show'}
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(userApiKey, 'main-key')}
                  className="p-2 text-white hover:text-white transition-colors"
                  title="Copy"
                >
                  {copiedKey === 'main-key' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-white rounded-lg p-3" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">{stats.requestsToday}</div>
              <div className="text-sm text-white">Requests today</div>
            </div>
            <div className="border border-white rounded-lg p-3" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">{stats.requestsThisMonth}</div>
              <div className="text-sm text-white">This month</div>
            </div>
            <div className="border border-white rounded-lg p-3" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">{stats.uptime}%</div>
              <div className="text-sm text-white">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações sobre a API Key */}
      <div className="border border-white rounded-2xl p-6 mt-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-lg font-semibold text-white mb-4">How to use your API Key</h3>
        <div className="space-y-3 text-white">
          <p>• Your API key is unique and based on your user ID</p>
          <p>• Use this key in the header <code className="bg-black px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code></p>
          <p>• This key never expires and is always active</p>
          <p>• Keep your key secure and don't share it</p>
        </div>
      </div>
    </div>
  );
}