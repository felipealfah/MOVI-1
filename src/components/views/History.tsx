import React, { useState } from 'react';
import { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { RequestHistory, ApiEndpoint, checkVideoAvailability, getVideoWithStatus } from '../../lib/supabase';
import { History as HistoryIcon, Filter, ExternalLink, Eye, Download, X, Clock, AlertTriangle } from 'lucide-react';

export default function History() {
  const { history, apiEndpoints: apis, loading } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<RequestHistory | null>(null);

  const getApiName = (apiId: string) => {
    const api = apis.find(a => a.id === apiId);
    return api ? api.name : 'Unknown API';
  };

  const filteredHistory = history.filter(item => {
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    return statusMatch;
  });

  const openDetailsPopup = (request: RequestHistory) => {
    setSelectedRequest(request);
  };

  const handleVideoAccess = async (request: RequestHistory) => {
    if (!request.url_resultado) return;

    // Check if video is still available
    try {
      const videoData = await getVideoWithStatus(request.id);
      if (videoData && videoData.video_status === 'available') {
        window.open(request.url_resultado, '_blank');
      } else {
        alert('Este vídeo não está mais disponível. Os vídeos ficam disponíveis por apenas 48 horas após a criação.');
      }
    } catch (error) {
      console.error('Error checking video availability:', error);
      // Fallback to direct access
      window.open(request.url_resultado, '_blank');
    }
  };

  const closeDetailsPopup = () => {
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'done':
        return 'bg-transparent border-green-700 text-green-700';
      case 'error':
        return 'bg-gray-700 text-white';
      case 'pending':
        return 'bg-gray-800 text-gray-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getVideoStatusColor = (videoStatus: string) => {
    switch (videoStatus) {
      case 'available':
        return 'text-green-500';
      case 'unavailable':
        return 'text-red-500';
      case 'processing':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getVideoStatusIcon = (videoStatus: string) => {
    switch (videoStatus) {
      case 'available':
        return <Eye className="w-4 h-4" />;
      case 'unavailable':
        return <AlertTriangle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'done':
        return 'Done';
      case 'error':
        return 'Error';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 border border-white" style={{ backgroundColor: '#212121' }}>
          <div className="w-12 h-12 bg-white mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
          </div>
          <div className="text-white text-xl mb-2">Loading history...</div>
          <div className="text-white opacity-60">Fetching your request history</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Request History</h1>
          <p className="text-gray-500">Track all your API calls</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="border border-white p-6 mb-6" style={{ backgroundColor: '#212121' }}>
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-white px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
              style={{ backgroundColor: '#131313' }}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="border border-white overflow-hidden" style={{ backgroundColor: '#212121' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">API</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Dimensions</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Video Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Credits</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white">
              {filteredHistory.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-black transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{getApiName(item.api_id)}</div>
                        <div className="text-gray-500 text-sm">{apis.find(a => a.id === item.api_id)?.category || 'General'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-mono text-sm">{item.tempo}</td>
                    <td className="px-6 py-4 text-white">
                      {item.width && item.height 
                        ? `${item.width} × ${item.height}` 
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      {item.url_resultado ? (
                        <div className={`flex items-center space-x-2 ${getVideoStatusColor(item.video_status)}`}>
                          {getVideoStatusIcon(item.video_status)}
                          <span className="text-sm font-medium capitalize">
                            {item.video_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{(item.credits_cost ?? 0).toFixed(3)}</span>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-white hover:text-white transition-colors"
                          onClick={() => openDetailsPopup(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.url_resultado && (
                          <button 
                            onClick={() => handleVideoAccess(item)}
                            className="p-1 text-white hover:text-white transition-colors"
                            disabled={item.video_status === 'unavailable'}
                          >
                            <ExternalLink className={`w-4 h-4 ${item.video_status === 'unavailable' ? 'opacity-50' : ''}`} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <HistoryIcon className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
            <p className="text-white">Try adjusting the filters or make some API calls</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredHistory.length > 0 && (
        <div className="mt-6 border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Results Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">{filteredHistory.length}</div>
              <div className="text-sm text-white">Total Requests</div>
            </div>
            <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">
                {filteredHistory.filter(h => h.status === 'success').length}
              </div>
              <div className="text-sm text-white">Success</div>
            </div>
            <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">
                {filteredHistory.filter(h => h.status === 'error').length}
              </div>
              <div className="text-sm text-white">Errors</div>
            </div>
            <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
              <div className="text-2xl font-bold text-white">
                {filteredHistory.reduce((sum, h) => sum + (h.credits_cost ?? 0), 0).toFixed(3)}
              </div>
              <div className="text-sm text-white">Credits Spent</div>
            </div>
          </div>
        </div>
      )}

      {/* Details Popup */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="border border-white max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#212121' }}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Request Details</h2>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                    <span className="text-white text-sm">
                      {new Date(selectedRequest.created_at).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDetailsPopup}
                  className="p-2 text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* API Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h3 className="text-lg font-semibold text-white mb-3">API Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">API:</span>
                      <span className="text-white font-medium">{getApiName(selectedRequest.api_id)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Category:</span>
                      <span className="text-white">{apis.find(a => a.id === selectedRequest.api_id)?.category || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Processing Time:</span>
                      <span className="text-white font-mono">{selectedRequest.tempo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Credits Cost:</span>
                      <span className="text-white font-medium">{(selectedRequest.credits_cost ?? 0).toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h3 className="text-lg font-semibold text-white mb-3">Output Details</h3>
                  <div className="space-y-2">
                    {selectedRequest.width && selectedRequest.height && (
                      <div className="flex justify-between">
                        <span className="text-white opacity-60">Dimensions:</span>
                        <span className="text-white">{selectedRequest.width} × {selectedRequest.height}</span>
                      </div>
                    )}
                    {selectedRequest.url_resultado && (
                      <div className="flex justify-between">
                        <span className="text-white opacity-60">Result URL:</span>
                        <button
                          onClick={() => window.open(selectedRequest.url_resultado, '_blank')}
                          className="text-white hover:text-gray-300 underline text-sm truncate max-w-48"
                        >
                          View Result
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Request ID:</span>
                      <span className="text-white font-mono text-sm">{selectedRequest.id}</span>
                    </div>
                  </div>
              {/* Request Body */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Request Body</h3>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <pre className="text-white text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedRequest.body, null, 2)}
                  </pre>
                </div>
              </div>
                </div>
              {/* Response */}
              {selectedRequest.response && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Response</h3>
                  <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                    <pre className="text-white text-sm overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedRequest.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              </div>
              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {selectedRequest.url_resultado && (
                  <button
                    onClick={() => window.open(selectedRequest.url_resultado, '_blank')}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Result</span>
                  </button>
                )}
                <button
                  onClick={closeDetailsPopup}
                  className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}