/**
 * Configuración global del proyecto.
 */
const CONFIG = {
  CLOUD_RUN: {
    BASE_URL: "https://electronic-index-pdf-service-878161498117.us-central1.run.app",
    API_KEY: PropertiesService.getScriptProperties().getProperty("API_KEY"),
    TIMEOUT_MS: 30000,
  },
};
