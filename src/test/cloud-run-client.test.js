/**
 * ============================================================================
 * CloudRunClient Manual Tests
 * ============================================================================
 *
 * Estas pruebas deben ejecutarse manualmente desde el editor de Apps Script.
 * Cada función prueba un escenario específico del cliente HTTP.
 *
 * Requisitos:
 *  - Script Property API_KEY configurada.
 *  - Cloud Run desplegado.
 *  - PDF de prueba disponible en Google Drive.
 * ============================================================================
 */

/**
 * Caso exitoso.
 *
 * Esperado:
 * {
 *   pages: N
 * }
 */
function testCloudRunClient() {
  validateConfiguration();

  const blob = DriveApp.getFileById(TEST_CONFIG.FILE_ID).getBlob();

  const result = CloudRunClient.getPdfInfo(blob);

  Logger.log(result);
}

/**
 * API Key inválida.
 *
 * Esperado:
 * AUTHENTICATION_ERROR
 */
function testCloudRunClient_InvalidApiKey() {
  const original = CONFIG.CLOUD_RUN.API_KEY;

  CONFIG.CLOUD_RUN.API_KEY = "INVALID_KEY";

  try {
    const blob = DriveApp.getFileById(TEST_CONFIG.FILE_ID).getBlob();

    CloudRunClient.getPdfInfo(blob);
  } catch (error) {
    Logger.log(error.message);
  } finally {
    CONFIG.CLOUD_RUN.API_KEY = original;
  }
}

/**
 * Blob inválido.
 *
 * Esperado:
 * INVALID_PDF
 */
function testCloudRunClient_InvalidBlob() {
  const blob = Utilities.newBlob("Esto no es un PDF", "application/pdf");

  try {
    CloudRunClient.getPdfInfo(blob);
  } catch (error) {
    Logger.log(error.message);
  }
}

/**
 * Blob nulo.
 *
 * Esperado:
 * INVALID_ARGUMENT
 */
function testCloudRunClient_NullBlob() {
  try {
    CloudRunClient.getPdfInfo(null);
  } catch (error) {
    Logger.log(error.message);
  }
}
