import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserHistory,
  getApiEndpoints,
  RequestHistory,
  ApiEndpoint
} from '../lib/supabase';
import { mockHistory, mockApiEndpoints } from '../data/mockData';

interface DataContextType {
  history: RequestHistory[];
  apiEndpoints: ApiEndpoint[];
  loading: boolean;
  refreshHistory: () => Promise<void>;
  refreshApiEndpoints: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30000;

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return supabaseUrl && supabaseUrl.includes('supabase.co');
  };

  const refreshHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const data = await getUserHistory();
        setHistory(data);
      } else {
        setHistory(mockHistory);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory(mockHistory);
    }
  }, [user]);

  const refreshApiEndpoints = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        const data = await getApiEndpoints();
        setApiEndpoints(data);
      } else {
        setApiEndpoints(mockApiEndpoints);
      }
    } catch (error) {
      console.error('Error fetching API endpoints:', error);
      setApiEndpoints(mockApiEndpoints);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    const now = Date.now();

    // Skip if cached data is still fresh
    if (now - lastFetch < CACHE_DURATION) {
      console.log('Using cached data (fresh)');
      return;
    }

    setLoading(true);
    console.log('Fetching fresh data...');

    try {
      await Promise.all([
        refreshHistory(),
        refreshApiEndpoints()
      ]);
      setLastFetch(now);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  }, [refreshHistory, refreshApiEndpoints, lastFetch]);

  // Initial load when user changes
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setHistory([]);
      setApiEndpoints([]);
      setLoading(false);
    }
  }, [user]);

  // Auto-refresh every 60 seconds if user is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing data (60s interval)');
      refreshAll();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [user, refreshAll]);

  const value = {
    history,
    apiEndpoints,
    loading,
    refreshHistory,
    refreshApiEndpoints,
    refreshAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
