/**
 * Servicio para consultar documentos PDF almacenados en Google Drive.
 */
class DriveService {
  /**
   * Obtiene todos los documentos PDF contenidos
   * en una carpeta de Google Drive.
   *
   * @param {string} folderId
   * @returns {PdfFile[]}
   */
  static getPdfFiles(folderId) {
    if (!folderId) {
      throw new Error("INVALID_ARGUMENT: folderId is required.");
    }

    const folder = DriveApp.getFolderById(folderId);

    const files = folder.getFiles();

    const pdfFiles = [];

    while (files.hasNext()) {
      const file = files.next();

      if (file.getMimeType() !== MimeType.PDF) {
        continue;
      }

      pdfFiles.push(new PdfFile(file));
    }

    return pdfFiles;
  }
}
