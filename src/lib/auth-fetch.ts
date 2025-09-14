import { getToken } from './auth';

export async function authFetch(input: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  
  const response = await fetch(input, { ...init, headers });
  
  // Handle 401 Unauthorized responses by redirecting to logout
  if (response.status === 401) {
    // Clear any stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    
    // Redirect to logout page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/logout';
    }
  }
  
  return response;
}


