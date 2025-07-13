require('./config/env');


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');
const logger = require('./services/logger.service');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/error.middleware');




//Routes

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const userRoutes = require('./routes/user.routes');
const qualificationRoutes = require('./routes/qualification.routes');
const applicationRoutes = require('./routes/application.routes');
const adminRoutes = require('./routes/admin.routes');



require('./config/env')
const app = express();

// DB Connection
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(errorHandler);

app.use('/uploads', express.static('uploads'));


//Using routes

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

//API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
}));

// Routes
app.get('/', (req, res) => {
  res.send('JobConnect API is running 🚀');
  logger.info('JobConnect API is running 🚀');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('💥 Unhandled Rejection', { reason });
});
