// API Service Layer (Backend Integration)

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change later for production
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
