const healthService = require('../services/health.service');
const asyncHandler = require('../utils/asyncHandler');
const { HTTP_STATUS } = require('../utils/constants');

const getHealth = asyncHandler(async (req, res) => {
  const health = await healthService.getHealth();
  const statusCode = health.status === 'ok' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
  res.status(statusCode).json({ success: statusCode === HTTP_STATUS.OK, data: health });
});

module.exports = { getHealth };
