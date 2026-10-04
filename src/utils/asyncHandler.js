/**
 * Wraps an async route handler so rejected promises reach the error middleware.
 * (Express 5 already does this, but the wrapper keeps intent explicit and
 * makes controllers portable.)
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
