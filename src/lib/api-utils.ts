// Utility function to get the API base URL for server-side requests
export function getApiBaseUrl(): string {
  // Prefer explicit Nest backend base for server-side requests
  if (process.env.BACKEND_API_BASE) {
    return process.env.BACKEND_API_BASE;
  }

  // Fall back to Next server base (will rely on rewrites)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "";
}

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  console.log("=====>>>baseUrl", baseUrl);
  
  // If no base URL is available, return the endpoint as-is (relative URL)
  if (!baseUrl) {
    return endpoint;
  }
  
  const normalizedEndpoint = baseUrl && process.env.BACKEND_API_BASE
    ? endpoint.replace(/^\/api/, "")
    : (endpoint.startsWith("/") ? endpoint : `/${endpoint}`);
  return `${baseUrl}${normalizedEndpoint}`;
}
