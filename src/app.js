const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const pinoHttp = require('pino-http');

const config = require('./config');
const logger = require('./config/logger');
const routes = require('./routes');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Trust the first proxy (load balancer / Nginx) so req.ip and rate limiting work correctly
app.set('trust proxy', 1);

// Security & performance
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: config.cors.origin !== '*' }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url.endsWith('/health') },
    customLogLevel: (req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  }),
);

// API routes
app.use(config.apiPrefix, apiLimiter, routes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
