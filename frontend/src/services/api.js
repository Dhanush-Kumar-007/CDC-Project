import axios from 'axios';

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const fallbackApiBaseUrl = isLocalhost
  ? 'http://localhost:5000/api'
  : 'https://cdc-project-q4yr.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl,
});

// Attach the JWT to every outgoing request, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cdc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401 (expired/invalid token), clear stored auth and send the user
// back to the appropriate login page rather than leaving them stuck on a
// broken screen. AuthContext also listens for this via the custom event.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('cdc:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
