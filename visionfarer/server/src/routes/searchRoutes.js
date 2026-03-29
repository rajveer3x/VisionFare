const express = require('express');
const router = express.Router();
const { searchRoutes } = require('../controllers/searchController');

// Mount POST / -> searchController.searchRoutes
// This router will be scoped under /api/search in routes/index.js
router.post('/', searchRoutes);

module.exports = router;
