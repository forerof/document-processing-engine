/**
 * Repositorio encargado de almacenar el estado de procesamiento
 * de los documentos PDF.
 */
class ProcessedFilesRepository {
  /**
   * Clave utilizada en Script Properties.
   * @private
   */
  static STORAGE_KEY = "processedFiles";

  /**
   * Devuelve todos los registros.
   *
   * @returns {Object<string, ProcessedFileRecord>}
   */
  static getAll() {
    const properties = PropertiesService.getScriptProperties();

    const json = properties.getProperty(this.STORAGE_KEY);

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

    record.processedAt = new Date().toISOString();

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
    PropertiesService.getScriptProperties().deleteProperty(this.STORAGE_KEY);
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
    PropertiesService.getScriptProperties().setProperty(this.STORAGE_KEY, JSON.stringify(records));
  }
}
