const validateEnv = (requiredKeys) => {
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
  }
};

module.exports = { validateEnv };
