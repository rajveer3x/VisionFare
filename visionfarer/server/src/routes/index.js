const express = require('express');
const router = express.Router();

const searchRoutes = require('./searchRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/api/search', searchRoutes);
router.use('/api/health', healthRoutes);

module.exports = router;
