/*
  # Fix Stripe Customers Table and Permissions

  1. Tables
    - Ensure `stripe_customers` table exists with correct structure
    - Add proper indexes for performance
    
  2. Security
    - Enable RLS on stripe_customers table
    - Add policies for service role access (needed for edge functions)
    - Add policies for authenticated users to view their own data
    
  3. Functions
    - Grant necessary permissions to service role
*/

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Service role can manage all customer data" ON stripe_customers;

-- Policy for authenticated users to view their own data
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Policy for service role (used by edge functions) to manage all data
CREATE POLICY "Service role can manage all customer data"
  ON stripe_customers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_deleted_at ON stripe_customers(deleted_at);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_stripe_customers_updated_at'
  ) THEN
    CREATE TRIGGER update_stripe_customers_updated_at
      BEFORE UPDATE ON stripe_customers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Grant permissions to service role
GRANT ALL ON stripe_customers TO service_role;
GRANT USAGE, SELECT ON SEQUENCE stripe_customers_id_seq TO service_role;

-- Also ensure stripe_orders table has proper permissions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_orders') THEN
    -- Grant permissions to service role for stripe_orders
    GRANT ALL ON stripe_orders TO service_role;
    
    -- Add service role policy for stripe_orders
    DROP POLICY IF EXISTS "Service role can manage all order data" ON stripe_orders;
    CREATE POLICY "Service role can manage all order data"
      ON stripe_orders
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;