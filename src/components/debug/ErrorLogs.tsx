import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Filter } from 'lucide-react';
import { getErrorLogs } from '../../lib/supabase';
import { ErrorLog } from '../../types';

interface ErrorLogsProps {
  userId?: string;
  limit?: number;
}

const ErrorLogs: React.FC<ErrorLogsProps> = ({ limit = 50 }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getErrorLogs(limit);
      setLogs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load error logs:', err);
      setError('Failed to load error logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'all' && log.error_type !== filterType) return false;
    if (showCriticalOnly && !log.is_critical) return false;
    return true;
  });

  const getErrorTypeColor = (type: string) => {
    const colors = {
      javascript: 'text-red-600 bg-red-50',
      network: 'text-orange-600 bg-orange-50',
      authentication: 'text-purple-600 bg-purple-50',
      payment: 'text-yellow-600 bg-yellow-50',
      api: 'text-blue-600 bg-blue-50',
      render: 'text-red-600 bg-red-50',
      unknown: 'text-gray-600 bg-gray-50',
    };
    return colors[type as keyof typeof colors] || colors.unknown;
  };

  const errorTypes = ['all', 'javascript', 'network', 'authentication', 'payment', 'api', 'render', 'unknown'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading error logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="ml-2 text-red-700">{error}</span>
          <button
            onClick={loadLogs}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Error Logs</h3>
        <button
          onClick={loadLogs}
          className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          {errorTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={showCriticalOnly}
            onChange={(e) => setShowCriticalOnly(e.target.checked)}
            className="mr-2"
          />
          Critical only
        </label>
        <span className="text-sm text-gray-500">
          {filteredLogs.length} of {logs.length} errors
        </span>
      </div>

      {/* Error List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            No errors found
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 border rounded-lg ${log.is_critical ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getErrorTypeColor(log.error_type)}`}>
                      {log.error_type}
                    </span>
                    {log.is_critical && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {log.component_name && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {log.component_name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{log.error_message}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()} • {log.url}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {log.resolved ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>

              {/* Error Stack (collapsible) */}
              {log.error_stack && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    View stack trace
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-100 text-xs overflow-auto rounded">
                    {log.error_stack}
                  </pre>
                </details>
              )}

              {/* Metadata */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    View metadata
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-100 text-xs overflow-auto rounded">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorLogs;