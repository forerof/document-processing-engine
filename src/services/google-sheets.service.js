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
    return [pdf.name, pdf.createdTime, pdf.pages, pdf.sizeKb, pdf.owner, pdf.url];
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
}
