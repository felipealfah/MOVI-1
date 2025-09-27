import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'MoviAPI Integration',
    version: '1.0.0',
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  console.log(`Received ${req.method} request to stripe-checkout`);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response('OK', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    if (req.method !== 'POST') {
      console.log(`Method ${req.method} not allowed`);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { price_id, success_url, cancel_url, mode } = requestBody;

    // Validate required parameters
    if (!price_id || !success_url || !cancel_url || !mode) {
      console.log('Missing required parameters:', { price_id, success_url, cancel_url, mode });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Authenticating user with token...');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      console.log('Authentication failed:', getUserError);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate user' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('User authenticated:', user.id);

    // Check if customer exists
    console.log('Checking for existing Stripe customer...');
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer:', getCustomerError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch customer information' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let customerId;

    // Create customer if doesn't exist
    if (!customer || !customer.customer_id) {
      console.log('Creating new Stripe customer...');
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

      const { error: createCustomerError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

      if (createCustomerError) {
        console.error('Failed to save customer:', createCustomerError);
        // Cleanup Stripe customer
        try {
          await stripe.customers.del(newCustomer.id);
        } catch (deleteError) {
          console.error('Failed to cleanup Stripe customer:', deleteError);
        }
        return new Response(
          JSON.stringify({ error: 'Failed to create customer mapping' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      customerId = newCustomer.id;
    } else {
      console.log('Using existing customer:', customer.customer_id);
      customerId = customer.customer_id;
    }

    // Create checkout session
    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode,
      success_url,
      cancel_url,
      metadata: {
        user_id: user.id,
      },
    });

    console.log(`Created checkout session ${session.id} for customer ${customerId}`);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    console.error('Full error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});