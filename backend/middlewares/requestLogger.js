const logger = require('../services/logger.service');

module.exports = (req, res, next) => {
  logger.info(`→ ${req.method} ${req.originalUrl} [${req.ip}]`);
  res.on('finish', () => {
    logger.info(`← ${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
};
