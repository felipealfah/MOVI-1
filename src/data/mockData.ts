import { ApiKey, ApiEndpoint, RequestHistory } from '../types';
import { User } from '../lib/supabase';

export const mockUser: User = {
  id: '1',
  name: 'John Silva',
  email: 'john@email.com',
  credits: 0, // New users start with 0 credits
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z'
};

// Convert to Supabase format
export const mockApiKeys = [
  {
    id: '1',
    user_id: '1',
    name: 'Production',
    key_hash: 'sk-prod-abc123def456ghi789',
    key_preview: 'sk-prod-abc1...ghi789',
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    last_used: '2024-01-20T14:22:00Z'
  },
  {
    id: '2', 
    user_id: '1',
    name: 'Development',
    key_hash: 'sk-dev-xyz789abc123def456',
    key_preview: 'sk-dev-xyz7...def456',
    is_active: true,
    created_at: '2024-01-16T09:15:00Z',
    last_used: '2024-01-19T16:45:00Z'
  },
  {
    id: '3',
    user_id: '1',
    name: 'Test',
    key_hash: 'sk-test-mno456pqr789stu012',
    key_preview: 'sk-test-mno4...stu012',
    is_active: false,
    created_at: '2024-01-17T11:20:00Z',
    last_used: null
  }
];

export const mockApiEndpoints = [
  {
    id: '1',
    name: 'Video Generator',
    description: 'Generate high-quality videos with text, audio and visual effects',
    category: 'Video',
    endpoint: '/api/v1/generate-video',
    method: 'POST',
    cost_per_request: 0.05,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
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
  "credits_used": 25
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
    cost_per_request: 0.02,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
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
  "credits_used": 5
}`
      }
    }
  },
  {
    id: '3',
    name: 'QR Code Generator',
    description: 'Custom QR code generator',
    category: 'Utilities',
    endpoint: '/api/v1/generate-qr',
    method: 'POST',
    cost_per_request: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    documentation: {
      parameters: [
        { name: 'data', type: 'string', required: true, description: 'Data to be encoded' },
        { name: 'size', type: 'number', required: false, description: 'QR code size (default: 256)' },
        { name: 'color', type: 'string', required: false, description: 'Code color (hex)' },
        { name: 'background', type: 'string', required: false, description: 'Background color (hex)' }
      ],
      example: {
        request: `{
  "data": "https://mysite.com",
  "size": 512,
  "color": "#000000",
  "background": "#FFFFFF"
}`,
        response: `{
  "success": true,
  "qr_url": "https://api.example.com/qr/def456.png",
  "size": 512,
  "credits_used": 2
}`
      }
    }
  }
];

export const mockHistory = [
  {
    id: '1',
    user_id: '1',
    api_id: '1',
    api_key_id: '1',
    status: 'success',
    tempo: '8.5s',
    width: 1280,
    height: 720,
    url_resultado: 'https://api.example.com/videos/abc123.mp4',
    video_status: 'available',
    body: { 
      timeline: {
        tracks: [
          {
            clips: [
              {
                asset: {
                  type: "text",
                  text: "Welcome to MoviAPI"
                }
              }
            ]
          }
        ]
      },
      output: { format: "mp4", size: { width: 1280, height: 720 } }
    },
    response: { success: true, video_url: "https://api.example.com/videos/abc123.mp4" },
    credits_cost: 25,
    created_at: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    user_id: '1',
    api_id: '2',
    api_key_id: '1',
    status: 'success',
    tempo: '0.8s',
    width: null,
    height: null,
    url_resultado: null,
    video_status: 'processing',
    body: { text: "This product is amazing!", language: "en" },
    response: { success: true, sentiment: "positive", confidence: 0.95 },
    credits_cost: 5,
    created_at: '2024-01-20T13:15:00Z'
  },
  {
    id: '3',
    user_id: '1',
    api_id: '3',
    api_key_id: '2',
    status: 'error',
    tempo: '0.3s',
    width: 512,
    height: 512,
    url_resultado: null,
    video_status: 'processing',
    body: { data: "", size: 512 },
    response: { success: false, error: "Empty data field" },
    credits_cost: 0,
    created_at: '2024-01-20T12:45:00Z'
  },
  {
    id: '4',
    user_id: '1',
    api_id: '1',
    api_key_id: '1',
    status: 'success',
    tempo: '12.3s',
    width: 1920,
    height: 1080,
    url_resultado: 'https://api.example.com/videos/xyz789.mp4',
    video_status: 'unavailable',
    body: { 
      timeline: {
        tracks: [
          {
            clips: [
              {
                asset: {
                  type: "video",
                  src: "https://example.com/background.mp4"
                }
              }
            ]
          }
        ]
      },
      output: { format: "mp4", size: { width: 1920, height: 1080 } }
    },
    response: { success: true, video_url: "https://api.example.com/videos/xyz789.mp4" },
    credits_cost: 35,
    created_at: '2024-01-19T16:30:00Z'
  },
  {
    id: '5',
    user_id: '1',
    api_id: '3',
    api_key_id: '2',
    status: 'success',
    tempo: '0.5s',
    width: 256,
    height: 256,
    url_resultado: 'https://api.example.com/qr/mno345.png',
    video_status: 'available',
    body: { data: "https://mysite.com", size: 256 },
    response: { success: true, qr_url: "https://api.example.com/qr/mno345.png" },
    credits_cost: 2,
    created_at: '2024-01-19T15:12:00Z'
  }
];