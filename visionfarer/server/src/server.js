require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const { validateEnv } = require('./utils/envValidator');

try {
  // Validate Phase 1 environment requirements
  validateEnv(['MONGO_URI', 'JWT_SECRET']);
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}

// Connect to MongoDB
connectDB().then(() => {
  // Start the server once DB is connected
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database. Server not started.', err.message);
  process.exit(1);
});
