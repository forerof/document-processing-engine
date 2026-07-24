/**
 * ============================================================================
 * GoogleSheetsService Manual Tests
 * ============================================================================
 */

/**
 * Prueba que el Spreadsheet puede abrirse correctamente.
 */
function testGoogleSheetsService_Open() {
  const spreadsheet = GoogleSheetsService.open(TEST_CONFIG.SPREADSHEET_ID);

  Logger.log("Spreadsheet:");
  Logger.log("ID: %s", spreadsheet.getId());
  Logger.log("Name: %s", spreadsheet.getName());
}

/**
 * Prueba que puede obtenerse la hoja principal.
 */
function testGoogleSheetsService_GetSheet() {
  const sheet = GoogleSheetsService.getSheet(TEST_CONFIG.SPREADSHEET_ID);

  Logger.log("Sheet:");
  Logger.log("Name: %s", sheet.getName());
}

/**
 * Verifica la conversión de PdfFile -> Array.
 */
function testGoogleSheetsService_ToRow() {
  const pdf = PdfFile.create({
    id: "123",

    name: "Contrato.pdf",

    createdTime: new Date(),

    pages: 18,

    sizeKb: 254,

    owner: "smith@unal.edu.co",

    url: "https://drive.google.com/file/d/123/view",
  });

  const row = GoogleSheetsService.toRow(pdf);

  Logger.log(JSON.stringify(row, null, 2));
}

/**
 * Inserta una fila de prueba.
 *
 * IMPORTANTE:
 * Ejecutar únicamente sobre un Spreadsheet de pruebas.
 */
/**
 * Inserta una fila respetando el contrato del índice.
 */
function testGoogleSheetsService_Append() {
  GoogleSheetsService.initialize(TEST_CONFIG.SPREADSHEET_ID);

  const pdf = PdfFile.create({
    id: "1",

    name: "Contrato.pdf",

    createdTime: new Date(),

    pages: 18,

    sizeKb: 254,

    owner: "smith@unal.edu.co",

    url: "https://drive.google.com/file/d/123/view",
  });

  const row = GoogleSheetsService.append(TEST_CONFIG.SPREADSHEET_ID, pdf);

  Logger.log("Fila creada: %s", row);
}

/**
 * Verifica el encabezado oficial del índice electrónico.
 */
function testGoogleSheetsService_GetHeaders() {
  const headers = GoogleSheetsService.getHeaders();

  Logger.log(JSON.stringify(headers, null, 2));
}

/**
 * Inicializa la hoja con el encabezado oficial.
 *
 * Ejecutar únicamente sobre un Spreadsheet de pruebas.
 */
function testGoogleSheetsService_Initialize() {
  GoogleSheetsService.initialize(TEST_CONFIG.SPREADSHEET_ID);

  Logger.log("Hoja inicializada correctamente.");
}

/**
 * Comprueba que la hoja contiene el encabezado esperado.
 */
function testGoogleSheetsService_HasHeaders() {
  const sheet = GoogleSheetsService.getSheet(TEST_CONFIG.SPREADSHEET_ID);

  const result = GoogleSheetsService.hasHeaders(sheet);

  Logger.log("Headers correctos: %s", result);
}

/**
 * Verifica que toRow() respeta exactamente el contrato del Sheet.
 */
function testGoogleSheetsService_ToRow() {
  const pdf = PdfFile.create({
    id: "1",

    name: "Contrato.pdf",

    createdTime: new Date("2026-07-24"),

    pages: 18,

    sizeKb: 254,

    owner: "smith@unal.edu.co",

    url: "https://drive.google.com/file/d/123/view",
  });

  const row = GoogleSheetsService.toRow(pdf);

  const headers = GoogleSheetsService.getHeaders();

  Logger.log("Columnas: %s", headers.length);
  Logger.log("Valores : %s", row.length);

  if (headers.length !== row.length) {
    throw new Error("El contrato SheetSchema y toRow() no coinciden.");
  }

  Logger.log(JSON.stringify(row, null, 2));
}
