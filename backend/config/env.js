const dotenv = require('dotenv');
const logger = require('../services/logger.service'); 

// Load .env file
const result = dotenv.config();

if (result.error) {
  logger.error('❌ Failed to load .env file', result.error);
  process.exit(1);
}

// Define required environment variables
const requiredEnvVars = [
  'PORT',
  'FRONT_END_URL',
  'MONGODB_URI',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

// Validate required environment variables
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  logger.error('❌ Missing required environment variables:', { missing: missingVars });
  process.exit(1);
}

logger.info('✅ Environment variables loaded and validated');

module.exports = process.env;
