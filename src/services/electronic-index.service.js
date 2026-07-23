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

  static processPendingFiles(folderId) {
    const pendingFiles = this.getPendingFiles(folderId);

    pendingFiles.forEach(function (pdf) {
      ProcessedFilesRepository.hydrate(pdf);

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

        ProcessedFilesRepository.save(ProcessedFilesRepository.fromPdfFile(pdf));
      }
    });
  }
}
