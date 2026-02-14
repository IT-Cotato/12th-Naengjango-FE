import axios from 'axios';

const TOKEN_KEY = 'accessToken';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex) https://.../api
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log('[API]', config.method?.toUpperCase(), config.url);
  }

  return config;
});
