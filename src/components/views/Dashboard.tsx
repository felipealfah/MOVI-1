import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useState, useEffect } from 'react';
import BuyCreditsModal from '../payments/BuyCreditsModal';
import { ApiEndpoint } from '../../lib/supabase';
import { TrendingUp, Code, Clock, DollarSign, Activity, Cpu, Key, History, Zap } from 'lucide-react';

interface DashboardProps {
  onViewChange?: (view: 'dashboard' | 'apis' | 'tokens' | 'history' | 'profile') => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {
  const { user } = useAuth();
  const { history, apiEndpoints, loading } = useData();
  const [popularApis, setPopularApis] = useState<{ api: ApiEndpoint; count: number }[]>([]);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  // Calculate popular APIs when data changes
  useEffect(() => {
    if (history.length > 0 && apiEndpoints.length > 0) {
      const apiUsage = history.reduce((acc, request) => {
        acc[request.api_id] = (acc[request.api_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const popular = Object.entries(apiUsage)
        .map(([apiId, count]) => ({
          api: apiEndpoints.find(api => api.id === apiId)!,
          count
        }))
        .filter(item => item.api)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setPopularApis(popular);
    }
  }, [history, apiEndpoints]);

  const recentActivity = history.slice(0, 5);

  if (!user) return null;

  // Calculate real stats from history data
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const historyThisMonth = history.filter(h =>
    new Date(h.created_at) >= thisMonth
  );

  const totalRequests = historyThisMonth.length;
  const successRequests = historyThisMonth.filter(h =>
    h.status === 'success' || h.status === 'done'
  ).length;
  const totalCostsThisMonth = historyThisMonth.reduce((sum, h) =>
    sum + (h.credits_cost || 0), 0
  );
  const successRate = totalRequests > 0
    ? ((successRequests / totalRequests) * 100).toFixed(1)
    : '0.0';

  const handleViewChange = (view: 'dashboard' | 'apis' | 'tokens' | 'history' | 'profile') => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'done':
        return 'text-green-700';
      case 'error':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => handleViewChange('apis')}
          className="group relative overflow-hidden p-8 border border-white hover:border-white transition-all duration-300" 
          style={{ backgroundColor: '#212121' }}
        >
          <div className="relative z-10 text-left">
            <div className="w-16 h-16 bg-white flex items-center justify-center mb-6">
              <Cpu className="w-8 h-8" style={{ color: '#131313' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 transition-colors duration-300">Models</h2>
            <p className="text-white opacity-80 transition-colors duration-300">
              Explore and integrate our APIs
            </p>
            <div className="mt-6 flex items-center text-white opacity-60 transition-colors duration-300">
              <span className="text-sm">View APIs →</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleViewChange('tokens')}
          className="group relative overflow-hidden p-8 border border-white hover:border-white transition-all duration-300" 
          style={{ backgroundColor: '#212121' }}
        >
          <div className="relative z-10 text-left">
            <div className="w-16 h-16 bg-white flex items-center justify-center mb-6">
              <Key className="w-8 h-8" style={{ color: '#131313' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 transition-colors duration-300">API Tokens</h2>
            <p className="text-white opacity-80 transition-colors duration-300">
              Manage your API access keys
            </p>
            <div className="mt-6 flex items-center text-white opacity-60 transition-colors duration-300">
              <span className="text-sm">Manage Tokens →</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleViewChange('history')}
          className="group relative overflow-hidden p-8 border border-white hover:border-white transition-all duration-300" 
          style={{ backgroundColor: '#212121' }}
        >
          <div className="relative z-10 text-left">
            <div className="w-16 h-16 bg-white flex items-center justify-center mb-6">
              <History className="w-8 h-8" style={{ color: '#131313' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 transition-colors duration-300">History</h2>
            <p className="text-white opacity-80 transition-colors duration-300">
              Track your API usage and generations
            </p>
            <div className="mt-6 flex items-center text-white opacity-60 transition-colors duration-300">
              <span className="text-sm">View History →</span>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border border-white hover:bg-white transition-all duration-300 group" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-white" />
            <span className="text-xs text-white opacity-60">+12%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{user.credits.toLocaleString()}</div>
          <div className="text-sm text-white opacity-60">Available Credits</div>
        </div>
        
        <div className="p-6 border border-white hover:bg-white transition-all duration-300 group" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-white" />
            <span className="text-xs text-white opacity-60">+24%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalRequests}</div>
          <div className="text-sm text-white opacity-60">Requests This Month</div>
        </div>
        
        <div className="p-6 border border-white hover:bg-white transition-all duration-300 group" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
            <span className="text-xs text-white opacity-60">+5.2%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{successRate}%</div>
          <div className="text-sm text-white opacity-60">Success Rate</div>
        </div>
        
        <div className="p-6 border border-white hover:bg-white transition-all duration-300 group" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-white" />
            <span className="text-xs text-white opacity-60">+8%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalCostsThisMonth}</div>
          <div className="text-sm text-white opacity-60">Spent This Month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 p-6 border border-white" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            </div>
            <button 
              onClick={() => handleViewChange('history')}
              className="text-white opacity-60 hover:opacity-100 text-sm"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto mb-4"></div>
                <p className="text-white opacity-60">Loading activity...</p>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border border-white" style={{ backgroundColor: '#131313' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white flex items-center justify-center">
                      <Zap className="w-4 h-4" style={{ color: '#131313' }} />
                    </div>
                    <div>
                      <p className="text-white font-medium">API Request</p>
                      <p className="text-white opacity-60 text-sm">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </p>
                    <p className="text-white opacity-60 text-sm">{activity.tempo}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-white mx-auto mb-4 opacity-50" />
                <p className="text-white opacity-60">No recent activity</p>
                <p className="text-white opacity-40 text-sm">Start using APIs to see your activity here</p>
              </div>
            )}
          </div>
        </div>

        {/* API Performance */}
        <div className="p-6 border border-white" style={{ backgroundColor: '#212121' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Code className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Popular APIs</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto mb-4"></div>
                <p className="text-white opacity-60">Loading APIs...</p>
              </div>
            ) : popularApis.length > 0 ? (
              popularApis.map((item, index) => (
                <div key={item.api.id} className="flex items-center justify-between p-3 border border-white" style={{ backgroundColor: '#131313' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white flex items-center justify-center">
                      <span className="text-black font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.api.name}</p>
                      <p className="text-white opacity-60 text-sm">{item.api.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{item.count}</p>
                    <p className="text-white opacity-60 text-sm">uses</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-white mx-auto mb-4 opacity-50" />
                <p className="text-white opacity-60">No API usage yet</p>
                <p className="text-white opacity-40 text-sm">Start making API calls to see statistics</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-white border-opacity-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3" style={{ backgroundColor: '#131313' }}>
                <div className="text-lg font-bold text-white">
                  {recentActivity.filter(a => a.status === 'success' || a.status === 'done').length}
                </div>
                <div className="text-xs text-white opacity-60">Success</div>
              </div>
              <div className="text-center p-3" style={{ backgroundColor: '#131313' }}>
                <div className="text-lg font-bold text-white">
                  {recentActivity.filter(a => a.status === 'error').length}
                </div>
                <div className="text-xs text-white opacity-60">Failures</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Chart Placeholder */}
        <div className="p-6 border border-white" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-xl font-bold text-white mb-6">Usage Last 7 Days</h3>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              {loading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto mb-4"></div>
              ) : (
                <Activity className="w-12 h-12 text-white mx-auto mb-4 opacity-50" />
              )}
              <p className="text-white opacity-60">No usage data</p>
              <p className="text-white opacity-40 text-sm">Charts will appear after API usage</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border border-white" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => handleViewChange('apis')}
              className="w-full p-4 border border-white hover:border-white transition-all duration-200 group text-left" 
              style={{ backgroundColor: '#131313' }}
            >
              <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-white flex items-center justify-center">
                 <Code className="w-5 h-5" style={{ color: '#131313' }} />
                </div>
                <div>
                  <div className="font-medium text-white">Test API</div>
                  <div className="text-sm text-white opacity-60">Make a test call</div>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => setShowBuyCreditsModal(true)}
              className="w-full p-4 border border-white hover:border-white transition-all duration-200 group text-left" 
              style={{ backgroundColor: '#131313' }}
            >
              <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-white flex items-center justify-center">
                 <DollarSign className="w-5 h-5" style={{ color: '#131313' }} />
                </div>
                <div>
                  <div className="font-medium text-white">Buy Credits</div>
                  <div className="text-sm text-white opacity-60">Add more credits</div>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 border border-white hover:border-white transition-all duration-200 group text-left" style={{ backgroundColor: '#131313' }}>
              <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-white flex items-center justify-center">
                 <Activity className="w-5 h-5" style={{ color: '#131313' }} />
                </div>
                <div>
                  <div className="font-medium text-white">View Documentation</div>
                  <div className="text-sm text-white opacity-60">Guides and examples</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <BuyCreditsModal 
        isOpen={showBuyCreditsModal} 
        onClose={() => setShowBuyCreditsModal(false)} 
      />
    </div>
  );
}