/**
 * Representa el estado de procesamiento de un documento PDF.
 */
class ProcessedFileRecord {
  /**
   * @param {string} fileId
   */
  constructor(fileId) {
    this.fileId = fileId;

    this.pdfProcessingStatus = ProcessingStatus.PENDING;

    this.pdfProcessingError = null;

    this.sheetSyncStatus = SheetSyncStatus.PENDING;

    this.lastUpdatedAt = null;

    this.pages = null;
  }
}
