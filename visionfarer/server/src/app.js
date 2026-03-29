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

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Body Parsing - Limit payload size to 10kb to prevent Denial of Service via huge payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging
app.use(morgan('dev'));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Data Sanitization
// prevents MongoDB operator injection via req.body/query/params (e.g., {"email": {"$gt": ""}})
app.use(mongoSanitize());

// strips XSS (HTML/script injection) from all incoming strings
app.use(xss());

// API Routes
const routes = require('./routes/index');
app.use(routes);

// Unknown API routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
