/**
 * Cliente HTTP para comunicarse con Cloud Run.
 */
class CloudRunClient {
  /**
   * Obtiene información de un PDF.
   *
   * @param {Blob} pdfBlob Blob del PDF.
   * @returns {{pages:number}}
   */
  static getPdfInfo(pdfBlob) {
    const endpoint = "/api/v1/pdf/info";

    const options = {
      method: "post",
      contentType: "application/pdf",
      payload: pdfBlob.getBytes(),

      headers: {
        "X-API-Key": CONFIG.CLOUD_RUN.API_KEY,
      },

      muteHttpExceptions: true,
    };

    try {
      const response = UrlFetchApp.fetch(CONFIG.CLOUD_RUN.BASE_URL + endpoint, options);

      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`NETWORK_ERROR: ${error.message}`);
    }
  }

  /**
   * Procesa la respuesta HTTP.
   *
   * @private
   */
  static handleResponse(response) {
    const status = response.getResponseCode();

    const body = response.getContentText();

    let json = {};

    try {
      json = JSON.parse(body);
    } catch (_) {
      throw new Error("INVALID_RESPONSE: Response is not valid JSON.");
    }

    switch (status) {
      case 200:
        return json.data;

      case 400:
        throw new Error(json.error?.message || "INVALID_PDF");

      case 401:
        throw new Error("AUTHENTICATION_ERROR");

      case 413:
        throw new Error("FILE_TOO_LARGE");

      default:
        throw new Error(`SERVER_ERROR (${status})`);
    }
  }
}
