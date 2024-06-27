import axios from 'axios';
import { API_URL } from "../config";

// Creates an axios instance with default configurations
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para agregar el token de autenticación a cada solicitud
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token de almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
