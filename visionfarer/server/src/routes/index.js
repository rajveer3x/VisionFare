const express = require('express');
const router = express.Router();

const searchRoutes = require('./searchRoutes');
const healthRoutes = require('./healthRoutes');
const cacheRoutes = require('./cacheRoutes');

router.use('/api/search', searchRoutes);
router.use('/api/health', healthRoutes);
router.use('/api/cache', cacheRoutes);

module.exports = router;
