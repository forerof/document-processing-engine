function helloWorld() {
  validateConfiguration();
  var name = "Smith";
  Logger.log(name);
}

/**
 * Elimina todos los registros del repositorio de procesados.
 */
function testElectronicIndexService_ClearRepository() {
  ProcessedFilesRepository.clear();

  Logger.log("Repositorio limpiado correctamente.");
}
