const mongoose = require('mongoose');
const logger = require('../services/logger.service'); 
require('./env'); 


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('❌ MongoDB connection failed', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }

  // Optional: listen to connection events
  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('🔄 MongoDB reconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('🚨 MongoDB error', { message: err.message });
  });
};

module.exports = connectDB;
