const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const notFoundHandler = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middlewares
app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);


// API Routes
const routes = require('./routes/index');
app.use(routes);

// Unknown API routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
