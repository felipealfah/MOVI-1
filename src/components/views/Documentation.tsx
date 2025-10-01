import React, { useState } from 'react';
import { BookOpen, Play, Code2, Sparkles, Video } from 'lucide-react';
import GettingStarted from '../docs/video-api/GettingStarted';
import ApiReference from '../docs/video-api/ApiReference';
import Examples from '../docs/video-api/Examples';

interface DocumentationProps {
  onViewChange?: (view: 'dashboard' | 'apis' | 'tokens' | 'history' | 'profile') => void;
  onBuyCredits?: () => void;
}

export default function Documentation({ onViewChange, onBuyCredits }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [activeApi, setActiveApi] = useState<'video' | 'text' | 'qr' | 'speech' | 'parser'>('video');

  const apiSections = [
    {
      id: 'video',
      name: 'Video API',
      icon: Video,
      available: true,
      sections: [
        { id: 'getting-started', title: 'Getting Started', icon: Play },
        { id: 'api-reference', title: 'API Reference', icon: Code2 },
        { id: 'examples', title: 'Practical Examples', icon: Sparkles },
      ]
    },
    {
      id: 'text',
      name: 'Text Analysis API',
      icon: BookOpen,
      available: false,
      sections: []
    },
    {
      id: 'qr',
      name: 'QR Code API',
      icon: BookOpen,
      available: false,
      sections: []
    },
    {
      id: 'speech',
      name: 'Speech API',
      icon: BookOpen,
      available: false,
      sections: []
    },
    {
      id: 'parser',
      name: 'Document Parser API',
      icon: BookOpen,
      available: false,
      sections: []
    }
  ];

  const currentApi = apiSections.find(api => api.id === activeApi);
  const sections = currentApi?.sections || [];

  const renderSection = () => {
    if (activeApi !== 'video') {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-white opacity-40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-white opacity-60">
              Documentation for {currentApi?.name} is under development
            </p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'getting-started':
        return <GettingStarted />;
      case 'api-reference':
        return <ApiReference />;
      case 'examples':
        return <Examples />;
      default:
        return <GettingStarted />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
        <p className="text-gray-500">Complete guides and references for all MoviAPI services</p>
      </div>

      {/* API Selector */}
      <div className="mb-6">
        <div className="border border-white p-4" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-white font-medium mb-3">Select API</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {apiSections.map((api) => {
              const Icon = api.icon;
              const isActive = activeApi === api.id;
              const isAvailable = api.available;

              return (
                <button
                  key={api.id}
                  onClick={() => {
                    if (isAvailable) {
                      setActiveApi(api.id as typeof activeApi);
                      setActiveSection(api.sections[0]?.id || 'getting-started');
                    }
                  }}
                  disabled={!isAvailable}
                  className={`p-3 text-left transition-all duration-200 relative ${
                    isActive
                      ? 'bg-white text-black'
                      : isAvailable
                      ? 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
                      : 'bg-transparent border border-white opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{api.name}</span>
                  </div>
                  {!isAvailable && (
                    <span className="text-xs opacity-60">Coming Soon</span>
                  )}
                  {isAvailable && (
                    <div className="absolute top-1 right-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full block"></span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="border border-white p-4 sticky top-6" style={{ backgroundColor: '#212121' }}>
            <div className="flex items-center space-x-2 mb-4">
              {currentApi && (
                <>
                  {React.createElement(currentApi.icon, { className: 'w-5 h-5 text-white' })}
                  <h3 className="text-lg font-bold text-white">{currentApi.name}</h3>
                </>
              )}
            </div>

            {sections.length > 0 ? (
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-white text-black'
                          : 'text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <p className="text-white opacity-60 text-sm">
                No sections available
              </p>
            )}

            {/* Quick Links */}
            {activeApi === 'video' && (
              <div className="mt-6 pt-6 border-t border-white">
                <h4 className="text-white text-sm font-medium mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => onViewChange?.('tokens')}
                    className="block w-full text-left text-white opacity-70 hover:opacity-100 text-xs transition-opacity"
                  >
                    → API Tokens
                  </button>
                  <button
                    onClick={() => onBuyCredits?.()}
                    className="block w-full text-left text-white opacity-70 hover:opacity-100 text-xs transition-opacity"
                  >
                    → Buy Credits
                  </button>
                  <button
                    onClick={() => onViewChange?.('history')}
                    className="block w-full text-left text-white opacity-70 hover:opacity-100 text-xs transition-opacity"
                  >
                    → Request History
                  </button>
                </div>
              </div>
            )}

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-white">
              <h4 className="text-white text-sm font-medium mb-3">Need Help?</h4>
              <div className="space-y-2">
                <a
                  href="mailto:support@moviapi.com"
                  className="block text-white opacity-70 hover:opacity-100 text-xs transition-opacity"
                >
                  → Email Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="border border-white p-8" style={{ backgroundColor: '#212121' }}>
            {renderSection()}
          </div>

          {/* Footer */}
          {activeApi === 'video' && (
            <div className="mt-6 p-4 border border-white text-center" style={{ backgroundColor: '#212121' }}>
              <p className="text-white opacity-60 text-sm">
                Last updated: September 30, 2025 • MoviAPI Video API v1.0
              </p>
              <div className="mt-2 flex items-center justify-center space-x-4 text-xs">
                <a href="#" className="text-white opacity-60 hover:opacity-100 transition-opacity">
                  Changelog
                </a>
                <span className="text-white opacity-40">•</span>
                <a href="#" className="text-white opacity-60 hover:opacity-100 transition-opacity">
                  Terms of Service
                </a>
                <span className="text-white opacity-40">•</span>
                <a href="#" className="text-white opacity-60 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
