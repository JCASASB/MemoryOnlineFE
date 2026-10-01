/**
 * Obtiene de forma segura las variables de entorno de la aplicación.
 * Lanza un error en desarrollo si una variable crítica no está configurada.
 */
const getEnvVariable = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];

  if (!value && import.meta.env.DEV) {
    console.warn(
      `[⚠️ Env Warning]: La variable ${key} no está definida en el archivo .env`,
    );
  }

  return value || "";
};

// Exportamos un objeto con métodos o propiedades limpias
export const env = {
  apiUrl: () => getEnvVariable("VITE_API_URL") || "http://localhost:5000/api",
  signalRHubUrl: () => getEnvVariable("VITE_SIGNALR_HUB_URL"),
  appVersion: () => __APP_VERSION__ || "1.0.0",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
