import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TableInfo {
  name: string;
  exists: boolean;
  count: number;
  data: any[];
  error?: string;
}

export default function DatabaseDebug() {
  const { user } = useAuth();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAllTables = async () => {
      setLoading(true);
      
      const tablesToCheck = [
        'users',
        'api_endpoints', 
        'api_keys',
        'request_history',
        'stripe_customers',
        'stripe_orders',
        'stripe_subscriptions'
      ];

      const results: TableInfo[] = [];

      for (const tableName of tablesToCheck) {
        try {
          console.log(`Checking table: ${tableName}`);
          
          // Try to query the table
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(5);

          if (error) {
            console.error(`Error querying ${tableName}:`, error);
            results.push({
              name: tableName,
              exists: false,
              count: 0,
              data: [],
              error: error.message
            });
          } else {
            console.log(`Table ${tableName} data:`, data);
            results.push({
              name: tableName,
              exists: true,
              count: count || 0,
              data: data || [],
              error: undefined
            });
          }
        } catch (err: any) {
          console.error(`Exception checking ${tableName}:`, err);
          results.push({
            name: tableName,
            exists: false,
            count: 0,
            data: [],
            error: err.message
          });
        }
      }

      setTables(results);
      setLoading(false);
    };

    checkAllTables();
  }, []);

  const checkUserCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        console.log('Current user data:', data);
        alert(`Current credits: ${data.credits}`);
      }
    } catch (err) {
      console.error('Exception fetching user:', err);
    }
  };

  const testWebhookFunction = async () => {
    try {
      const response = await fetch('https://wrplwpcfwiiwfelwwzea.supabase.co/functions/v1/stripe-webhook-cli', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.text();
      console.log('Webhook test response:', result);
      alert(`Webhook response: ${result}`);
    } catch (err: any) {
      console.error('Webhook test error:', err);
      alert(`Webhook error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border border-white" style={{ backgroundColor: '#212121' }}>
        <h2 className="text-xl font-bold text-white mb-4">🔍 Database Debug - Loading...</h2>
        <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-white" style={{ backgroundColor: '#212121' }}>
      <h2 className="text-xl font-bold text-white mb-4">🔍 Database Debug</h2>
      
      {/* User Info */}
      <div className="mb-6 p-4 border border-blue-500" style={{ backgroundColor: '#131313' }}>
        <h3 className="text-lg font-bold text-blue-400 mb-2">Current User</h3>
        <pre className="text-white text-sm">
          {JSON.stringify({
            id: user?.id,
            email: user?.email,
            name: user?.name,
            credits: user?.credits
          }, null, 2)}
        </pre>
        <button 
          onClick={checkUserCredits}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh User Credits
        </button>
      </div>

      {/* Tables Status */}
      <div className="space-y-4 mb-6">
        {tables.map((table) => (
          <div 
            key={table.name}
            className={`p-4 border ${table.exists ? 'border-green-500' : 'border-red-500'}`}
            style={{ backgroundColor: '#131313' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-bold ${table.exists ? 'text-green-400' : 'text-red-400'}`}>
                {table.exists ? '✅' : '❌'} {table.name}
              </h3>
              <span className="text-white text-sm">
                {table.exists ? `${table.count} records` : 'Not found'}
              </span>
            </div>
            
            {table.error && (
              <div className="text-red-400 text-sm mb-2">
                Error: {table.error}
              </div>
            )}
            
            {table.exists && table.data.length > 0 && (
              <details className="mt-2">
                <summary className="text-white cursor-pointer">View Data</summary>
                <pre className="text-white text-xs mt-2 overflow-auto max-h-40">
                  {JSON.stringify(table.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* Test Actions */}
      <div className="space-y-2">
        <button 
          onClick={testWebhookFunction}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test Webhook Function
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reload Page
        </button>
      </div>

      {/* Environment Info */}
      <div className="mt-6 p-4 border border-yellow-500" style={{ backgroundColor: '#131313' }}>
        <h3 className="text-lg font-bold text-yellow-400 mb-2">Environment</h3>
        <div className="text-white text-sm space-y-1">
          <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
          <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
          <div>URL: {import.meta.env.VITE_SUPABASE_URL}</div>
        </div>
      </div>
    </div>
  );
}