/*
  # Add video status system with 48h expiration

  1. New Columns
    - `video_status` in request_history table
      - Values: 'available', 'unavailable', 'processing'
      - Default: 'available'
    
  2. Functions
    - `update_expired_videos()` - Marks videos as unavailable after 48h
    - `check_video_availability()` - Helper function to check if video is still available
    
  3. Scheduled Job
    - Automatic function to run periodically and update expired videos
    
  4. Indexes
    - Add index on created_at for better performance on expiration queries
*/

-- Add video_status column to request_history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'request_history' AND column_name = 'video_status'
  ) THEN
    ALTER TABLE request_history ADD COLUMN video_status text DEFAULT 'available' CHECK (video_status IN ('available', 'unavailable', 'processing'));
  END IF;
END $$;

-- Add index on created_at for better performance on expiration queries
CREATE INDEX IF NOT EXISTS idx_request_history_created_at ON request_history(created_at);
CREATE INDEX IF NOT EXISTS idx_request_history_video_status ON request_history(video_status);

-- Function to update expired videos (videos older than 48 hours)
CREATE OR REPLACE FUNCTION update_expired_videos()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update videos that are older than 48 hours and still marked as available
  UPDATE request_history 
  SET video_status = 'unavailable'
  WHERE video_status = 'available'
    AND url_resultado IS NOT NULL
    AND created_at < NOW() - INTERVAL '48 hours';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a specific video is still available
CREATE OR REPLACE FUNCTION check_video_availability(video_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  SELECT 
    CASE 
      WHEN video_status = 'available' AND created_at >= NOW() - INTERVAL '48 hours' THEN TRUE
      ELSE FALSE
    END INTO is_available
  FROM request_history 
  WHERE id = video_id;
  
  -- If video is found to be expired, update its status
  IF is_available = FALSE THEN
    UPDATE request_history 
    SET video_status = 'unavailable'
    WHERE id = video_id AND video_status = 'available';
  END IF;
  
  RETURN COALESCE(is_available, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get video with availability check
CREATE OR REPLACE FUNCTION get_video_with_status(video_id UUID)
RETURNS TABLE(
  id UUID,
  url_resultado TEXT,
  video_status TEXT,
  is_expired BOOLEAN,
  hours_remaining NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rh.id,
    rh.url_resultado,
    CASE 
      WHEN rh.created_at < NOW() - INTERVAL '48 hours' THEN 'unavailable'
      ELSE rh.video_status
    END as video_status,
    rh.created_at < NOW() - INTERVAL '48 hours' as is_expired,
    GREATEST(0, EXTRACT(EPOCH FROM (rh.created_at + INTERVAL '48 hours' - NOW())) / 3600) as hours_remaining
  FROM request_history rh
  WHERE rh.id = video_id;
  
  -- Update status if expired
  UPDATE request_history 
  SET video_status = 'unavailable'
  WHERE request_history.id = video_id 
    AND video_status = 'available' 
    AND created_at < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set initial status for existing records
UPDATE request_history 
SET video_status = CASE 
  WHEN url_resultado IS NOT NULL AND created_at >= NOW() - INTERVAL '48 hours' THEN 'available'
  WHEN url_resultado IS NOT NULL AND created_at < NOW() - INTERVAL '48 hours' THEN 'unavailable'
  ELSE 'processing'
END
WHERE video_status IS NULL;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_expired_videos() TO authenticated;
GRANT EXECUTE ON FUNCTION check_video_availability(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_video_with_status(UUID) TO authenticated;