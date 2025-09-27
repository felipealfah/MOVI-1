import React, { useState } from 'react';
import { BookOpen, Copy, CheckCircle, ExternalLink, Zap, Settings, Play, Code2 } from 'lucide-react';

export default function Documentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('getting-started');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Play },
    { id: 'authentication', title: 'Authentication', icon: Settings },
    { id: 'apis', title: 'Available APIs', icon: Zap },
    { id: 'n8n-integration', title: 'n8n Integration', icon: Code2 },
    { id: 'examples', title: 'Practical Examples', icon: BookOpen },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Getting Started with MoviAPI</h2>
              <p className="text-white opacity-80 text-lg mb-6">
                Welcome to MoviAPI! This guide will help you start using our APIs quickly and easily, 
                even if you're not a programmer.
              </p>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">📋 What You Need</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-black text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Your API Token</p>
                    <p className="text-white opacity-60 text-sm">Found in the "API Tokens" section of your dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-black text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Credits in Your Account</p>
                    <p className="text-white opacity-60 text-sm">Purchase credits to make API calls</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-black text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">A Tool to Make Requests</p>
                    <p className="text-white opacity-60 text-sm">Like n8n, Postman, or any HTTP client</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Start Steps</h3>
              <div className="space-y-4">
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-2">Step 1: Get Your API Token</h4>
                  <p className="text-white opacity-80 text-sm">
                    Go to "API Tokens" in the sidebar and copy your token. It looks like: 
                    <code className="bg-black px-2 py-1 rounded ml-1">sk-abc123...</code>
                  </p>
                </div>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-2">Step 2: Choose an API</h4>
                  <p className="text-white opacity-80 text-sm">
                    Browse the "APIs" section to see what's available. Each API has different costs and capabilities.
                  </p>
                </div>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-2">Step 3: Make Your First Request</h4>
                  <p className="text-white opacity-80 text-sm">
                    Use the examples in this documentation to make your first API call!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Authentication</h2>
              <p className="text-white opacity-80 text-lg mb-6">
                All API requests require authentication using your API token.
              </p>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🔑 How to Authenticate</h3>
              <p className="text-white opacity-80 mb-4">
                Include your API token in the <code className="bg-black px-2 py-1 rounded">Authorization</code> header:
              </p>
              
              <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Header Format</span>
                  <button
                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_TOKEN', 'auth-header')}
                    className="p-1 text-white hover:text-gray-300"
                  >
                    {copiedCode === 'auth-header' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <code className="text-white text-sm">Authorization: Bearer YOUR_API_TOKEN</code>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">⚠️ Important Security Notes</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Never share your API token publicly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Store your token securely in environment variables</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Your token is unique and tied to your account</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'apis':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Available APIs</h2>
              <p className="text-white opacity-80 text-lg mb-6">
                Explore our powerful APIs and their capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
                <h3 className="text-xl font-bold text-white mb-3">🎬 Video Generator</h3>
                <p className="text-white opacity-80 mb-4">Generate high-quality videos with text, audio and visual effects</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Cost:</span>
                    <span className="text-white">$0.15-0.20 per minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Method:</span>
                    <span className="text-white">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Endpoint:</span>
                    <span className="text-white font-mono text-xs">/api/v1/generate-video</span>
                  </div>
                </div>
              </div>

              <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
                <h3 className="text-xl font-bold text-white mb-3">📝 Text Analyzer</h3>
                <p className="text-white opacity-80 mb-4">Advanced sentiment analysis and text classification</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Cost:</span>
                    <span className="text-white">$0.15-0.20 per minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Method:</span>
                    <span className="text-white">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Endpoint:</span>
                    <span className="text-white font-mono text-xs">/api/v1/analyze-text</span>
                  </div>
                </div>
              </div>

              <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
                <h3 className="text-xl font-bold text-white mb-3">🔗 QR Code Generator</h3>
                <p className="text-white opacity-80 mb-4">Create custom QR codes with styling options</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Cost:</span>
                    <span className="text-white">$0.15-0.20 per minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Method:</span>
                    <span className="text-white">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Endpoint:</span>
                    <span className="text-white font-mono text-xs">/api/v1/generate-qr</span>
                  </div>
                </div>
              </div>

              <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
                <h3 className="text-xl font-bold text-white mb-3">🎵 Voice Synthesis</h3>
                <p className="text-white opacity-80 mb-4">Convert text to natural-sounding speech</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Cost:</span>
                    <span className="text-white">$0.15-0.20 per minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Method:</span>
                    <span className="text-white">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white opacity-60">Endpoint:</span>
                    <span className="text-white font-mono text-xs">/api/v1/text-to-speech</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">💰 Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-2">Basic Plan (100 credits)</h4>
                  <p className="text-white opacity-80 text-sm">$0.20 per minute of processing</p>
                </div>
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-2">Premium/Business (500+ credits)</h4>
                  <p className="text-white opacity-80 text-sm">$0.15 per minute of processing</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'n8n-integration':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">n8n Integration Guide</h2>
              <p className="text-white opacity-80 text-lg mb-6">
                Learn how to integrate MoviAPI with n8n for powerful automation workflows.
              </p>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🔧 Setting Up HTTP Request Node</h3>
              <div className="space-y-4">
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-3">1. Add HTTP Request Node</h4>
                  <p className="text-white opacity-80 text-sm mb-3">
                    In your n8n workflow, add an "HTTP Request" node and configure it as follows:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Method:</span>
                      <span className="text-white">POST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">URL:</span>
                      <span className="text-white font-mono text-xs">https://api.moviapi.com/api/v1/[endpoint]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white opacity-60">Authentication:</span>
                      <span className="text-white">Header Auth</span>
                    </div>
                  </div>
                </div>

                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-3">2. Configure Headers</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white opacity-80 text-sm mb-2">Add these headers:</p>
                      <div className="bg-black p-3 rounded border border-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">Headers Configuration</span>
                          <button
                            onClick={() => copyToClipboard(`Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json`, 'n8n-headers')}
                            className="p-1 text-white hover:text-gray-300"
                          >
                            {copiedCode === 'n8n-headers' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <pre className="text-white text-xs">
{`Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🎬 Example: Video Generation in n8n</h3>
              <div className="space-y-4">
                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-3">Request Body Configuration</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">JSON Body</span>
                      <button
                        onClick={() => copyToClipboard(`{
  "timeline": {
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Welcome to AionAPI",
              "font": {
                "family": "Clear Sans",
                "color": "#ffffff",
                "size": 46
              },
              "alignment": {
                "horizontal": "left"
              },
              "width": 566,
              "height": 70
            },
            "start": 4,
            "length": "3",
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "offset": {
              "x": -0.15,
              "y": 0
            },
            "effect": "zoomIn"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4",
              "trim": 5,
              "volume": 1
            },
            "start": 0,
            "length": "2",
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "audio",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/motions.mp3",
              "effect": "fadeOut",
              "volume": 1
            },
            "start": 0,
            "length": "3"
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
}`, 'n8n-body')}
                        className="p-1 text-white hover:text-gray-300"
                      >
                        {copiedCode === 'n8n-body' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "timeline": {
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Welcome to AionAPI",
              "font": {
                "family": "Clear Sans",
                "color": "#ffffff",
                "size": 46
              },
              "alignment": {
                "horizontal": "left"
              },
              "width": 566,
              "height": 70
            },
            "start": 4,
            "length": "3",
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "offset": {
              "x": -0.15,
              "y": 0
            },
            "effect": "zoomIn"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4",
              "trim": 5,
              "volume": 1
            },
            "start": 0,
            "length": "2",
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "audio",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/motions.mp3",
              "effect": "fadeOut",
              "volume": 1
            },
            "start": 0,
            "length": "3"
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
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
                  <h4 className="text-white font-medium mb-3">Expected Response</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <pre className="text-white text-xs">
{`{
  "success": true,
  "video_url": "https://api.moviapi.com/videos/aion_welcome_abc123.mp4",
  "duration": 7.0,
  "format": "mp4",
  "size": {
    "width": 1280,
    "height": 720
  },
  "processing_time": 12.3,
  "credits_used": 35
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🔄 Complete n8n Workflow Example</h3>
              <div className="space-y-4">
                <p className="text-white opacity-80">
                  Here's a complete workflow that generates a video and saves it to Google Drive:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-white p-4 text-center" style={{ backgroundColor: '#131313' }}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-black font-bold">1</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Trigger</h4>
                    <p className="text-white opacity-60 text-sm">Webhook or Schedule</p>
                  </div>
                  <div className="border border-white p-4 text-center" style={{ backgroundColor: '#131313' }}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-black font-bold">2</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">HTTP Request</h4>
                    <p className="text-white opacity-60 text-sm">Call MoviAPI</p>
                  </div>
                  <div className="border border-white p-4 text-center" style={{ backgroundColor: '#131313' }}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-black font-bold">3</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">Google Drive</h4>
                    <p className="text-white opacity-60 text-sm">Save Video</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">💡 Pro Tips for n8n</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Use environment variables to store your API token securely</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Add error handling nodes to manage failed requests</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Monitor your credit usage in the MoviAPI dashboard</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Use the "Wait" node if you need to handle processing delays</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Practical Examples</h2>
              <p className="text-white opacity-80 text-lg mb-6">
                Real-world examples to help you get started quickly.
              </p>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🎬 Example 1: Generate Product Videos</h3>
              <p className="text-white opacity-80 mb-4">
                Perfect for e-commerce: Generate product videos with text overlays and effects.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Request</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">POST /api/v1/generate-video</span>
                      <button
                        onClick={() => copyToClipboard(`curl -X POST https://api.moviapi.com/api/v1/generate-video \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "timeline": {
      "tracks": [
        {
          "clips": [
            {
              "asset": {
                "type": "text",
                "text": "Premium Wireless Headphones",
                "font": {
                  "family": "Arial",
                  "color": "#ffffff",
                  "size": 48
                }
              },
              "start": 0,
              "length": 5
            }
          ]
        }
      ]
    },
    "output": {
      "format": "mp4",
      "size": {
        "width": 1920,
        "height": 1080
      }
    }
  }'`, 'example1-request')}
                        className="p-1 text-white hover:text-gray-300"
                      >
                        {copiedCode === 'example1-request' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "timeline": {
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Premium Wireless Headphones",
              "font": {
                "family": "Arial",
                "color": "#ffffff",
                "size": 48
              }
            },
            "start": 0,
            "length": 5
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1920,
      "height": 1080
    }
  }
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Response</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "success": true,
  "video_url": "https://api.moviapi.com/videos/product_headphones_abc123.mp4",
  "duration": 5.0,
  "format": "mp4",
  "size": {
    "width": 1920,
    "height": 1080
  },
  "processing_time": 8.5,
  "credits_used": 25
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">📝 Example 2: Analyze Customer Reviews</h3>
              <p className="text-white opacity-80 mb-4">
                Automatically analyze customer feedback to understand sentiment and categorize reviews.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Request</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">POST /api/v1/analyze-text</span>
                      <button
                        onClick={() => copyToClipboard(`curl -X POST https://api.moviapi.com/api/v1/analyze-text \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "This product exceeded my expectations! Great quality and fast shipping.",
    "language": "en",
    "analysis_type": "sentiment"
  }'`, 'example2-request')}
                        className="p-1 text-white hover:text-gray-300"
                      >
                        {copiedCode === 'example2-request' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "text": "This product exceeded my expectations! Great quality and fast shipping.",
  "language": "en",
  "analysis_type": "sentiment"
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Response</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "success": true,
  "sentiment": "positive",
  "confidence": 0.95,
  "classification": "product_review",
  "processing_time": 0.8,
  "credits_used": 5
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🔗 Example 3: Create QR Codes for Events</h3>
              <p className="text-white opacity-80 mb-4">
                Generate branded QR codes for event tickets or marketing campaigns.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Request</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">POST /api/v1/generate-qr</span>
                      <button
                        onClick={() => copyToClipboard(`curl -X POST https://api.moviapi.com/api/v1/generate-qr \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "https://myevent.com/ticket/12345",
    "size": 512,
    "color": "#000000",
    "background": "#FFFFFF"
  }'`, 'example3-request')}
                        className="p-1 text-white hover:text-gray-300"
                      >
                        {copiedCode === 'example3-request' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "data": "https://myevent.com/ticket/12345",
  "size": 512,
  "color": "#000000",
  "background": "#FFFFFF"
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Response</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "success": true,
  "qr_url": "https://api.moviapi.com/qr/event_qr_def456.png",
  "size": 512,
  "processing_time": 0.3,
  "credits_used": 2
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🎵 Example 4: Text-to-Speech for Podcasts</h3>
              <p className="text-white opacity-80 mb-4">
                Convert written content into natural-sounding audio for podcasts or accessibility.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Request</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">POST /api/v1/text-to-speech</span>
                      <button
                        onClick={() => copyToClipboard(`curl -X POST https://api.moviapi.com/api/v1/text-to-speech \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Welcome to our podcast! Today we will discuss the latest trends in AI technology.",
    "voice": "female",
    "language": "en-US",
    "speed": 1.0
  }'`, 'example4-request')}
                        className="p-1 text-white hover:text-gray-300"
                      >
                        {copiedCode === 'example4-request' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "text": "Welcome to our podcast! Today we will discuss the latest trends in AI technology.",
  "voice": "female",
  "language": "en-US",
  "speed": 1.0
}`}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Response</h4>
                  <div className="bg-black p-3 rounded border border-white">
                    <pre className="text-white text-xs overflow-x-auto">
{`{
  "success": true,
  "audio_url": "https://api.moviapi.com/audio/podcast_intro_xyz789.mp3",
  "duration": 8.5,
  "processing_time": 2.1,
  "credits_used": 12
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
              <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Testing Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Start with small, simple requests to test your setup</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Monitor your credit usage in the dashboard after each test</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Check the "History" section to see detailed request logs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <p className="text-white opacity-80">Use tools like Postman or Insomnia for easy API testing</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
        <p className="text-gray-500">Complete guide to using MoviAPI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="border border-white p-4 sticky top-6" style={{ backgroundColor: '#212121' }}>
            <h3 className="text-lg font-bold text-white mb-4">Contents</h3>
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
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="border border-white p-8" style={{ backgroundColor: '#212121' }}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}