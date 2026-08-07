import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "../../ui/utils/HelperConfigs";

const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl(),
});

// Interceptor de petición
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth-jbearer-token");

    // Verificamos que existan los headers para evitar errores de TS
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
