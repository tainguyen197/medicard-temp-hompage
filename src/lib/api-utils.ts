// Utility function to get the API base URL for server-side requests
export function getApiBaseUrl(): string {
  // In production, use the environment variable or the current host
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // In development, fallback to localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Fallback for other environments
  return 'http://localhost:3000';
}

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
} 