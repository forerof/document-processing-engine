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
    /**
     * Archivo original de Google Drive.
     *
     * Se mantiene para permitir operaciones posteriores
     * (obtener Blob, MIME Type, etc.) sin volver a consultar
     * DriveApp.
     *
     * @private
     */
    this.file = file;

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

    // Último error de sincronización.
    this.sheetSyncError = null;

    // Número de fila dentro del Google Sheet.
    this.sheetRow = null;
  }

  /**
   * Obtiene el Blob del documento.
   *
   * @returns {GoogleAppsScript.Base.Blob}
   */
  getBlob() {
    return this.file.getBlob();
  }

  /**
   * Crea un PdfFile manualmente.
   *
   * Muy útil para pruebas unitarias.
   *
   * @param {Object} data
   * @returns {PdfFile}
   */
  static create(data) {
    const pdf = Object.create(PdfFile.prototype);

    pdf.file = data.file ?? null;

    pdf.id = data.id ?? null;

    pdf.name = data.name ?? null;

    pdf.incorporatedAt = data.incorporatedAt ?? null;

    pdf.pages = data.pages ?? null;

    pdf.sizeKb = data.sizeKb ?? null;

    pdf.ownerEmail = data.ownerEmail ?? null;

    pdf.url = data.url ?? null;

    pdf.pdfProcessingStatus = data.pdfProcessingStatus ?? ProcessingStatus.PENDING;

    pdf.pdfProcessingError = data.pdfProcessingError ?? null;

    pdf.sheetSyncStatus = data.sheetSyncStatus ?? SheetSyncStatus.PENDING;

    pdf.sheetSyncError = data.sheetSyncError ?? null;

    pdf.sheetRow = data.sheetRow ?? null;

    return pdf;
  }
}
