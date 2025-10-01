import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && 
                            supabaseAnonKey !== 'placeholder-key' &&
                            supabaseUrl.includes('supabase.co');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  category: string;
  endpoint: string;
  method: string;
  price_per_second: number;
  status: 'active' | 'inactive' | 'maintenance';
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
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_preview: string;
  is_active: boolean;
  last_used: string | null;
  created_at: string;
}

export interface RequestHistory {
  id: string;
  user_id: string;
  api_id: string;
  api_key_id: string | null;
  status: 'success' | 'error' | 'pending';
  tempo: string | null;
  width: number | null;
  height: number | null;
  url_resultado: string | null;
  video_status: 'available' | 'unavailable' | 'processing';
  body: any;
  response: any;
  credits_cost: number;
  created_at: string;
}

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;

  // User profile and API key will be created automatically by the triggers

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getApiEndpoints = async (): Promise<ApiEndpoint[]> => {
  const { data, error } = await supabase
    .from('api_endpoints')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

export const getUserApiKeys = async (): Promise<ApiKey[]> => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createApiKey = async (name: string): Promise<ApiKey> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate a random API key
  const keyValue = `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const keyPreview = `${keyValue.substring(0, 12)}...${keyValue.substring(keyValue.length - 4)}`;

  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      {
        user_id: user.id,
        name,
        key_hash: keyValue, // In production, this should be hashed
        key_preview: keyPreview,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserHistory = async (): Promise<RequestHistory[]> => {
  console.log('🔍 getUserHistory: Starting...');

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('👤 Current user:', user?.email || 'No user');

  if (!user) {
    console.error('❌ User not authenticated');
    throw new Error('User not authenticated');
  }

  console.log('📡 Fetching history for user:', user.id);
  const startTime = Date.now();

  const { data, error } = await supabase
    .from('request_history')
    .select('*')
    .eq('user_id', user.id)  // Filter by current user ID
    .order('created_at', { ascending: false });

  const endTime = Date.now();
  console.log(`⏱️ Database query took: ${endTime - startTime}ms`);

  if (error) {
    console.error('❌ Database error:', error);
    throw error;
  }

  console.log(`✅ Found ${data?.length || 0} history records`);
  console.log('📋 History data:', data);

  return data || [];
};

// Function to check and update video availability
export const checkVideoAvailability = async (videoId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('check_video_availability', {
    video_id: videoId
  });

  if (error) throw error;
  return data;
};

// Function to get video with status information
export const getVideoWithStatus = async (videoId: string) => {
  const { data, error } = await supabase.rpc('get_video_with_status', {
    video_id: videoId
  });

  if (error) throw error;
  return data?.[0] || null;
};

// Function to update expired videos (can be called manually or scheduled)
export const updateExpiredVideos = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('update_expired_videos');

  if (error) throw error;
  return data || 0;
};

export const createHistoryEntry = async (entry: Omit<RequestHistory, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('request_history')
    .insert([
      {
        ...entry,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserCredits = async (newCredits: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('users')
    .update({ credits: newCredits })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Error logging functions
export const logError = async (errorData: {
  error_type: 'javascript' | 'network' | 'authentication' | 'payment' | 'api' | 'render' | 'unknown';
  error_message: string;
  error_stack?: string | null;
  component_name?: string | null;
  metadata?: any;
  is_critical?: boolean;
}) => {
  try {
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();

    const errorLog = {
      user_id: user?.id || null,
      error_type: errorData.error_type,
      error_message: errorData.error_message,
      error_stack: errorData.error_stack || null,
      component_name: errorData.component_name || null,
      url: window.location.href,
      user_agent: navigator.userAgent,
      metadata: errorData.metadata || {},
      is_critical: errorData.is_critical || false,
      resolved: false,
    };

    // Only log to database if Supabase is configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('error_logs')
        .insert([errorLog])
        .select()
        .single();

      if (error) {
        console.error('Failed to log error to database:', error);
        // Fallback to console log if database logging fails
        console.error('Original error:', errorLog);
      } else {
        console.log('Error logged to database:', data.id);
      }
    } else {
      // Log to console when Supabase is not configured
      console.error('Error (DB not configured):', errorLog);
    }
  } catch (loggingError) {
    // Prevent infinite loops - just log to console if error logging fails
    console.error('Failed to log error:', loggingError);
    console.error('Original error:', errorData);
  }
};

// Helper function to log JavaScript errors
export const logJavaScriptError = (error: Error, componentName?: string, metadata?: any) => {
  logError({
    error_type: 'javascript',
    error_message: error.message,
    error_stack: error.stack,
    component_name: componentName,
    metadata: {
      ...metadata,
      errorName: error.name,
    },
    is_critical: true,
  });
};

// Helper function to log network errors
export const logNetworkError = (url: string, status: number, statusText: string, metadata?: any) => {
  logError({
    error_type: 'network',
    error_message: `Network error: ${status} ${statusText}`,
    metadata: {
      ...metadata,
      url,
      status,
      statusText,
    },
    is_critical: false,
  });
};

// Helper function to log API errors
export const logApiError = (apiName: string, error: any, metadata?: any) => {
  logError({
    error_type: 'api',
    error_message: `API Error in ${apiName}: ${error.message || error}`,
    error_stack: error.stack,
    metadata: {
      ...metadata,
      apiName,
      error: typeof error === 'object' ? JSON.stringify(error) : error,
    },
    is_critical: true,
  });
};

// Helper function to log render errors
export const logRenderError = (componentName: string, error: Error, metadata?: any) => {
  logError({
    error_type: 'render',
    error_message: `Render error in ${componentName}: ${error.message}`,
    error_stack: error.stack,
    component_name: componentName,
    metadata: {
      ...metadata,
      errorName: error.name,
    },
    is_critical: true,
  });
};

// Get error logs for admin/debugging (optional)
export const getErrorLogs = async (limit: number = 50) => {
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};