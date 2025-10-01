import React from 'react';
import { Zap, Key, Code2, Play } from 'lucide-react';
import CodeBlock from '../common/CodeBlock';

export default function GettingStarted() {
  const quickStartCode = `curl -X POST https://api.moviapi.com/api/v1/video/render \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "timeline": {
      "tracks": [{
        "clips": [{
          "asset": {
            "type": "text",
            "text": "Hello MoviAPI!",
            "font": {
              "family": "Arial",
              "color": "#ffffff",
              "size": 48
            }
          },
          "start": 0,
          "length": 5
        }]
      }]
    },
    "output": {
      "format": "mp4",
      "size": {
        "width": 1280,
        "height": 720
      }
    }
  }'`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Getting Started with Video API</h2>
        <p className="text-white opacity-80 text-lg mb-6">
          Create professional videos programmatically with the MoviAPI Video API.
          Generate videos from text, images, audio, and video clips with a simple REST API.
        </p>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-6 h-6" />
          <span>What You Can Build</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">🎬 Marketing Videos</h4>
            <p className="text-white opacity-70 text-sm">
              Automated product videos, social media content, and promotional materials
            </p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">📱 Social Media</h4>
            <p className="text-white opacity-70 text-sm">
              Instagram stories, TikTok content, YouTube thumbnails and shorts
            </p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">🎓 Educational Content</h4>
            <p className="text-white opacity-70 text-sm">
              Tutorial videos, course materials, and explainer videos
            </p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">🛍️ E-commerce</h4>
            <p className="text-white opacity-70 text-sm">
              Product showcases, testimonial compilations, and ad creatives
            </p>
          </div>
        </div>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Key className="w-6 h-6" />
          <span>Prerequisites</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-black text-sm font-bold">1</span>
            </div>
            <div>
              <p className="text-white font-medium">API Token</p>
              <p className="text-white opacity-60 text-sm">
                Get your API token from the <a href="#" className="underline">API Tokens</a> section
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-black text-sm font-bold">2</span>
            </div>
            <div>
              <p className="text-white font-medium">Credits</p>
              <p className="text-white opacity-60 text-sm">
                Purchase credits to use the API. Video rendering costs vary by duration and quality.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-black text-sm font-bold">3</span>
            </div>
            <div>
              <p className="text-white font-medium">HTTP Client</p>
              <p className="text-white opacity-60 text-sm">
                Use any HTTP client like cURL, Postman, or your favorite programming language
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Play className="w-6 h-6" />
          <span>Quick Start (60 seconds)</span>
        </h3>
        <p className="text-white opacity-80 mb-4">
          Create your first video in under a minute with this simple example:
        </p>
        <CodeBlock
          code={quickStartCode}
          language="bash"
          title="Create Your First Video"
        />
        <div className="mt-4 p-4 border border-green-500" style={{ backgroundColor: '#131313' }}>
          <h4 className="text-green-400 font-medium mb-2">Expected Response</h4>
          <CodeBlock
            code={`{
  "success": true,
  "data": {
    "id": "render_abc123",
    "status": "queued",
    "url": null,
    "created_at": "2025-09-30T12:00:00Z"
  }
}`}
            language="json"
          />
        </div>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Code2 className="w-6 h-6" />
          <span>Core Concepts</span>
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Timeline</h4>
            <p className="text-white opacity-70 text-sm mb-2">
              The timeline is the heart of your video. It contains tracks, which contain clips, which contain assets.
            </p>
            <div className="bg-black p-3 border border-white text-white opacity-60 text-xs font-mono">
              Timeline → Tracks → Clips → Assets (text, video, audio, image)
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Tracks</h4>
            <p className="text-white opacity-70 text-sm">
              Tracks are layers in your video. Higher tracks appear on top of lower tracks.
              Use different tracks for background, overlays, and effects.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Clips</h4>
            <p className="text-white opacity-70 text-sm">
              Clips define when and how long an asset appears in your video.
              Each clip has a start time, length, and optional transitions/effects.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Assets</h4>
            <p className="text-white opacity-70 text-sm">
              Assets are the building blocks: text, images, videos, and audio files.
              Each asset type has specific properties for customization.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">💰 Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Basic Plan</h4>
            <p className="text-2xl text-white font-bold mb-1">$0.20 <span className="text-sm opacity-60">/ second</span></p>
            <p className="text-white opacity-60 text-sm">For videos up to 60 seconds</p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Premium Plan</h4>
            <p className="text-2xl text-white font-bold mb-1">$0.15 <span className="text-sm opacity-60">/ second</span></p>
            <p className="text-white opacity-60 text-sm">For videos of any length</p>
          </div>
        </div>
        <p className="text-white opacity-60 text-sm mt-4">
          * Prices are in credits. 1 credit = $1 USD. Additional costs may apply for premium features.
        </p>
      </div>

      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">🚀 Next Steps</h3>
        <div className="space-y-3">
          <a href="#quickstart" className="block p-3 border border-white hover:bg-white hover:text-black transition-all">
            <h4 className="font-medium mb-1">Quickstart Tutorial →</h4>
            <p className="text-sm opacity-70">Build your first complete video in 5 minutes</p>
          </a>
          <a href="#api-reference" className="block p-3 border border-white hover:bg-white hover:text-black transition-all">
            <h4 className="font-medium mb-1">API Reference →</h4>
            <p className="text-sm opacity-70">Detailed documentation of all endpoints and parameters</p>
          </a>
          <a href="#examples" className="block p-3 border border-white hover:bg-white hover:text-black transition-all">
            <h4 className="font-medium mb-1">Practical Examples →</h4>
            <p className="text-sm opacity-70">Real-world use cases and code samples</p>
          </a>
        </div>
      </div>
    </div>
  );
}
