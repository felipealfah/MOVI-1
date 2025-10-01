import { useEffect } from 'react';
import { logJavaScriptError, logNetworkError } from '../lib/supabase';

export const useErrorHandler = () => {
  useEffect(() => {
    // Global error handler for unhandled JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);

      logJavaScriptError(
        event.error || new Error(event.message),
        'GlobalErrorHandler',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'unhandled_error',
        }
      );
    };

    // Global handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);

      // Try to extract meaningful error information
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(typeof event.reason === 'string' ? event.reason : 'Unhandled promise rejection');

      logJavaScriptError(
        error,
        'GlobalPromiseHandler',
        {
          type: 'unhandled_promise_rejection',
          reason: event.reason,
        }
      );

      // Prevent the default browser behavior (logging to console)
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Return helper functions for manual error logging
  return {
    logError: logJavaScriptError,
    logNetworkError,
  };
};

export default useErrorHandler;