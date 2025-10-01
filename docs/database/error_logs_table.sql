-- Create error_logs table for logging application errors
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL CHECK (error_type IN ('javascript', 'network', 'authentication', 'payment', 'api', 'render', 'unknown')),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  component_name TEXT,
  url TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  is_critical BOOLEAN DEFAULT false,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_is_critical ON error_logs(is_critical);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_error_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_error_logs_updated_at
  BEFORE UPDATE ON error_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_error_logs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy: Users can view their own error logs
CREATE POLICY "Users can view their own error logs"
  ON error_logs FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Anyone can insert error logs (for anonymous error reporting)
CREATE POLICY "Anyone can insert error logs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own error logs (for marking as resolved)
CREATE POLICY "Users can update their own error logs"
  ON error_logs FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role can manage all error logs"
  ON error_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Optional: Create a view for error statistics
CREATE OR REPLACE VIEW error_stats AS
SELECT
  error_type,
  COUNT(*) as total_errors,
  COUNT(*) FILTER (WHERE is_critical = true) as critical_errors,
  COUNT(*) FILTER (WHERE resolved = false) as unresolved_errors,
  COUNT(DISTINCT user_id) as affected_users,
  MIN(created_at) as first_occurrence,
  MAX(created_at) as last_occurrence
FROM error_logs
GROUP BY error_type
ORDER BY total_errors DESC;

-- Grant permissions
GRANT SELECT ON error_stats TO authenticated, anon;

-- Optional: Create function to clean up old error logs (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM error_logs
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND resolved = true;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create function to get recent errors for a specific user
CREATE OR REPLACE FUNCTION get_user_recent_errors(
  target_user_id UUID DEFAULT auth.uid(),
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  error_type TEXT,
  error_message TEXT,
  component_name TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  is_critical BOOLEAN,
  resolved BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.error_type,
    e.error_message,
    e.component_name,
    e.timestamp,
    e.is_critical,
    e.resolved
  FROM error_logs e
  WHERE e.user_id = target_user_id
  ORDER BY e.timestamp DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_recent_errors TO authenticated;

COMMENT ON TABLE error_logs IS 'Stores application error logs for debugging and monitoring';
COMMENT ON COLUMN error_logs.error_type IS 'Type of error: javascript, network, authentication, payment, api, render, unknown';
COMMENT ON COLUMN error_logs.metadata IS 'Additional context data stored as JSON';
COMMENT ON COLUMN error_logs.is_critical IS 'Whether this error significantly impacts user experience';
COMMENT ON COLUMN error_logs.resolved IS 'Whether this error has been acknowledged/fixed';