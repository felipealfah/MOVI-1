/*
  # Fix User Registration with 0 Credits

  1. Security Changes
    - Add policy for user registration (INSERT)
    - Fix existing policies for better user access
    - Allow users to insert their own profile during signup

  2. Tables Modified
    - `users` table policies updated
    - Allow authenticated users to insert their own data
    - Maintain security for read/update operations

  3. Function Fix
    - Change from 1000 to 0 credits for new users
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix the auth trigger function with 0 credits (NOT 1000!)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, credits)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();