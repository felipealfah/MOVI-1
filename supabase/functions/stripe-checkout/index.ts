import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Stripe checkout function called')

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment')
      throw new Error('Stripe not configured')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Parse request body
    const { price_id, success_url, cancel_url, mode } = await req.json()
    console.log('Request data:', { price_id, success_url, cancel_url, mode })

    if (!price_id || !success_url || !cancel_url) {
      throw new Error('Missing required parameters')
    }

    // Get user from authorization header (optional for payment)
    const authHeader = req.headers.get('Authorization')
    let userEmail = undefined
    let userId = undefined

    if (authHeader) {
      try {
        // Extract JWT token
        const jwt = authHeader.replace('Bearer ', '')

        // Verify token with Supabase
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (supabaseUrl && supabaseServiceKey) {
          const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'apikey': supabaseServiceKey,
            },
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            userEmail = userData.email
            userId = userData.id
            console.log('User authenticated:', { userId, userEmail })
          }
        }
      } catch (error) {
        console.warn('Auth verification failed:', error.message)
        // Continue without user - payment can still proceed
      }
    }

    // Create Stripe checkout session
    console.log('Creating Stripe session...')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode || 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: userEmail,
      metadata: {
        user_id: userId || 'anonymous',
      },
    })

    console.log('Session created successfully:', session.id)

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})