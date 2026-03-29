const REQUIRED_ENV_VARS = [
  'MONGO_URI', 
  'JWT_SECRET',
  'RAPIDAPI_KEY',
  'RAPIDAPI_HOST'
];

const OPTIONAL_ENV_VARS = [
  'REDIS_URL', // Application degrades gracefully if unavailable
  'ADMIN_SECRET', // Used to secure and open admin endpoints
  'AI_SERVICE_URL', // Python Microservice URL for predictive analysis
];
const validateEnv = (requiredKeys = REQUIRED_ENV_VARS) => {
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
  }
};

module.exports = { validateEnv, REQUIRED_ENV_VARS };
