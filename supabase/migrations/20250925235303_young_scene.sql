/*
  # Create Missing Stripe Tables

  1. New Tables
    - `stripe_orders`: Store order/purchase information
    - `stripe_subscriptions`: Store subscription data (for future use)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and service role
    
  3. Indexes
    - Add performance indexes
*/

-- Create stripe_orders table
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL,
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'canceled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Enable RLS
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own order data
CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id
      FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Policy for service role (used by edge functions) to manage all data
CREATE POLICY "Service role can manage all order data"
  ON stripe_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create stripe_subscriptions table (for future use)
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text UNIQUE NOT NULL,
  subscription_id text DEFAULT NULL,
  price_id text DEFAULT NULL,
  current_period_start bigint DEFAULT NULL,
  current_period_end bigint DEFAULT NULL,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text DEFAULT NULL,
  payment_method_last4 text DEFAULT NULL,
  status text NOT NULL CHECK (status IN ('not_started', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Enable RLS
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own subscription data
CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id
      FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Policy for service role to manage all subscription data
CREATE POLICY "Service role can manage all subscription data"
  ON stripe_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON stripe_orders(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_payment_intent_id ON stripe_orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_created_at ON stripe_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_deleted_at ON stripe_orders(deleted_at);

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_subscription_id ON stripe_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_deleted_at ON stripe_subscriptions(deleted_at);

-- Grant permissions to service role
GRANT ALL ON stripe_orders TO service_role;
GRANT USAGE, SELECT ON SEQUENCE stripe_orders_id_seq TO service_role;
GRANT ALL ON stripe_subscriptions TO service_role;
GRANT USAGE, SELECT ON SEQUENCE stripe_subscriptions_id_seq TO service_role;

-- Update timestamps trigger function (reuse existing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_stripe_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_stripe_orders_updated_at
      BEFORE UPDATE ON stripe_orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_stripe_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_stripe_subscriptions_updated_at
      BEFORE UPDATE ON stripe_subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;