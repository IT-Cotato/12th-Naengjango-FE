import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: https://15.134.213.116.nip.io/api
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  // ✅ 디버그: 실제로 붙는지 확인
  // console.log('[API REQ]', config.method, config.url, !!token);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ 디버깅: 요청 나갈 때 한 번 찍어보기
  console.log('[API]', config.method?.toUpperCase(), config.baseURL, config.url, {
    hasToken: !!token,
    auth: config.headers.Authorization,
  });

  return config;
});
