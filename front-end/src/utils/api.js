import axios from "axios";

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
};

const api = axios.create({
  baseURL: getApiBaseUrl() + "/api",
});

// Response interceptor for generic error handling if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
