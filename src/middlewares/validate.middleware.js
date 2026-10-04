const ApiError = require('../utils/ApiError');

/**
 * Validates req.body / req.query / req.params against Zod schemas.
 * Parsed (coerced + stripped) values are stored on req.validated.
 *
 *   router.post('/', validate({ body: createJobSchema }), controller.create);
 */
const validate =
  (schemas = {}) =>
  (req, res, next) => {
    const errors = [];
    req.validated = {};

    for (const key of ['params', 'query', 'body']) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key] ?? {});
      if (result.success) {
        req.validated[key] = result.data;
        // req.query is a getter in Express 5, so only body/params are overwritten
        if (key !== 'query') req[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          errors.push({ location: key, field: issue.path.join('.'), message: issue.message });
        }
      }
    }

    if (errors.length) return next(ApiError.unprocessable('Validation failed', errors));
    next();
  };

module.exports = validate;
