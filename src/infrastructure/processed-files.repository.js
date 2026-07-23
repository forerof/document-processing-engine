/**
 * Repositorio encargado de almacenar el estado de procesamiento
 * de los documentos PDF.
 */
class ProcessedFilesRepository {
  /**
   * Clave utilizada en Script Properties.
   * @private
   */
  static getStorageKey() {
    return "processedFiles";
  }

  /**
   * Devuelve todos los registros.
   *
   * @returns {Object<string, ProcessedFileRecord>}
   */
  static getAll() {
    const properties = PropertiesService.getScriptProperties();

    const json = properties.getProperty(this.getStorageKey());

    if (!json) {
      return {};
    }

    return JSON.parse(json);
  }

  /**
   * Busca un registro por File ID.
   *
   * @param {string} fileId
   * @returns {ProcessedFileRecord|null}
   */
  static find(fileId) {
    const records = this.getAll();

    return records[fileId] || null;
  }

  /**
   * Guarda o reemplaza un registro.
   *
   * @param {ProcessedFileRecord} record
   */
  static save(record) {
    if (!record || !record.fileId) {
      throw new Error("INVALID_ARGUMENT: record.fileId is required.");
    }

    const records = this.getAll();

    record.lastUpdatedAt = new Date().toISOString();

    records[record.fileId] = record;

    this.persist(records);
  }

  /**
   * Elimina un registro.
   *
   * @param {string} fileId
   */
  static remove(fileId) {
    const records = this.getAll();

    delete records[fileId];

    this.persist(records);
  }

  /**
   * Borra todos los registros.
   */
  static clear() {
    PropertiesService.getScriptProperties().deleteProperty(this.getStorageKey());
  }

  /**
   * Número total de registros.
   *
   * @returns {number}
   */
  static count() {
    return Object.keys(this.getAll()).length;
  }

  /**
   * Persiste el estado.
   *
   * @private
   *
   * @param {Object} records
   */
  static persist(records) {
    PropertiesService.getScriptProperties().setProperty(
      this.getStorageKey(),
      JSON.stringify(records)
    );
  }

  /**
   * Construye un registro persistente a partir de un PdfFile.
   *
   * @param {PdfFile} pdf
   * @returns {ProcessedFileRecord}
   */
  static fromPdfFile(pdf) {
    const record = new ProcessedFileRecord(pdf.id);

    record.pages = pdf.pages;

    record.pdfProcessingStatus = pdf.pdfProcessingStatus;

    record.pdfProcessingError = pdf.pdfProcessingError;

    record.sheetSyncStatus = pdf.sheetSyncStatus;

    return record;
  }

  /**
   * Hidrata un PdfFile con la información persistida.
   *
   * @param {PdfFile} pdf
   * @returns {PdfFile}
   */
  static hydrate(pdf) {
    const record = this.find(pdf.id);

    if (!record) {
      return pdf;
    }

    pdf.pages = record.pages;

    pdf.pdfProcessingStatus = record.pdfProcessingStatus;

    pdf.pdfProcessingError = record.pdfProcessingError;

    pdf.sheetSyncStatus = record.sheetSyncStatus;

    return pdf;
  }
}
