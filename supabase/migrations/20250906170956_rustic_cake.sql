/*
  # Complete API Hub Schema

  1. New Tables
    - `users` - User accounts with credits
    - `api_endpoints` - Available APIs with documentation
    - `api_keys` - User API tokens
    - `request_history` - Complete execution history
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
    - Secure API access patterns
    
  3. Features
    - User credit system
    - API documentation storage
    - Token management
    - Complete request tracking
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 1000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- API Endpoints table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL DEFAULT 'POST',
  cost_per_request integer NOT NULL DEFAULT 1,
  documentation jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL,
  key_preview text NOT NULL,
  is_active boolean DEFAULT true,
  last_used timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Request History table
CREATE TABLE IF NOT EXISTS request_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  api_id uuid REFERENCES api_endpoints(id) ON DELETE CASCADE,
  api_key_id uuid REFERENCES api_keys(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  tempo text,
  width integer,
  height integer,
  url_resultado text,
  body jsonb NOT NULL DEFAULT '{}',
  response jsonb DEFAULT '{}',
  credits_cost integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- API Endpoints policies (public read)
CREATE POLICY "Anyone can read active APIs"
  ON api_endpoints
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- API Keys policies
CREATE POLICY "Users can read own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Request History policies
CREATE POLICY "Users can read own history"
  ON request_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own history"
  ON request_history
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert sample API endpoints
INSERT INTO api_endpoints (name, description, category, endpoint, method, cost_per_request, documentation) VALUES
(
  'Image Generator',
  'Generate high-quality images using AI',
  'Image',
  '/api/v1/generate-image',
  'POST',
  10,
  '{
    "parameters": [
      {"name": "prompt", "type": "string", "required": true, "description": "Description of the image to be generated"},
      {"name": "width", "type": "number", "required": false, "description": "Image width (default: 512)"},
      {"name": "height", "type": "number", "required": false, "description": "Image height (default: 512)"},
      {"name": "style", "type": "string", "required": false, "description": "Image style (realistic, artistic, cartoon)"}
    ],
    "example": {
      "request": "{\n  \"prompt\": \"An orange cat playing in the garden\",\n  \"width\": 1024,\n  \"height\": 768,\n  \"style\": \"realistic\"\n}",
      "response": "{\n  \"success\": true,\n  \"image_url\": \"https://api.example.com/images/abc123.jpg\",\n  \"width\": 1024,\n  \"height\": 768,\n  \"credits_used\": 10\n}"
    }
  }'
),
(
  'Text Analyzer',
  'Advanced sentiment analysis and text classification',
  'Text',
  '/api/v1/analyze-text',
  'POST',
  5,
  '{
    "parameters": [
      {"name": "text", "type": "string", "required": true, "description": "Text to be analyzed"},
      {"name": "language", "type": "string", "required": false, "description": "Text language (pt, en, es)"},
      {"name": "analysis_type", "type": "string", "required": false, "description": "Analysis type (sentiment, classification, both)"}
    ],
    "example": {
      "request": "{\n  \"text\": \"This product is amazing! Highly recommend.\",\n  \"language\": \"en\",\n  \"analysis_type\": \"sentiment\"\n}",
      "response": "{\n  \"success\": true,\n  \"sentiment\": \"positive\",\n  \"confidence\": 0.95,\n  \"classification\": \"review\",\n  \"credits_used\": 5\n}"
    }
  }'
),
(
  'QR Code Generator',
  'Custom QR code generator',
  'Utilities',
  '/api/v1/generate-qr',
  'POST',
  2,
  '{
    "parameters": [
      {"name": "data", "type": "string", "required": true, "description": "Data to be encoded"},
      {"name": "size", "type": "number", "required": false, "description": "QR code size (default: 256)"},
      {"name": "color", "type": "string", "required": false, "description": "Code color (hex)"},
      {"name": "background", "type": "string", "required": false, "description": "Background color (hex)"}
    ],
    "example": {
      "request": "{\n  \"data\": \"https://mysite.com\",\n  \"size\": 512,\n  \"color\": \"#000000\",\n  \"background\": \"#FFFFFF\"\n}",
      "response": "{\n  \"success\": true,\n  \"qr_url\": \"https://api.example.com/qr/def456.png\",\n  \"size\": 512,\n  \"credits_used\": 2\n}"
    }
  }'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();