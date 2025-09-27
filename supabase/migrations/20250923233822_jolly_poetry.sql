/*
  # Create automatic API key for new users

  1. New Function
    - `create_user_api_key()` - Creates an API key automatically when a user is created
  
  2. Trigger
    - Executes after user insertion to create the API key
  
  3. Security
    - Function runs with security definer privileges
    - Only creates API key for the newly inserted user
*/

-- Function to create API key for new user
CREATE OR REPLACE FUNCTION create_user_api_key()
RETURNS TRIGGER AS $$
DECLARE
  api_key_value TEXT;
  key_preview TEXT;
BEGIN
  -- Generate API key based on user ID
  api_key_value := 'sk-' || replace(NEW.id::text, '-', '');
  key_preview := substring(api_key_value from 1 for 12) || '...' || substring(api_key_value from length(api_key_value) - 3);
  
  -- Insert API key for the new user
  INSERT INTO api_keys (
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create API key when user is created
DROP TRIGGER IF EXISTS create_api_key_on_user_creation ON users;
CREATE TRIGGER create_api_key_on_user_creation
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_api_key();

-- Create API keys for existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
  api_key_value TEXT;
  key_preview TEXT;
BEGIN
  FOR user_record IN 
    SELECT u.id, u.name 
    FROM users u 
    LEFT JOIN api_keys ak ON u.id = ak.user_id 
    WHERE ak.user_id IS NULL
  LOOP
    -- Generate API key based on user ID
    api_key_value := 'sk-' || replace(user_record.id::text, '-', '');
    key_preview := substring(api_key_value from 1 for 12) || '...' || substring(api_key_value from length(api_key_value) - 3);
    
    -- Insert API key for existing user
    INSERT INTO api_keys (
      user_id,
      name,
      key_hash,
      key_preview,
      is_active
    ) VALUES (
      user_record.id,
      'Default API Key',
      api_key_value,
      key_preview,
      true
    );
  END LOOP;
END $$;