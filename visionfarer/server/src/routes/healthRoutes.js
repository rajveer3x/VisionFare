const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (req, res) => {
  res.status(200).json({
    status: "ok",
    phase: "1 - Mock Data",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
