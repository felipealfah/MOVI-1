export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  lastUsed: string | null;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  category: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  costPerRequest: number;
  documentation: {
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    example: {
      request: string;
      response: string;
    };
  };
}

export interface RequestHistory {
  id: string;
  status: 'success' | 'error' | 'pending';
  tempo: string;
  width?: number;
  height?: number;
  id_api: string;
  id_usuario: string;
  url_resultado?: string;
  video_status: 'available' | 'unavailable' | 'processing';
  body: string;
  createdAt: string;
  creditsCost: number;
}

export type View = 'dashboard' | 'apis' | 'tokens' | 'history' | 'profile' | 'documentation';