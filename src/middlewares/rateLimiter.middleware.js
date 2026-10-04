const { rateLimit } = require('express-rate-limit');
const config = require('../config');
const ApiError = require('../utils/ApiError');

const createRateLimiter = (options = {}) =>
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => config.isTest,
    handler: (req, res, next) => next(ApiError.tooManyRequests()),
    ...options,
  });

// Default limiter applied to the whole API
const apiLimiter = createRateLimiter();

module.exports = { apiLimiter, createRateLimiter };
