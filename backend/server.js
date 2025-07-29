// Load environment variables
require('./config/env');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDB = require('./config/db');
const logger = require('./services/logger.service');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const userRoutes = require('./routes/user.routes');
const qualificationRoutes = require('./routes/qualification.routes');
const applicationRoutes = require('./routes/application.routes');
const adminRoutes = require('./routes/admin.routes');
const bookmarkRoutes = require('./routes/bookmark.routes.js');
const jobSeekerRoutes = require('./routes/jobseeker.routes.js');

// Swagger Documentation
const swaggerDocument = YAML.load('./docs/swagger.yaml');

// Initialize app
const app = express();

// Connect to DB
connectDB()
  .then(() => logger.info('🟢 MongoDB connected successfully'))
  .catch((err) => {
    logger.error('🔴 MongoDB connection error', { message: err.message });
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONT_END_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logger
app.use(requestLogger);

// API Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookmarks',bookmarkRoutes);
app.use('/api/jobseeker', jobSeekerRoutes);

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check
app.get('/', (req, res) => {
  res.send('JobConnect API is running 🚀');
  logger.info('✅ JobConnect API is running');
});

// Global error handler (last)
app.use(errorHandler);

// Uncaught Exceptions & Rejections
process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('💥 Unhandled Rejection', { reason });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
