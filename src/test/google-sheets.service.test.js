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
function testGoogleSheetsService_Append() {
  const pdf = new PdfFile();

  pdf.name = "Contrato.pdf";
  pdf.createdTime = new Date();
  pdf.pages = 18;
  pdf.sizeKb = 254;
  pdf.owner = "smith@unal.edu.co";
  pdf.url = "https://drive.google.com/file/d/123/view";

  const rowNumber = GoogleSheetsService.append(TEST_CONFIG.SPREADSHEET_ID, pdf);

  Logger.log("Fila creada: %s", rowNumber);
}
