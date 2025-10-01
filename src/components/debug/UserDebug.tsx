import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Database, Clock, AlertCircle } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  credits: number;
  created_at: string;
}

interface HistoryCount {
  user_id: string;
  count: number;
}

export const UserDebug: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [targetUser, setTargetUser] = useState<UserData | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [allHistoryCounts, setAllHistoryCounts] = useState<HistoryCount[]>([]);

  const debugUser = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting user debug...');

      // 1. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      console.log('👤 Current auth user:', user);

      // 2. Check if target user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'felipealfah@gmail.com')
        .maybeSingle();

      console.log('👤 Target user data:', userData);
      console.log('❌ User query error:', userError);
      setTargetUser(userData);

      // 3. Get history count for target user (if exists)
      if (userData) {
        const { data: historyData, error: historyError } = await supabase
          .from('request_history')
          .select('*', { count: 'exact' })
          .eq('user_id', userData.id);

        console.log('📋 History data:', historyData);
        console.log('📊 History count:', historyData?.length || 0);
        console.log('❌ History error:', historyError);
        setHistoryCount(historyData?.length || 0);
      }

      // 4. Get all users for comparison
      const { data: allUsersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      setAllUsers(allUsersData || []);
      console.log('👥 All users:', allUsersData);

      // 5. Get history counts for all users
      const { data: allHistoryData } = await supabase
        .from('request_history')
        .select('user_id');

      if (allHistoryData) {
        const counts = allHistoryData.reduce((acc: Record<string, number>, item) => {
          acc[item.user_id] = (acc[item.user_id] || 0) + 1;
          return acc;
        }, {});

        const countsArray = Object.entries(counts).map(([user_id, count]) => ({
          user_id,
          count: count as number
        }));

        setAllHistoryCounts(countsArray);
        console.log('📊 All history counts:', countsArray);
      }

    } catch (error) {
      console.error('❌ Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">User Debug Panel</h3>
        </div>

        <button
          onClick={debugUser}
          disabled={loading}
          className="w-full mb-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Clock className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
          {loading ? 'Debugging...' : 'Debug felipealfah@gmail.com'}
        </button>

        {currentUser && (
          <div className="mb-3 p-2 bg-gray-800 rounded text-xs">
            <div className="text-green-400 mb-1">Current Auth User:</div>
            <div className="text-white">{currentUser.email}</div>
            <div className="text-gray-400">{currentUser.id}</div>
          </div>
        )}

        {targetUser ? (
          <div className="mb-3 p-2 bg-green-900 rounded text-xs">
            <div className="text-green-400 mb-1">Target User Found:</div>
            <div className="text-white">{targetUser.email}</div>
            <div className="text-gray-400">{targetUser.id}</div>
            <div className="text-yellow-400">Credits: {targetUser.credits}</div>
            <div className="text-purple-400">History: {historyCount} records</div>
          </div>
        ) : (
          <div className="mb-3 p-2 bg-red-900 rounded text-xs">
            <div className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Target User NOT FOUND
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400">
          <div>Total Users: {allUsers.length}</div>
          <div>Users with History: {allHistoryCounts.length}</div>
        </div>

        {allUsers.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-blue-400 cursor-pointer">Show All Users</summary>
            <div className="mt-2 max-h-32 overflow-y-auto text-xs">
              {allUsers.map(user => {
                const historyCount = allHistoryCounts.find(h => h.user_id === user.id)?.count || 0;
                return (
                  <div key={user.id} className="p-1 border-b border-gray-700">
                    <div className="text-white truncate">{user.email}</div>
                    <div className="text-gray-400 text-xs">
                      Credits: {user.credits} | History: {historyCount}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};