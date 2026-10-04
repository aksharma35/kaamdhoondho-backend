const { PAGINATION } = require('./constants');

/**
 * Converts ?page=&limit= query params into Prisma skip/take values.
 */
const getPagination = (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT,
  );
  return { page, limit, skip: (page - 1) * limit, take: limit };
};

/**
 * Builds the `meta` object for paginated responses.
 */
const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0,
});

module.exports = { getPagination, buildPaginationMeta };
