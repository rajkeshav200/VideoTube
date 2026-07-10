import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/user/login") ||
      originalRequest.url.includes("/user/register") ||
      originalRequest.url.includes("/user/refreshtoken")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/user/refreshtoken");
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;