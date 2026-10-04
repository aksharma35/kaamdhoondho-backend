const pino = require('pino');
const config = require('./index');

const logger = pino({
  level: config.isTest ? 'silent' : config.logLevel,
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],
  transport: config.isProduction
    ? undefined
    : { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } },
});

module.exports = logger;
