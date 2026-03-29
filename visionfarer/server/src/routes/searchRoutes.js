const express = require('express');
const router = express.Router();
const { searchRoutes } = require('../controllers/searchController');

const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute per IP
  message: { success: false, error: "Search limit reached. Please wait before searching again." }
});

router.post('/', searchLimiter, searchRoutes);

module.exports = router;
