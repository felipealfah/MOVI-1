import { supabase } from './supabase';
import { STRIPE_PRODUCTS, StripeProductId } from '../stripe-config';

export interface CheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment' | 'subscription';
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  productId: StripeProductId
): Promise<CheckoutSessionResponse> {
  console.log('Creating checkout session for product:', productId);
  
  const product = STRIPE_PRODUCTS[productId];
  
  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }
  
  console.log('Product found:', product);
  console.log('Getting user session...');

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  console.log('Session result:', { session: session ? 'exists' : 'null', error: sessionError });
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw new Error(`Session error: ${sessionError.message}`);
  }
  
  console.log('Session data:', session ? 'exists' : 'null');
  
  if (!session?.access_token) {
    console.error('No access token found');
    throw new Error('User not authenticated');
  }
  
  console.log('Access token found, proceeding...');
  console.log('Access token preview:', session.access_token.substring(0, 20) + '...');

  // Use window.location.origin para URLs de retorno
  const baseUrl = window.location.origin;
  console.log('Base URL:', baseUrl);
  const successUrl = `${baseUrl}/?payment=success`;
  const cancelUrl = `${baseUrl}/?payment=canceled`;
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Verificar se a URL do Supabase está correta
  if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
    console.error('Invalid Supabase URL:', supabaseUrl);
    throw new Error('Supabase URL not configured correctly');
  }
  
  const functionUrl = `${supabaseUrl}/functions/v1/stripe-checkout`;
  
  console.log('Calling function URL:', functionUrl);
  console.log('Environment check:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'exists' : 'missing',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'exists' : 'missing'
  });
  
  console.log('Request payload:', {
    price_id: product.priceId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: product.mode,
  });
  console.log('Making fetch request...');
  console.log('Request headers will be:', {
    'Authorization': `Bearer ${session.access_token.substring(0, 20)}...`,
    'Content-Type': 'application/json',
    'x-client-info': 'supabase-js-web',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY ? 'exists' : 'missing',
  });

  try {
    console.log('Starting fetch request...');
    
    // Primeiro, vamos testar se a edge function existe
    console.log('Testing edge function availability...');
    const testResponse = await fetch(functionUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
      },
    });
    console.log('OPTIONS response status:', testResponse.status);
    console.log('OPTIONS response headers:', Object.fromEntries(testResponse.headers.entries()));
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'x-client-info': 'supabase-js-web',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        'Origin': window.location.origin,
      },
      body: JSON.stringify({
        price_id: product.priceId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        mode: product.mode,
      }),
    });
    
    console.log('Fetch completed, processing response...');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe checkout error response:', errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText };
      }
      throw new Error(error.error || `HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Checkout session created successfully:', result);
    console.log('Checkout URL received:', result.url);
    return result;
    
  } catch (fetchError: any) {
    console.error('Fetch error details:', fetchError);
    console.error('Error name:', fetchError.name);
    console.error('Error message:', fetchError.message);
    console.error('Error stack:', fetchError.stack);
    
    if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to payment service. Please check your internet connection and try again.');
    }
    
    throw fetchError;
  }
}

export async function getUserOrders() {
  const { data, error } = await supabase
    .from('stripe_orders')
    .select(`
      *,
      stripe_customers!inner(user_id)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}