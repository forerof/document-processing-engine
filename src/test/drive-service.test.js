/**
 * ============================================================================
 * DriveService Manual Tests
 * ============================================================================
 */

/**
 * Verifica que únicamente se descubran archivos PDF.
 */
function testDriveService_GetPdfFiles() {
  const pdfFiles = DriveService.getPdfFiles(TEST_CONFIG.FOLDER_ID);

  Logger.log("PDFs encontrados: %s", pdfFiles.length);

  pdfFiles.forEach(function (pdf) {
    Logger.log({
      id: pdf.id,
      name: pdf.name,
      incorporatedAt: pdf.incorporatedAt,
      sizeKb: pdf.sizeKb,
      ownerEmail: pdf.ownerEmail,
      url: pdf.url,
      pages: pdf.pages,
      pdfProcessingStatus: pdf.pdfProcessingStatus,
      pdfProcessingError: pdf.pdfProcessingError,
      sheetSyncStatus: pdf.sheetSyncStatus,
    });
  });
}
