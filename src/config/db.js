const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const config = require('./index');

// Single shared PrismaClient instance for the whole app.
const adapter = new PrismaPg({ connectionString: config.db.url });

const prisma = new PrismaClient({
  adapter,
  log: config.isProduction ? ['error'] : ['warn', 'error'],
});

module.exports = prisma;
