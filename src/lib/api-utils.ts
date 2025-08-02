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
  return 'https://dashboard.htcwellness.com';
}

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  console.log('=====>>>baseUrl', baseUrl);
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
} 

export async function safeJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', {
      status: response.status,
      contentType,
      text: text.substring(0, 500)
    });
    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    const text = await response.text();
    console.error('JSON parse error:', error, 'Response text:', text);
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
} 