const logger = require('../services/logger.service');

module.exports = (err, req, res, next) => {
  logger.error('🔥 Unhandled Error', { message: err.message, stack: err.stack });
  res.status(500).json({ message: 'Internal Server Error' });
};
