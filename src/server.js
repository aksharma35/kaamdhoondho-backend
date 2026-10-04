const config = require('./config');
const logger = require('./config/logger');
const prisma = require('./config/db');
const app = require('./app');

const SHUTDOWN_TIMEOUT_MS = 10_000;

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.fatal({ err }, 'Failed to connect to the database');
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} [${config.env}] at ${config.apiPrefix}`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);

    // Force exit if connections don't close in time
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();

    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

start();
