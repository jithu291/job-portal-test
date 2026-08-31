import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { store } from '../app/store';
import { logoutUser, setTokens } from '../features/auth/authSlice';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL });

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

function processQueue(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config;
    if (!original || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const { refreshToken } = store.getState().auth;
    if (!refreshToken) {
      store.dispatch(logoutUser());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
      store.dispatch(setTokens(data));
      processQueue(data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch {
      store.dispatch(logoutUser());
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
