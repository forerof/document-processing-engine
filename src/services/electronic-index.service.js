/**
 * Servicio encargado de orquestar el flujo del
 * Electronic Index Project.
 */
class ElectronicIndexService {
  /**
   * Obtiene únicamente los documentos pendientes
   * de procesamiento.
   *
   * @param {string} folderId
   * @returns {PdfFile[]}
   */
  static getPendingFiles(folderId) {
    const pdfFiles = DriveService.getPdfFiles(folderId);

    return pdfFiles.filter(function (pdf) {
      const record = ProcessedFilesRepository.find(pdf.id);

      /*
       * Nunca ha sido procesado.
       */
      if (!record) {
        return true;
      }

      /*
       * Cloud Run falló.
       */
      if (record.pdfProcessingStatus === ProcessingStatus.FAILED) {
        return true;
      }

      /*
       * Sheets falló.
       */
      if (record.sheetSyncStatus === SheetSyncStatus.FAILED) {
        return true;
      }

      /*
       * Todo terminó correctamente.
       */
      return false;
    });
  }
}
