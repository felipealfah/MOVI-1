/*
  # Create APIs table with pricing and status

  1. New Tables
    - `apis`
      - `id` (uuid, primary key)
      - `name` (text, API name)
      - `description` (text, API description)
      - `category` (text, API category)
      - `endpoint` (text, API endpoint path)
      - `method` (text, HTTP method)
      - `price_per_second` (decimal, pricing per second)
      - `status` (text, API status - active/inactive/maintenance)
      - `documentation` (jsonb, API documentation)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `apis` table
    - Add policy for authenticated users to read active APIs

  3. Sample Data
    - Insert sample APIs with real pricing structure
*/

CREATE TABLE IF NOT EXISTS apis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL DEFAULT 'POST',
  price_per_second decimal(10,4) NOT NULL DEFAULT 0.0001,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  documentation jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE apis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active APIs"
  ON apis
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_apis_updated_at'
  ) THEN
    CREATE TRIGGER update_apis_updated_at
      BEFORE UPDATE ON apis
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample APIs
INSERT INTO apis (name, description, category, endpoint, method, price_per_second, status, documentation) VALUES
(
  'Image Generator',
  'Generate high-quality images using AI',
  'Image',
  '/api/v1/generate-image',
  'POST',
  0.0050,
  'active',
  '{
    "parameters": [
      {"name": "prompt", "type": "string", "required": true, "description": "Description of the image to be generated"},
      {"name": "width", "type": "number", "required": false, "description": "Image width (default: 512)"},
      {"name": "height", "type": "number", "required": false, "description": "Image height (default: 512)"},
      {"name": "style", "type": "string", "required": false, "description": "Image style (realistic, artistic, cartoon)"}
    ],
    "example": {
      "request": "{\n  \"prompt\": \"An orange cat playing in the garden\",\n  \"width\": 1024,\n  \"height\": 768,\n  \"style\": \"realistic\"\n}",
      "response": "{\n  \"success\": true,\n  \"image_url\": \"https://api.example.com/images/abc123.jpg\",\n  \"width\": 1024,\n  \"height\": 768,\n  \"processing_time\": 2.5\n}"
    }
  }'
),
(
  'Text Analyzer',
  'Advanced sentiment analysis and text classification',
  'Text',
  '/api/v1/analyze-text',
  'POST',
  0.0020,
  'active',
  '{
    "parameters": [
      {"name": "text", "type": "string", "required": true, "description": "Text to be analyzed"},
      {"name": "language", "type": "string", "required": false, "description": "Text language (pt, en, es)"},
      {"name": "analysis_type", "type": "string", "required": false, "description": "Analysis type (sentiment, classification, both)"}
    ],
    "example": {
      "request": "{\n  \"text\": \"This product is amazing! Highly recommend.\",\n  \"language\": \"en\",\n  \"analysis_type\": \"sentiment\"\n}",
      "response": "{\n  \"success\": true,\n  \"sentiment\": \"positive\",\n  \"confidence\": 0.95,\n  \"classification\": \"review\",\n  \"processing_time\": 0.8\n}"
    }
  }'
),
(
  'QR Code Generator',
  'Custom QR code generator with styling options',
  'Utilities',
  '/api/v1/generate-qr',
  'POST',
  0.0010,
  'active',
  '{
    "parameters": [
      {"name": "data", "type": "string", "required": true, "description": "Data to be encoded"},
      {"name": "size", "type": "number", "required": false, "description": "QR code size (default: 256)"},
      {"name": "color", "type": "string", "required": false, "description": "Code color (hex)"},
      {"name": "background", "type": "string", "required": false, "description": "Background color (hex)"}
    ],
    "example": {
      "request": "{\n  \"data\": \"https://mysite.com\",\n  \"size\": 512,\n  \"color\": \"#000000\",\n  \"background\": \"#FFFFFF\"\n}",
      "response": "{\n  \"success\": true,\n  \"qr_url\": \"https://api.example.com/qr/def456.png\",\n  \"size\": 512,\n  \"processing_time\": 0.3\n}"
    }
  }'
),
(
  'Voice Synthesis',
  'Convert text to natural-sounding speech',
  'Audio',
  '/api/v1/text-to-speech',
  'POST',
  0.0080,
  'active',
  '{
    "parameters": [
      {"name": "text", "type": "string", "required": true, "description": "Text to convert to speech"},
      {"name": "voice", "type": "string", "required": false, "description": "Voice type (male, female, child)"},
      {"name": "language", "type": "string", "required": false, "description": "Language code (pt-BR, en-US, es-ES)"},
      {"name": "speed", "type": "number", "required": false, "description": "Speech speed (0.5 to 2.0)"}
    ],
    "example": {
      "request": "{\n  \"text\": \"Hello, this is a test message\",\n  \"voice\": \"female\",\n  \"language\": \"en-US\",\n  \"speed\": 1.0\n}",
      "response": "{\n  \"success\": true,\n  \"audio_url\": \"https://api.example.com/audio/xyz789.mp3\",\n  \"duration\": 3.2,\n  \"processing_time\": 1.8\n}"
    }
  }'
),
(
  'Document Parser',
  'Extract text and data from PDF and image documents',
  'Document',
  '/api/v1/parse-document',
  'POST',
  0.0030,
  'maintenance',
  '{
    "parameters": [
      {"name": "file_url", "type": "string", "required": true, "description": "URL of the document to parse"},
      {"name": "extract_tables", "type": "boolean", "required": false, "description": "Extract tables from document"},
      {"name": "extract_images", "type": "boolean", "required": false, "description": "Extract images from document"},
      {"name": "language", "type": "string", "required": false, "description": "Document language for OCR"}
    ],
    "example": {
      "request": "{\n  \"file_url\": \"https://example.com/document.pdf\",\n  \"extract_tables\": true,\n  \"extract_images\": false,\n  \"language\": \"en\"\n}",
      "response": "{\n  \"success\": true,\n  \"text\": \"Extracted document text...\",\n  \"tables\": [],\n  \"processing_time\": 4.2\n}"
    }
  }'
);