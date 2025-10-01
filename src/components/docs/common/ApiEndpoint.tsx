import React from 'react';
import { Zap, Lock } from 'lucide-react';

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authenticated?: boolean;
  deprecated?: boolean;
}

export default function ApiEndpoint({
  method,
  path,
  description,
  authenticated = true,
  deprecated = false
}: ApiEndpointProps) {
  const methodColors = {
    GET: 'bg-blue-600',
    POST: 'bg-green-600',
    PUT: 'bg-yellow-600',
    DELETE: 'bg-red-600',
    PATCH: 'bg-purple-600',
  };

  return (
    <div className={`border border-white p-4 ${deprecated ? 'opacity-60' : ''}`} style={{ backgroundColor: '#212121' }}>
      <div className="flex items-center space-x-3 mb-2">
        <span className={`${methodColors[method]} text-white px-2 py-1 text-xs font-bold rounded`}>
          {method}
        </span>
        <code className="text-white font-mono text-sm flex-1">{path}</code>
        <div className="flex items-center space-x-2">
          {authenticated && (
            <div className="flex items-center space-x-1 text-white opacity-60" title="Requires authentication">
              <Lock className="w-3 h-3" />
              <span className="text-xs">Auth</span>
            </div>
          )}
          {deprecated && (
            <span className="text-red-400 text-xs font-medium">DEPRECATED</span>
          )}
        </div>
      </div>
      <p className="text-white opacity-80 text-sm">{description}</p>
    </div>
  );
}
