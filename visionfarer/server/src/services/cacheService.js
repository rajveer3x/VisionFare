const Redis = require('ioredis');
const logger = require('../utils/logger'); // Generic logger instance fallback

let cacheAvailable = false;

// Instance connection using safe auto-reconnection limitations
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 1, // Don't queue commands indefinitely if redis is dead
  retryStrategy(times) {
    // Only attempt to reconnect a few times before giving up
    if (times > 3) {
      return false; // Stop trying to reconnect completely
    }
    return Math.min(times * 100, 3000); 
  }
});

redis.on('connect', () => {
  logger.info('[CACHE] Redis connected');
  cacheAvailable = true;
});

redis.on('error', (err) => {
  if (cacheAvailable) {
    logger.warn(`[CACHE] Redis connection dropped: ${err.message}`);
  } else {
    logger.warn('[CACHE] Redis unavailable — running without cache');
  }
  cacheAvailable = false;
});

/**
 * Gets and parses a JSON item from cache.
 * Fails gracefully and silently.
 * 
 * @param {string} key 
 * @returns {Promise<any | null>}
 */
const getCached = async (key) => {
  if (!cacheAvailable) return null; // Graceful degradation

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.warn(`[CACHE] getCached failed for '${key}': ${error.message}`);
    return null; // Never throw from cache layer!
  }
};

/**
 * Stores a value in cache as JSON.
 * Fails gracefully and silently.
 * 
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlSeconds - Time-To-Live in seconds (Default 15m)
 * @returns {Promise<void>}
 */
const setCache = async (key, value, ttlSeconds = 900) => {
  if (!cacheAvailable) return;

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    logger.warn(`[CACHE] setCache failed for '${key}': ${error.message}`);
  }
};

/**
 * Invalidates cache by finding matching keys.
 * Warning: KEYS command is expensive in Redis. Use for testing/admin cautiously.
 * 
 * @param {string} pattern 
 * @returns {Promise<void>}
 */
const invalidateCache = async (pattern) => {
  if (!cacheAvailable) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.warn(`[CACHE] invalidateCache failed for '${pattern}': ${error.message}`);
  }
};

/**
 * Builds a standardized cache key for travel searches.
 * @param {string} origin 
 * @param {string} destination 
 * @param {string} date 
 * @param {string} transportType 
 * @returns {string} e.g. "search:rishikesh:delhi:2025-04-15:bus"
 */
const buildSearchCacheKey = (origin, destination, date, transportType) => {
  const sanitize = (str) => String(str || '').toLowerCase().trim().replace(/\s+/g, '-');
  return `search:${sanitize(origin)}:${sanitize(destination)}:${sanitize(date)}:${sanitize(transportType)}`;
};

/**
 * Accessor for the dynamic cache operational status.
 * @returns {{ available: boolean, info: string }}
 */
const getCacheStatus = () => ({
  available: cacheAvailable,
  info: cacheAvailable 
    ? "Redis caching layer is fully operational." 
    : "Redis is disconnected. Operating safely in degraded mode."
});

module.exports = {
  getCached,
  setCache,
  invalidateCache,
  buildSearchCacheKey,
  getCacheStatus
};
