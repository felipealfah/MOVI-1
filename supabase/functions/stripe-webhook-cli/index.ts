import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'MoviAPI Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!, 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'stripe-signature, content-type, authorization, apikey',
};

Deno.serve(async (req) => {
  console.log(`🚀 CLI Webhook - Received ${req.method} request`);
  console.log('📋 Headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    if (req.method === 'OPTIONS') {
      console.log('✅ Handling CORS preflight');
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Handle GET requests for testing
    if (req.method === 'GET') {
      console.log('🧪 Test request received');
      
      // Test database connection
      try {
        const { data: testUser, error: testError } = await supabase
          .from('users')
          .select('id, email, credits')
          .limit(1)
          .single();
        
        if (testError) {
          console.error('❌ Database test failed:', testError);
          return new Response(JSON.stringify({ 
            status: 'error', 
            message: 'Database connection failed',
            error: testError.message 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        console.log('✅ Database test successful:', testUser);
        return new Response(JSON.stringify({ 
          status: 'success', 
          message: 'Webhook function is working!',
          database: 'connected',
          testUser: testUser
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        console.error('💥 Test error:', err);
        return new Response(JSON.stringify({ 
          status: 'error', 
          message: err.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get signature from headers
    const signature = req.headers.get('stripe-signature');
    console.log('🔐 Stripe signature:', signature ? 'Present' : 'Missing');
    
    if (!signature) {
      console.error('❌ No stripe-signature header found');
      return new Response(JSON.stringify({ error: 'No signature found' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get raw body
    const body = await req.text();
    console.log('📦 Body length:', body.length);

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      console.log('✅ Webhook signature verified for event:', event.type);
    } catch (error: any) {
      console.error('❌ Webhook signature verification failed:', error.message);
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`🎯 Processing webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('💳 Processing checkout session completed');
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        console.log('✅ Processing payment intent succeeded');
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    console.log('🎉 Webhook processed successfully');
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('💥 Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`💳 Processing checkout session: ${session.id}`);
  console.log('📋 Session metadata:', session.metadata);
  
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('❌ No user_id in session metadata');
    return;
  }

  console.log(`👤 Processing payment for user: ${userId}`);

  try {
    // First, check if user exists
    console.log('🔍 Checking if user exists...');
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email, credits')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('❌ Error finding user:', userError);
      return;
    }

    console.log('✅ User found:', existingUser);

    // Check if stripe_orders table exists and try to record the order
    console.log('💾 Attempting to record order...');
    try {
      const { error: orderError } = await supabase
        .from('stripe_orders')
        .insert({
          checkout_session_id: session.id,
          payment_intent_id: session.payment_intent as string,
          customer_id: session.customer as string,
          amount_subtotal: session.amount_subtotal || 0,
          amount_total: session.amount_total || 0,
          currency: session.currency || 'usd',
          payment_status: session.payment_status || 'unpaid',
          status: 'completed',
        });

      if (orderError) {
        console.error('❌ Error recording order (but continuing):', orderError);
        // Don't return here, continue with adding credits
      } else {
        console.log('✅ Order recorded successfully');
      }
    } catch (orderException) {
      console.error('💥 Exception recording order (but continuing):', orderException);
      // Don't return here, continue with adding credits
    }

    // Add credits to user account (this is the most important part)
    await addCreditsToUser(userId, session);
    
  } catch (error) {
    console.error('💥 Error in handleCheckoutSessionCompleted:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
  // Additional processing if needed
}

async function addCreditsToUser(userId: string, session: Stripe.Checkout.Session) {
  try {
    console.log(`💰 Adding credits to user: ${userId}`);
    
    // Get the price ID from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;
    
    console.log(`🏷️ Price ID: ${priceId}`);
    console.log(`📦 Line items:`, JSON.stringify(lineItems.data, null, 2));
    
    if (!priceId) {
      console.error('❌ No price ID found in session');
      return;
    }

    // Determine credits to add based on price ID
    let creditsToAdd = 0;
    
    // Map price IDs to credits based on your products
    switch (priceId) {
      case 'price_1SBh9MA3Ey5GjayWnkwgOAQD': // Basic Plan
        creditsToAdd = 100;
        break;
      case 'price_1SBhAmA3Ey5GjayWsBWfi0ty': // Premium Plan
        creditsToAdd = 500;
        break;
      case 'price_1SBhBdA3Ey5GjayWBMmMqteL': // Business Plan
        creditsToAdd = 1000;
        break;
      default:
        console.log(`❓ Unknown price ID: ${priceId}, adding default credits`);
        creditsToAdd = 100; // Default credits
    }

    console.log(`💎 Credits to add: ${creditsToAdd}`);

    // Get current user credits
    console.log('🔍 Fetching current user credits...');
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (getUserError) {
      console.error('❌ Error fetching user:', getUserError);
      return;
    }

    console.log(`💰 Current user credits: ${user.credits}`);

    // Update user credits
    const newCredits = (user.credits || 0) + creditsToAdd;
    
    console.log('💾 Updating user credits...');
    console.log(`📊 Old credits: ${user.credits}, Adding: ${creditsToAdd}, New total: ${newCredits}`);
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating user credits:', updateError);
      return;
    }

    console.log(`🎉 Successfully updated user credits!`);
    console.log(`📊 Updated user data:`, updatedUser);
    console.log(`💰 Final credits: ${updatedUser.credits}`);

  } catch (error) {
    console.error('💥 Error adding credits to user:', error);
  }
}