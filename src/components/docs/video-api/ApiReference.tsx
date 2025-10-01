import React from 'react';
import ApiEndpoint from '../common/ApiEndpoint';
import CodeBlock from '../common/CodeBlock';
import ParameterTable, { Parameter } from '../common/ParameterTable';

export default function ApiReference() {
  const renderParameters: Parameter[] = [
    {
      name: 'timeline',
      type: 'Timeline',
      required: true,
      description: 'The video timeline configuration containing tracks and clips',
      example: 'See timeline object schema below'
    },
    {
      name: 'output',
      type: 'Output',
      required: true,
      description: 'Output configuration for the rendered video',
      example: 'See output object schema below'
    },
    {
      name: 'callback',
      type: 'string',
      required: false,
      description: 'Webhook URL to receive rendering status updates',
      example: 'https://yourapp.com/webhook'
    },
    {
      name: 'merge',
      type: 'Merge[]',
      required: false,
      description: 'Array of merge fields for dynamic content replacement',
      example: '[{ "find": "NAME", "replace": "John" }]'
    }
  ];

  const timelineParameters: Parameter[] = [
    {
      name: 'soundtrack',
      type: 'Soundtrack',
      required: false,
      description: 'Background music configuration for the entire video'
    },
    {
      name: 'background',
      type: 'string',
      required: false,
      description: 'Background color in hex format',
      default: '#000000',
      example: '#ffffff'
    },
    {
      name: 'fonts',
      type: 'Font[]',
      required: false,
      description: 'Array of custom fonts to load'
    },
    {
      name: 'tracks',
      type: 'Track[]',
      required: true,
      description: 'Array of tracks containing clips and assets'
    }
  ];

  const trackParameters: Parameter[] = [
    {
      name: 'clips',
      type: 'Clip[]',
      required: true,
      description: 'Array of clips to display on this track'
    }
  ];

  const clipParameters: Parameter[] = [
    {
      name: 'asset',
      type: 'Asset',
      required: true,
      description: 'The asset to display (text, video, image, audio, luma, html)'
    },
    {
      name: 'start',
      type: 'number',
      required: true,
      description: 'When the clip starts (in seconds)',
      example: '0'
    },
    {
      name: 'length',
      type: 'number | string',
      required: true,
      description: 'Duration of the clip in seconds or "auto" for asset duration',
      example: '5 or "auto"'
    },
    {
      name: 'fit',
      type: 'string',
      required: false,
      description: 'How to fit the asset: "cover", "contain", "crop", "none"',
      default: 'cover'
    },
    {
      name: 'scale',
      type: 'number',
      required: false,
      description: 'Scale factor for the asset',
      default: '1',
      example: '0.5'
    },
    {
      name: 'position',
      type: 'string',
      required: false,
      description: 'Position: "top", "center", "bottom", etc.',
      default: 'center'
    },
    {
      name: 'offset',
      type: 'Offset',
      required: false,
      description: 'X and Y offset for positioning'
    },
    {
      name: 'transition',
      type: 'Transition',
      required: false,
      description: 'Transition effects for in/out'
    },
    {
      name: 'effect',
      type: 'string',
      required: false,
      description: 'Visual effect: "zoomIn", "zoomOut", "slideLeft", etc.'
    },
    {
      name: 'opacity',
      type: 'number',
      required: false,
      description: 'Opacity from 0 to 1',
      default: '1',
      example: '0.8'
    }
  ];

  const outputParameters: Parameter[] = [
    {
      name: 'format',
      type: 'string',
      required: true,
      description: 'Output format: "mp4", "gif", "mp3"',
      example: 'mp4'
    },
    {
      name: 'resolution',
      type: 'string',
      required: false,
      description: 'Resolution preset: "preview", "sd", "hd", "1080"',
      default: 'sd',
      example: 'hd'
    },
    {
      name: 'size',
      type: 'Size',
      required: false,
      description: 'Custom width and height (overrides resolution)'
    },
    {
      name: 'fps',
      type: 'number',
      required: false,
      description: 'Frames per second: 12, 15, 24, 25, 30',
      default: '25',
      example: '30'
    },
    {
      name: 'quality',
      type: 'string',
      required: false,
      description: 'Quality: "low", "medium", "high"',
      default: 'medium',
      example: 'high'
    },
    {
      name: 'repeat',
      type: 'boolean',
      required: false,
      description: 'Loop the video (GIF only)',
      default: 'true'
    }
  ];

  const renderExample = `{
  "timeline": {
    "background": "#000000",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://example.com/background.mp4",
              "trim": 5
            },
            "start": 0,
            "length": 10
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Welcome to MoviAPI",
              "font": {
                "family": "Arial",
                "color": "#ffffff",
                "size": 48
              },
              "alignment": {
                "horizontal": "center",
                "vertical": "center"
              }
            },
            "start": 2,
            "length": 5,
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "effect": "zoomIn"
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "resolution": "hd",
    "fps": 30,
    "quality": "high"
  }
}`;

  const renderResponse = `{
  "success": true,
  "data": {
    "id": "render_abc123def456",
    "status": "queued",
    "url": null,
    "poster": null,
    "thumbnail": null,
    "duration": null,
    "renderTime": null,
    "owner": "user_xyz789",
    "plan": "premium",
    "created": "2025-09-30T12:00:00Z",
    "updated": "2025-09-30T12:00:00Z"
  },
  "message": "Render queued successfully"
}`;

  const statusResponse = `{
  "success": true,
  "data": {
    "id": "render_abc123def456",
    "status": "done",
    "url": "https://cdn.moviapi.com/renders/render_abc123def456.mp4",
    "poster": "https://cdn.moviapi.com/renders/render_abc123def456_poster.jpg",
    "thumbnail": "https://cdn.moviapi.com/renders/render_abc123def456_thumb.jpg",
    "duration": 10.5,
    "renderTime": 12.3,
    "owner": "user_xyz789",
    "plan": "premium",
    "size": {
      "width": 1920,
      "height": 1080
    },
    "created": "2025-09-30T12:00:00Z",
    "updated": "2025-09-30T12:00:15Z",
    "creditsUsed": 52
  },
  "message": "Render completed successfully"
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">API Reference</h2>
        <p className="text-white opacity-80 text-lg mb-6">
          Complete reference for the Video API endpoints, parameters, and responses.
        </p>
      </div>

      {/* Render Video Endpoint */}
      <div className="space-y-4">
        <ApiEndpoint
          method="POST"
          path="/api/v1/video/render"
          description="Create a new video render job"
          authenticated={true}
        />

        <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-bold text-white mb-4">Request Body</h3>
          <ParameterTable parameters={renderParameters} title="Main Parameters" />

          <h4 className="text-md font-bold text-white mt-6 mb-3">Timeline Object</h4>
          <ParameterTable parameters={timelineParameters} title="Timeline Parameters" />

          <h4 className="text-md font-bold text-white mt-6 mb-3">Track Object</h4>
          <ParameterTable parameters={trackParameters} title="Track Parameters" />

          <h4 className="text-md font-bold text-white mt-6 mb-3">Clip Object</h4>
          <ParameterTable parameters={clipParameters} title="Clip Parameters" />

          <h4 className="text-md font-bold text-white mt-6 mb-3">Output Object</h4>
          <ParameterTable parameters={outputParameters} title="Output Parameters" />
        </div>

        <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-bold text-white mb-4">Example Request</h3>
          <CodeBlock
            code={renderExample}
            language="json"
            title="POST /api/v1/video/render"
          />
        </div>

        <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-bold text-white mb-4">Response</h3>
          <CodeBlock
            code={renderResponse}
            language="json"
            title="201 Created"
          />
          <div className="mt-4">
            <h4 className="text-white font-medium mb-2">Status Values</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <code className="text-yellow-400">queued</code>
                <span className="text-white opacity-70">- Render job is queued for processing</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <code className="text-blue-400">rendering</code>
                <span className="text-white opacity-70">- Video is currently being rendered</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <code className="text-green-400">done</code>
                <span className="text-white opacity-70">- Rendering completed successfully</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <code className="text-red-400">failed</code>
                <span className="text-white opacity-70">- Rendering failed (check error message)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Render Status Endpoint */}
      <div className="space-y-4">
        <ApiEndpoint
          method="GET"
          path="/api/v1/video/render/:id"
          description="Get the status and details of a render job"
          authenticated={true}
        />

        <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-bold text-white mb-4">Path Parameters</h3>
          <ParameterTable
            parameters={[
              {
                name: 'id',
                type: 'string',
                required: true,
                description: 'The unique render ID returned from the render endpoint',
                example: 'render_abc123def456'
              }
            ]}
          />
        </div>

        <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
          <h3 className="text-lg font-bold text-white mb-4">Example Response (Completed)</h3>
          <CodeBlock
            code={statusResponse}
            language="json"
            title="200 OK"
          />
        </div>
      </div>

      {/* Asset Types */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">Asset Types</h3>
        <p className="text-white opacity-70 mb-4">
          Assets are the building blocks of your video. Each type has specific properties:
        </p>

        <div className="space-y-4">
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Video Asset</h4>
            <CodeBlock
              code={`{
  "type": "video",
  "src": "https://example.com/video.mp4",
  "trim": 5,
  "volume": 1,
  "volumeEffect": "fadeIn"
}`}
              language="json"
            />
          </div>

          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Text Asset</h4>
            <CodeBlock
              code={`{
  "type": "text",
  "text": "Your Text Here",
  "font": {
    "family": "Arial",
    "color": "#ffffff",
    "size": 48,
    "weight": "bold"
  },
  "alignment": {
    "horizontal": "center",
    "vertical": "center"
  },
  "width": 400,
  "height": 100
}`}
              language="json"
            />
          </div>

          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Image Asset</h4>
            <CodeBlock
              code={`{
  "type": "image",
  "src": "https://example.com/image.jpg"
}`}
              language="json"
            />
          </div>

          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Audio Asset</h4>
            <CodeBlock
              code={`{
  "type": "audio",
  "src": "https://example.com/audio.mp3",
  "volume": 0.8,
  "effect": "fadeOut"
}`}
              language="json"
            />
          </div>
        </div>
      </div>

      {/* Error Responses */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">Error Responses</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">400 Bad Request</h4>
            <CodeBlock
              code={`{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid timeline configuration",
    "details": "clips[0].start must be a number"
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">401 Unauthorized</h4>
            <CodeBlock
              code={`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API token"
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">402 Payment Required</h4>
            <CodeBlock
              code={`{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits for this operation",
    "required": 50,
    "available": 10
  }
}`}
              language="json"
            />
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">404 Not Found</h4>
            <CodeBlock
              code={`{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Render not found"
  }
}`}
              language="json"
            />
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="border border-white p-6" style={{ backgroundColor: '#212121' }}>
        <h3 className="text-xl font-bold text-white mb-4">Rate Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Basic Plan</h4>
            <p className="text-2xl text-white font-bold">10</p>
            <p className="text-white opacity-60 text-sm">requests / minute</p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Premium Plan</h4>
            <p className="text-2xl text-white font-bold">60</p>
            <p className="text-white opacity-60 text-sm">requests / minute</p>
          </div>
          <div className="border border-white p-4" style={{ backgroundColor: '#131313' }}>
            <h4 className="text-white font-medium mb-2">Business Plan</h4>
            <p className="text-2xl text-white font-bold">300</p>
            <p className="text-white opacity-60 text-sm">requests / minute</p>
          </div>
        </div>
        <p className="text-white opacity-60 text-sm mt-4">
          Rate limit headers are included in all API responses:
          <code className="ml-2">X-RateLimit-Limit</code>,
          <code className="ml-2">X-RateLimit-Remaining</code>,
          <code className="ml-2">X-RateLimit-Reset</code>
        </p>
      </div>
    </div>
  );
}
