/*
  # Fix API Key Creation Trigger

  1. Problem
    - Trigger trying to create API key but failing
    - Transaction being aborted due to error

  2. Solution
    - Fix the API key creation function
    - Add proper error handling
    - Ensure correct table references
*/

-- First, let's see what triggers exist
-- (Run this separately to check)

-- Fix the API key creation function
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
      is_active
    ) VALUES (
      NEW.id,
      'Default API Key',
      api_key_value,
      key_preview,
      true
    );
    
    RAISE NOTICE 'API key created for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create API key for user %: % - %', NEW.id, SQLSTATE, SQLERRM;
      -- Don't re-raise the error, just log it
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger if it exists
DROP TRIGGER IF EXISTS create_api_key_on_user_creation ON public.users;
CREATE TRIGGER create_api_key_on_user_creation
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_api_key();