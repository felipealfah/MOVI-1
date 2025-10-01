import React, { useState } from 'react';
import { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ApiEndpoint } from '../../lib/supabase';
import { Code, Book, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { TokenEstimator } from '../common/TokenEstimator';
import { useTokenValidation } from '../../hooks/useTokenValidation';

// Mock APIs for fallback (updated structure)
const mockApis: ApiEndpoint[] = [
  {
    id: '1',
    name: 'Video Generator',
    description: 'Generate high-quality videos with text, audio and visual effects',
    category: 'Video',
    endpoint: '/api/v1/generate-video',
    method: 'POST',
    price_per_second: 0.0050,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    documentation: {
      parameters: [
        { name: 'timeline', type: 'object', required: true, description: 'Video timeline with tracks, clips and assets' },
        { name: 'output', type: 'object', required: true, description: 'Output format and dimensions' },
        { name: 'format', type: 'string', required: false, description: 'Video format (mp4, mov, webm)' },
        { name: 'quality', type: 'string', required: false, description: 'Video quality (low, medium, high)' }
      ],
      example: {
        request: `{
  "timeline": {
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Welcome to MoviAPI",
              "font": {
                "family": "Clear Sans",
                "color": "#ffffff",
                "size": 46
              }
            },
            "start": 0,
            "length": 3
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1280,
      "height": 720
    }
  }
}`,
        response: `{
  "success": true,
  "video_url": "https://api.example.com/videos/abc123.mp4",
  "duration": 3.0,
  "format": "mp4",
  "size": {
    "width": 1280,
    "height": 720
  },
  "processing_time": 8.5
}`
      }
    }
  },
  {
    id: '2',
    name: 'Text Analyzer',
    description: 'Advanced sentiment analysis and text classification',
    category: 'Text',
    endpoint: '/api/v1/analyze-text',
    method: 'POST',
    price_per_second: 0.0020,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    documentation: {
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to be analyzed' },
        { name: 'language', type: 'string', required: false, description: 'Text language (pt, en, es)' },
        { name: 'analysis_type', type: 'string', required: false, description: 'Analysis type (sentiment, classification, both)' }
      ],
      example: {
        request: `{
  "text": "This product is amazing! Highly recommend.",
  "language": "en",
  "analysis_type": "sentiment"
}`,
        response: `{
  "success": true,
  "sentiment": "positive",
  "confidence": 0.95,
  "classification": "review",
  "processing_time": 0.8
}`
      }
    }
  }
];

export default function Apis() {
  const { apiEndpoints: apis, loading } = useData();
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [testInputData, setTestInputData] = useState<any>({});
  const { validateAndProceed } = useTokenValidation();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApiClick = (apiId: string) => {
    const api = apis.find(api => api.id === apiId);
    if (api) {
      setSelectedApi(api);
    }
  };

  const handleBackToList = () => {
    setSelectedApi(null);
  };

  const getStatusColor = (status: string) => {
    if (status) {
        return 'bg-white text-black';
    } else {
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12 border border-white" style={{ backgroundColor: '#212121' }}>
          <div className="w-12 h-12 bg-white mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
          </div>
          <div className="text-white text-xl mb-2">Loading APIs...</div>
          <div className="text-white opacity-60">Fetching available APIs</div>
        </div>
      </div>
    );
  }

  // Show API details view
  if (selectedApi) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <button
            onClick={handleBackToList}
            className="mb-4 bg-white text-black px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            ← Back to APIs
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">{selectedApi.name}</h1>
          <p className="text-gray-500">{selectedApi.description}</p>
        </div>

        <div className="space-y-6">
          {/* API Info */}
          <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-4">API Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                <span className="text-white opacity-60 text-sm">Method</span>
                <p className="text-white font-medium">{selectedApi.method}</p>
              </div>
              <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                <span className="text-white opacity-60 text-sm">Category</span>
                <p className="text-white font-medium">{selectedApi.category}</p>
              </div>
              <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                <span className="text-white opacity-60 text-sm">Cost per request</span>
                <p className="text-white font-medium">${selectedApi.cost_per_request}/s</p>
              </div>
              <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                <span className="text-white opacity-60 text-sm">Status</span>
                <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(selectedApi.is_active)}`}>
                  {getStatusLabel(selectedApi.is_active)}
                </span>
              </div>
            </div>
          </div>

          {/* Endpoint */}
          <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-4">Endpoint</h2>
            <div className="border border-white p-4 flex items-center justify-between" style={{ backgroundColor: '#131313' }}>
              <code className="text-white font-mono">https://api.hub.com{selectedApi.endpoint}</code>
              <button
                onClick={() => copyToClipboard(`https://api.hub.com${selectedApi.endpoint}`, 'endpoint')}
                className="p-2 text-white hover:text-gray-300 transition-colors"
              >
                {copiedCode === 'endpoint' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Parameters */}
          <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-4">Parameters</h2>
            <div className="border border-white overflow-hidden" style={{ backgroundColor: '#131313' }}>
              <table className="w-full">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-black">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-black">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-black">Required</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-black">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white">
                  {selectedApi.documentation.parameters.map((param, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-white font-mono">{param.name}</td>
                      <td className="px-4 py-3 text-sm text-white font-mono">{param.type}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs font-medium ${param.required ? 'bg-white text-black' : 'bg-black border border-white text-white'}`}>
                          {param.required ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Token Estimator */}
          <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-4">Token Estimation</h2>
            <p className="text-gray-400 mb-4">
              Test your request and see estimated token usage before making the actual API call
            </p>

            <div className="space-y-4">
              {/* Test Input */}
              <div>
                <label className="block text-white mb-2">Test Input (JSON):</label>
                <textarea
                  value={JSON.stringify(testInputData, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setTestInputData(parsed);
                    } catch {
                      // Keep the current value if JSON is invalid
                    }
                  }}
                  placeholder={selectedApi.documentation.example.request}
                  className="w-full h-32 p-3 bg-gray-800 border border-gray-600 text-white font-mono text-sm rounded"
                />
              </div>

              {/* Token Estimator Component */}
              <TokenEstimator
                apiEndpoint={selectedApi.name.toLowerCase().replace(/\s+/g, '-')}
                inputData={testInputData}
                showDetails={true}
                className="mt-4"
              />

              {/* Quick Test Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    try {
                      const exampleData = JSON.parse(selectedApi.documentation.example.request);
                      setTestInputData(exampleData);
                    } catch (error) {
                      console.error('Error parsing example:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Use Example
                </button>
                <button
                  onClick={() => setTestInputData({})}
                  className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
            <h2 className="text-xl font-bold text-white mb-4">Examples</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-white">Request</h3>
                  <button
                    onClick={() => copyToClipboard(selectedApi.documentation.example.request, 'request')}
                    className="p-2 text-white hover:text-gray-300 transition-colors"
                  >
                    {copiedCode === 'request' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <pre className="text-sm text-white overflow-x-auto"><code>{selectedApi.documentation.example.request}</code></pre>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-white">Response</h3>
                  <button
                    onClick={() => copyToClipboard(selectedApi.documentation.example.response, 'response')}
                    className="p-2 text-white hover:text-gray-300 transition-colors"
                  >
                    {copiedCode === 'response' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <pre className="text-sm text-white overflow-x-auto"><code>{selectedApi.documentation.example.response}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show APIs list view
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Available APIs</h1>
        <p className="text-gray-500">Explore and integrate our APIs into your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map((api) => (
          <button
            key={api.id}
            onClick={() => handleApiClick(api.id)}
            className="text-left p-6 border border-gray-600 text-white hover:border-white transition-all duration-200"
            style={{ backgroundColor: '#212121' }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">{api.name}</h3>
              <span className={`text-xs px-2 py-1 ${getStatusColor(api.is_active)}`}>
                {getStatusLabel(api.is_active)}
              </span>
            </div>
            <p className="text-sm text-white mb-4 line-clamp-3">{api.description}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-white text-black px-2 py-1">{api.method}</span>
              <span className="text-sm font-medium text-white">${api.cost_per_request}/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white">{api.category}</span>
              <ExternalLink className="w-4 h-4 text-white opacity-60" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}