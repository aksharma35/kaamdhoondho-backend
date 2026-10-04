const { Prisma } = require('@prisma/client');
const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');
const config = require('../config');
const logger = require('../config/logger');

/**
 * Maps known Prisma errors to ApiErrors.
 * https://www.prisma.io/docs/orm/reference/error-reference
 */
const fromPrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      return ApiError.conflict('A record with this value already exists', {
        fields: err.meta?.target,
      });
    case 'P2003':
      return ApiError.badRequest('Related record does not exist', { field: err.meta?.field_name });
    case 'P2025':
      return ApiError.notFound(err.meta?.cause || 'Record not found');
    default:
      return null;
  }
};

const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err instanceof ZodError) {
    return ApiError.unprocessable(
      'Validation failed',
      err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = fromPrismaError(err);
    if (mapped) return mapped;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return ApiError.badRequest('Invalid data provided');
  }

  // Malformed JSON body (thrown by express.json)
  if (err.type === 'entity.parse.failed') {
    return ApiError.badRequest('Malformed JSON in request body');
  }

  if (err.type === 'entity.too.large') {
    return new ApiError(413, 'Request body too large');
  }

  return null;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const apiError = normalizeError(err) || ApiError.internal();
  const { statusCode } = apiError;

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, 'Unhandled error');
  } else {
    logger.warn({ path: req.originalUrl, method: req.method, statusCode }, apiError.message);
  }

  const body = {
    success: false,
    message: apiError.message,
  };
  if (apiError.details) body.errors = apiError.details;
  if (!config.isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};

module.exports = errorHandler;
