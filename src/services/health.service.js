const prisma = require('../config/db');

const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'up';
  } catch {
    return 'down';
  }
};

const getHealth = async () => {
  const database = await checkDatabase();
  return {
    status: database === 'up' ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    services: { database },
  };
};

module.exports = { getHealth };
