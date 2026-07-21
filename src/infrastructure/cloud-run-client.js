/**
 * Cliente HTTP para comunicarse con Cloud Run.
 */
class CloudRunClient {
  /**
   * Endpoint para obtener información de un PDF.
   * @private
   */
  static getPdfInfoEndpoint() {
    return "/api/v1/pdf/info";
  }

  /**
   * Envía un PDF a Cloud Run y devuelve su información.
   *
   * @param {GoogleAppsScript.Base.Blob} pdfBlob
   * @returns {{pages:number}}
   */

  static getPdfInfo(pdfBlob) {
    if (!pdfBlob) {
      throw new Error("INVALID_ARGUMENT: pdfBlob is required.");
    }

    const response = this.post(this.getPdfInfoEndpoint(), pdfBlob.getBytes(), "application/pdf");

    return response.data;
  }

  /**
   * Ejecuta una petición POST.
   *
   * @private
   */
  static post(endpoint, payload, contentType) {
    const options = {
      method: "post",
      contentType,
      payload,
      muteHttpExceptions: true,
      headers: {
        "X-API-Key": CONFIG.CLOUD_RUN.API_KEY,
      },
    };

    let response;

    try {
      response = UrlFetchApp.fetch(CONFIG.CLOUD_RUN.BASE_URL + endpoint, options);
    } catch (error) {
      throw new Error(`NETWORK_ERROR: ${error.message}`);
    }

    return this.parseResponse(response);
  }

  /**
   * Procesa la respuesta HTTP.
   *
   * @private
   */
  static parseResponse(response) {
    const status = response.getResponseCode();

    let body = {};

    try {
      body = JSON.parse(response.getContentText());
    } catch (_) {
      throw new Error("INVALID_RESPONSE: Cloud Run did not return valid JSON.");
    }

    switch (status) {
      case 200:
        return body;

      case 400:
        throw new Error(body.error?.message || "INVALID_PDF");

      case 401:
        throw new Error(body.error?.message || "AUTHENTICATION_ERROR");

      case 413:
        throw new Error(body.error?.message || "FILE_TOO_LARGE");

      default:
        throw new Error(body.error?.message || `SERVER_ERROR (${status})`);
    }
  }
}
