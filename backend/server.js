const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');




//Routes

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const userRoutes = require('./routes/user.routes');
const qualificationRoutes = require('./routes/qualification.routes');
const applicationRoutes = require('./routes/application.routes');

dotenv.config();
const app = express();

// DB Connection
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


//Using routes

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/qualifications', qualificationRoutes);
app.use('/api/applications', applicationRoutes);

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
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
