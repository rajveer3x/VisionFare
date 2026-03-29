const express = require('express');
const router = express.Router();
const { getCacheStatus } = require('../services/cacheService');

// Middleware to enforce ADMIN_SECRET header auth
const requireAdmin = (req, res, next) => {
  const secretKey = process.env.ADMIN_SECRET;
  
  // If server admin secret isn't specified, deny all admin access
  if (!secretKey) {
    return res.status(503).json({ 
      message: 'Admin features disabled: ADMIN_SECRET not configured.' 
    });
  }

  // Check custom headers specifically for admin authorization
  const providedSecret = req.headers['admin_secret'] || req.headers['x-admin-secret'];
  
  if (!providedSecret || providedSecret !== secretKey) {
    return res.status(403).json({ 
      message: 'Forbidden: Invalid Admin Secret' 
    });
  }

  next();
};

/**
 * GET /api/cache/status
 * Returns current Redis cache layer operational status securely.
 */
router.get('/status', requireAdmin, (req, res) => {
  // Gracefully interrogates the state of the caching pool without locking or blocking
  const currentStatus = getCacheStatus();
  
  res.status(200).json(currentStatus);
});

module.exports = router;
