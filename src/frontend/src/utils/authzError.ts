/**
 * Utility to detect and normalize authorization-related errors from backend traps
 */

export interface AuthzError {
  isAuthzError: boolean;
  message: string;
  requiresLogin: boolean;
}

export function parseAuthzError(error: unknown): AuthzError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check for common authorization error patterns
  const isUnauthorized = 
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('Only users can') ||
    errorMessage.includes('Only admins can') ||
    errorMessage.includes('not authorized') ||
    errorMessage.includes('permission denied');
  
  const requiresLogin = 
    errorMessage.includes('Only users can') ||
    errorMessage.includes('login required') ||
    errorMessage.includes('authentication required');
  
  return {
    isAuthzError: isUnauthorized,
    message: isUnauthorized 
      ? (requiresLogin 
          ? 'Please log in to perform this action' 
          : 'You do not have permission to perform this action')
      : errorMessage,
    requiresLogin
  };
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  const authzError = parseAuthzError(error);
  
  if (authzError.isAuthzError) {
    return authzError.message;
  }
  
  // Generic error message for non-authorization errors
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('Actor not available')) {
    return 'Connection to backend is not ready. Please try again.';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}
