/**
 * Servicio encargado de interactuar con Google Sheets.
 */
class GoogleSheetsService {
  /**
   * Abre un Spreadsheet.
   *
   * @param {string} spreadsheetId
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  static open(spreadsheetId) {
    if (!spreadsheetId) {
      throw new Error("INVALID_ARGUMENT: spreadsheetId is required.");
    }

    return SpreadsheetApp.openById(spreadsheetId);
  }

  /**
   * Obtiene la hoja principal.
   *
   * @param {string} spreadsheetId
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   */
  static getSheet(spreadsheetId) {
    return this.open(spreadsheetId).getSheets()[0];
  }

  /**
   * Convierte un PdfFile en una fila de Google Sheets.
   *
   * @param {PdfFile} pdf
   * @returns {Array<*>}
   */
  static toRow(pdf) {
    return [pdf.name, pdf.incorporatedAt, pdf.pages, pdf.sizeKb, pdf.ownerEmail, pdf.url];
  }

  /**
   * Agrega una fila al final de la hoja.
   *
   * @param {string} spreadsheetId
   * @param {PdfFile} pdf
   * @returns {number} Número de fila creada.
   */
  static append(spreadsheetId, pdf) {
    const sheet = this.getSheet(spreadsheetId);

    const row = this.toRow(pdf);

    sheet.appendRow(row);

    return sheet.getLastRow();
  }

  /**
   * Obtiene el encabezado oficial.
   *
   * @returns {string[]}
   */
  static getHeaders() {
    return SheetSchema.HEADERS.slice();
  }

  /**
   * Verifica si la hoja contiene el encabezado esperado.
   *
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
   * @returns {boolean}
   */
  static hasHeaders(sheet) {
    const expectedHeaders = this.getHeaders();

    const lastColumn = expectedHeaders.length;

    const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];

    if (currentHeaders.length !== expectedHeaders.length) {
      return false;
    }

    return expectedHeaders.every(function (header, index) {
      return currentHeaders[index] === header;
    });
  }

  /**
   * Inicializa la hoja con el encabezado oficial.
   *
   * Si la hoja está vacía, escribe el encabezado.
   * Si ya existe el encabezado correcto, no realiza cambios.
   * Si existe un encabezado diferente, lanza una excepción.
   *
   * @param {string} spreadsheetId
   */
  static initialize(spreadsheetId) {
    const sheet = this.getSheet(spreadsheetId);

    const headers = this.getHeaders();

    // Hoja completamente vacía.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      return;
    }

    // Encabezado correcto.
    if (this.hasHeaders(sheet)) {
      return;
    }

    // Existe contenido, pero el encabezado no coincide.
    throw new Error(
      "INVALID_SHEET_SCHEMA: The spreadsheet headers do not match the expected schema."
    );
  }
}
