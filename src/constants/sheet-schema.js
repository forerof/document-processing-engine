/**
 * Esquema oficial del índice electrónico.
 */
const SheetSchema = Object.freeze({
  HEADERS: [
    "Nombre Documento",

    "Fecha Incorporación Expediente",

    "Número Páginas",

    "Tamaño (KB)",

    "Propietario",

    "URL Documento",
  ],

  COLUMNS: Object.freeze({
    DOCUMENT_NAME: 1,

    CREATED_TIME: 2,

    PAGES: 3,

    SIZE_KB: 4,

    OWNER: 5,

    URL: 6,
  }),
});
