import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Stripe webhook received')

    // Get Stripe credentials from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    if (!stripeWebhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Get Stripe signature from header
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('No stripe-signature header')
    }

    // Get raw body for signature verification
    const body = await req.text()

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
      console.log('Webhook signature verified:', event.type)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)

        const userId = session.metadata?.user_id
        if (!userId || userId === 'anonymous') {
          console.warn('No user_id in session metadata')
          break
        }

        // Get price details to determine credits
        const priceId = session.line_items?.data[0]?.price?.id
        const amountTotal = session.amount_total || 0

        // Map price ID to credits (should match your stripe-config.ts)
        const creditsMap: Record<string, number> = {
          'price_1SBh9MA3Ey5GjayWnkwgOAQD': 100,   // Basic
          'price_1SBhAmA3Ey5GjayWsBWfi0ty': 500,   // Premium
          'price_1SBhBdA3Ey5GjayWBMmMqteL': 1000,  // Business
        }

        const credits = priceId ? creditsMap[priceId] || 0 : 0

        if (credits > 0) {
          // Add credits to user
          const { error: updateError } = await supabase
            .from('users')
            .update({
              credits: supabase.rpc('increment', { x: credits }),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)

          if (updateError) {
            console.error('Failed to update user credits:', updateError)
          } else {
            console.log(`Added ${credits} credits to user ${userId}`)
          }
        }

        // Save order record
        const { error: orderError } = await supabase
          .from('stripe_orders')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
            amount: amountTotal / 100, // Convert cents to dollars
            currency: session.currency || 'usd',
            status: session.payment_status,
            credits_added: credits,
            metadata: session.metadata,
          })

        if (orderError) {
          console.error('Failed to save order:', orderError)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})