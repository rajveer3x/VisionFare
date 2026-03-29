const express = require('express');
const router = express.Router();

const searchRoutes = require('./searchRoutes');

router.use('/api/search', searchRoutes);

module.exports = router;
