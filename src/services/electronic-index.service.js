/**
 * Servicio encargado de orquestar el flujo del
 * Electronic Index Project.
 */
class ElectronicIndexService {
  /**
   * Obtiene únicamente los documentos que aún requieren
   * alguna etapa del pipeline.
   *
   * @param {string} folderId
   * @returns {PdfFile[]}
   */
  static getPendingFiles(folderId) {
    const pdfFiles = DriveService.getPdfFiles(folderId);

    return pdfFiles
      .map(function (pdf) {
        return ProcessedFilesRepository.hydrate(pdf);
      })
      .filter(function (pdf) {
        /*
         * Nunca se obtuvo el número de páginas.
         */
        if (pdf.pages === null) {
          return true;
        }

        /*
         * Falta sincronizar con Google Sheets.
         */
        if (pdf.sheetSyncStatus !== SheetSyncStatus.SUCCESS) {
          return true;
        }

        /*
         * Documento completamente procesado.
         */
        return false;
      });
  }

  /**
   * Procesa los documentos pendientes.
   *
   * @param {string} folderId
   * @param {string} spreadsheetId
   */
  static processPendingFiles(folderId, spreadsheetId) {
    GoogleSheetsService.initialize(spreadsheetId);

    const pendingFiles = this.getPendingFiles(folderId);

    pendingFiles.forEach(function (pdf) {
      // =====================================================
      // Etapa 1 · Cloud Run
      // =====================================================

      if (pdf.pages === null) {
        pdf.pdfProcessingStatus = ProcessingStatus.PROCESSING;

        try {
          const response = CloudRunClient.getPdfInfo(pdf);

          pdf.pages = response.pages;

          pdf.pdfProcessingStatus = ProcessingStatus.SUCCESS;

          pdf.pdfProcessingError = null;
        } catch (error) {
          pdf.pdfProcessingStatus = ProcessingStatus.FAILED;

          pdf.pdfProcessingError = error.message;
        }

        /*
         * Persistir inmediatamente el estado luego
         * del procesamiento en Cloud Run.
         */
        ProcessedFilesRepository.save(ProcessedFilesRepository.fromPdfFile(pdf));
      }

      // =====================================================
      // Etapa 2 · Google Sheets
      // =====================================================

      if (
        pdf.pages !== null &&
        pdf.sheetRow === null &&
        pdf.sheetSyncStatus !== SheetSyncStatus.SUCCESS
      ) {
        pdf.sheetSyncStatus = SheetSyncStatus.PROCESSING;

        try {
          const sheetRow = GoogleSheetsService.append(spreadsheetId, pdf);

          pdf.sheetRow = sheetRow;

          pdf.sheetSyncStatus = SheetSyncStatus.SUCCESS;

          pdf.sheetSyncError = null;
        } catch (error) {
          pdf.sheetSyncStatus = SheetSyncStatus.FAILED;

          pdf.sheetSyncError = error.message;
        }

        /*
         * Persistir inmediatamente el resultado
         * de la sincronización con Google Sheets.
         */
        ProcessedFilesRepository.save(ProcessedFilesRepository.fromPdfFile(pdf));
      }
    });
  }
}
