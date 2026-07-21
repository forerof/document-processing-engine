/**
 * Valida la configuración requerida del proyecto.
 */
function validateConfiguration() {
  if (!CONFIG.CLOUD_RUN.API_KEY) {
    throw new Error("Missing Script Property: API_KEY");
  }
}
