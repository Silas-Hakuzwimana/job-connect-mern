const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = format.printf(({ timestamp, level, message, meta }) => {
  const metaString = meta ? JSON.stringify(meta) : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
});

const logger = createLogger({
  level: 'info', // default log level, can be adjusted
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    })
  ],
  exitOnError: false,
});

// Helper to log errors with stack trace and meta
logger.errorWithMeta = (message, meta) => {
  logger.error(message, { meta });
};

module.exports = logger;
