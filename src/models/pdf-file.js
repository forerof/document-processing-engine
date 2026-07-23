/**
 * Representa un documento PDF detectado en Google Drive.
 *
 * Este modelo constituye el objeto de dominio principal del
 * Electronic Index Project.
 */
class PdfFile {
  /**
   * @param {GoogleAppsScript.Drive.File} file
   */
  constructor(file) {
    this.id = file.getId();

    this.name = file.getName();

    // Fecha de incorporación al expediente.
    this.incorporatedAt = file.getDateCreated();

    // Tamaño expresado en kB.
    this.sizeKb = Math.ceil(file.getSize() / 1024);

    // Puede devolver null dependiendo de los permisos.
    const owner = file.getOwner();

    this.ownerEmail = owner ? owner.getEmail() : null;

    this.url = file.getUrl();

    // Se obtendrá posteriormente desde Cloud Run.
    this.pages = null;

    // Estado del procesamiento en Cloud Run.
    this.pdfProcessingStatus = ProcessingStatus.PENDING;

    // Último error de Cloud Run.
    this.pdfProcessingError = null;

    // Estado de sincronización con Google Sheets.
    this.sheetSyncStatus = SheetSyncStatus.PENDING;
  }
}
