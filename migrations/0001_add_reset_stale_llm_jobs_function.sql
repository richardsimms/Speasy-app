CREATE OR REPLACE FUNCTION reset_stale_llm_jobs()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_no_start INT;
  reset_stale INT;
BEGIN
  -- Reset jobs stuck in 'running' with no started_at (never actually started)
  UPDATE llm_jobs
  SET status = 'error',
      last_error = 'Auto-reset: stuck in running with no started_at',
      failed_at = NOW()
  WHERE status = 'running'
    AND started_at IS NULL;
  GET DIAGNOSTICS reset_no_start = ROW_COUNT;

  -- Reset jobs stuck in 'running' for over 1 hour back to 'pending' for retry
  UPDATE llm_jobs
  SET status = 'pending',
      started_at = NULL,
      attempts = COALESCE(attempts, 0) + 1
  WHERE status = 'running'
    AND started_at IS NOT NULL
    AND started_at < NOW() - INTERVAL '1 hour';
  GET DIAGNOSTICS reset_stale = ROW_COUNT;

  RETURN jsonb_build_object(
    'reset_no_start', reset_no_start,
    'reset_stale', reset_stale,
    'total', reset_no_start + reset_stale
  );
END;
$$;
