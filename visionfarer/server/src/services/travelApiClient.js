const axios = require('axios');
const logger = require('../utils/logger'); // Ensure you have a logger.js or fall back to a utility that doesn't just console.log

const {
  RateLimitError,
  ExternalServiceError,
  ExternalTimeoutError,
} = require('../utils/customErrors');

const rapidApiClient = axios.create({
  // baseURL for the specific bus/train/travel aggregator
  // Swap the baseURL here when changing API providers
  baseURL: 'https://travel-advisor.p.rapidapi.com',
  timeout: 10000, // 10 seconds - never hang forever
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // from env, NEVER hardcoded
    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST, // from env
  },
});

// Request Interceptor
rapidApiClient.interceptors.request.use(
  (config) => {
    // Attach timestamp to calculate response time later
    config.metadata = { startTime: new Date() };

    if (process.env.NODE_ENV === 'development') {
      // NEVER log the API key value
      const safeHeaders = { ...config.headers };
      if (safeHeaders['X-RapidAPI-Key']) {
        safeHeaders['X-RapidAPI-Key'] = '[HIDDEN]';
      }

      logger.info(`[EXTERNAL API REQUEST] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
rapidApiClient.interceptors.response.use(
  (response) => {
    const { config, status } = response;
    const responseTime = new Date() - config.metadata.startTime;

    logger.info(`[EXTERNAL API RESPONSE] ${status} - ${responseTime}ms`);
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 429) {
        throw new RateLimitError('External API rate limit reached. Please try again in a moment.');
      } else if (status >= 500 && status < 600) {
        throw new ExternalServiceError(`External service failed with status ${status}`);
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new ExternalTimeoutError('External API call timed out.');
    }

    // Pass through other errors
    return Promise.reject(error);
  }
);

module.exports = {
  rapidApiClient,
  RateLimitError,
  ExternalServiceError,
  ExternalTimeoutError,
};
