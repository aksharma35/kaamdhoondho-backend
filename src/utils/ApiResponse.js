/**
 * Consistent success response shape:
 *   { success: true, message, data, meta? }
 */
class ApiResponse {
  static send(res, { statusCode = 200, message = 'Success', data = null, meta } = {}) {
    const body = { success: true, message, data };
    if (meta) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static ok(res, data, message = 'Success', meta) {
    return ApiResponse.send(res, { statusCode: 200, message, data, meta });
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.send(res, { statusCode: 201, message, data });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
