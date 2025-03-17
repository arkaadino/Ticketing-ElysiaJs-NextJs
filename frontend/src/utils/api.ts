// utils/api.ts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const fetchWithRefresh = async (url: string, options: RequestInit) => {
  try {
    // First attempt with current token
    const response = await fetch(url, options);
    
    // If unauthorized, try to refresh the token
    if ((response.status === 401 || response.status === 403) && !url.includes('/auth/refresh')) {
      console.log(`Unauthorized request to ${url}, attempting token refresh...`);
      
      // Use a shared promise if a refresh is already in progress
      if (isRefreshing) {
        console.log('Refresh already in progress, waiting...');
        const refreshResult = await refreshPromise;
        if (!refreshResult) {
          console.log('Previous refresh failed');
          throw new Error('Authentication failed');
        }
      } else {
        isRefreshing = true;
        refreshPromise = refreshToken();
        const refreshResult = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;
        
        if (!refreshResult) {
          console.log('Token refresh failed');
          throw new Error('Authentication failed');
        }
      }
      
      // Retry the original request
      console.log(`Retrying original request to ${url}`);
      return fetch(url, options);
    }
    
    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

// Separate refresh function
const refreshToken = async (): Promise<boolean> => {
  try {
    console.log('Attempting to refresh token...');
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    if (!refreshResponse.ok) {
      console.log(`Refresh failed with status: ${refreshResponse.status}`);
      const errorData = await refreshResponse.text();
      console.log(`Error response: ${errorData}`);
      
      // Only redirect on certain conditions to avoid loops
      if (refreshResponse.status === 401 || refreshResponse.status === 403) {
        console.log('Token expired, redirecting to signin');
        
        // Add delay to avoid rapid redirects
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1000);
      }
      
      return false;
    }
    
    console.log('Token refreshed successfully');
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};