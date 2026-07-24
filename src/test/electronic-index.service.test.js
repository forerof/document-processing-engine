/**
 * ============================================================================
 * ElectronicIndexService Manual Tests
 * ============================================================================
 */

/**
 * Lista únicamente los documentos pendientes.
 */
function testElectronicIndexService_GetPendingFiles() {
  const pendingFiles = ElectronicIndexService.getPendingFiles(TEST_CONFIG.FOLDER_ID);

  Logger.log("=======================================");
  Logger.log("Pendientes: %s", pendingFiles.length);
  Logger.log("=======================================");

  pendingFiles.forEach(function (pdf) {
    Logger.log({
      id: pdf.id,
      name: pdf.name,
      pages: pdf.pages,
      pdfProcessingStatus: pdf.pdfProcessingStatus,
      sheetSyncStatus: pdf.sheetSyncStatus,
    });
  });
}

/**
 * Ejecuta la primera etapa completa del pipeline.
 *
 * Drive
 *   ↓
 * PendingFiles
 *   ↓
 * Cloud Run
 *   ↓
 * pages
 *   ↓
 * ProcessedFilesRepository
 */
function testElectronicIndexService_ProcessPendingFiles() {
  Logger.log("=======================================");
  Logger.log("Procesando documentos...");
  Logger.log("=======================================");

  ElectronicIndexService.processPendingFiles(TEST_CONFIG.FOLDER_ID, TEST_CONFIG.SPREADSHEET_ID);

  Logger.log("=======================================");
  Logger.log("Proceso finalizado.");
  Logger.log("=======================================");
}

/**
 * Muestra el contenido actual del repositorio.
 */
function testProcessedFilesRepository_ShowAll() {
  const records = ProcessedFilesRepository.getAll();

  Logger.log(JSON.stringify(records, null, 2));
}

/**
 * Reinicia completamente el repositorio.
 */
function testProcessedFilesRepository_Clear() {
  ProcessedFilesRepository.clear();

  Logger.log("Repositorio limpiado.");
}
