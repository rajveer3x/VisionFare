const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getCacheStatus } = require('../services/cacheService');

router.get('/', (req, res) => {
  const timestamp = new Date().toISOString();
  
  const cacheStatus = getCacheStatus();
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      phase: "2 - Live Data",
      services: {
        database: dbStatus,
        cache: cacheStatus.available ? "connected" : "unavailable",
        externalApi: "unknown"
      },
      uptime: process.uptime()
    },
    meta: {
      timestamp,
      source: 'health_check',
      responseTime: 0
    }
  });
});

module.exports = router;
