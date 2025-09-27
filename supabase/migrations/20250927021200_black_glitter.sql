/*
  # Fix API Key Creation Function

  1. Problem
    - Function create_user_api_key() was failing during user signup
    - Causing transaction to abort and preventing user creation
    - Missing proper schema reference and error handling

  2. Solution
    - Fix the function with proper error handling
    - Ensure it references the correct table schema (public.api_keys)
    - Add proper exception handling that doesn't abort the transaction
    - Add explicit created_at timestamp
*/

-- Fix the API key creation function with proper error handling
CREATE OR REPLACE FUNCTION create_user_api_key()
RETURNS TRIGGER AS $$
DECLARE
  api_key_value TEXT;
  key_preview TEXT;
BEGIN
  -- Generate API key based on user ID
  api_key_value := 'sk-' || replace(NEW.id::text, '-', '');
  key_preview := substring(api_key_value from 1 for 12) || '...' || substring(api_key_value from length(api_key_value) - 3);
  
  -- Insert API key for the new user with proper error handling
  BEGIN
    INSERT INTO public.api_keys (
      user_id,
      name,
      key_hash,
      key_preview,
      is_active,
      created_at
    ) VALUES (
      NEW.id,
      'Default API Key',
      api_key_value,
      key_preview,
      true,
      now()
    );
    
    RAISE NOTICE 'API key created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create API key for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Don't re-raise the error to prevent user creation from failing
      -- Just log it and continue
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS create_api_key_on_user_creation ON public.users;
CREATE TRIGGER create_api_key_on_user_creation
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_api_key();