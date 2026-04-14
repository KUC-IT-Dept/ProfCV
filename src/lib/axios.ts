import axios from 'axios';

const resolvedBaseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: resolvedBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

console.info('[API] Axios configured', {
  baseURL: resolvedBaseURL,
  envMode: import.meta.env.MODE,
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('profcv_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  console.info('[API] Request', {
    method: (config.method || 'get').toUpperCase(),
    url: `${config.baseURL || ''}${config.url || ''}`,
    hasAuthToken: Boolean(token),
  });

  return config;
});

// On 401 — clear storage and redirect to login
api.interceptors.response.use(
  (res) => {
    console.info('[API] Response', {
      method: (res.config.method || 'get').toUpperCase(),
      url: `${res.config.baseURL || ''}${res.config.url || ''}`,
      status: res.status,
    });
    return res;
  },
  (err) => {
    console.error('[API] Error response', {
      method: (err.config?.method || 'get').toUpperCase(),
      url: `${err.config?.baseURL || ''}${err.config?.url || ''}`,
      status: err.response?.status || null,
      code: err.code || null,
      message: err.message,
      data: err.response?.data || null,
    });

    if (err.response?.status === 401) {
      localStorage.removeItem('profcv_token');
      localStorage.removeItem('profcv_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
