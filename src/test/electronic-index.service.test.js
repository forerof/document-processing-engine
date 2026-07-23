/**
 * ============================================================================
 * ElectronicIndexService Manual Tests
 * ============================================================================
 *
 * Estas pruebas verifican el comportamiento del servicio encargado de
 * orquestar el flujo del Electronic Index Project.
 *
 * Requisitos:
 *  - Configuración inicial ejecutada.
 *  - TEST_FOLDER_ID configurado.
 *  - Cloud Run desplegado (para pruebas futuras).
 * ============================================================================
 */

/**
 * Carpeta utilizada para las pruebas.
 */
const TEST_FOLDER_ID = "REEMPLAZAR_FOLDER_ID";

/**
 * Verifica que únicamente se devuelvan los documentos pendientes.
 *
 * Casos esperados:
 *  - Documentos nunca procesados.
 *  - Documentos cuyo procesamiento PDF falló.
 *  - Documentos cuya sincronización con Sheets falló.
 */
function testElectronicIndexService_GetPendingFiles() {
  const pendingFiles = ElectronicIndexService.getPendingFiles(TEST_FOLDER_ID);

  Logger.log("==========================================");
  Logger.log("Documentos pendientes: %s", pendingFiles.length);
  Logger.log("==========================================");

  pendingFiles.forEach(function (pdf) {
    Logger.log({
      id: pdf.id,
      name: pdf.name,
      pdfProcessingStatus: pdf.pdfProcessingStatus,
      sheetSyncStatus: pdf.sheetSyncStatus,
    });
  });
}
