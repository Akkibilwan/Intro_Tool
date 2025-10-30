/**
 * Stats Routes
 */

const express = require('express');
const router = express.Router();
const Intro = require('../models/Intro');

// GET /api/stats - Get statistics
router.get('/', async (req, res, next) => {
  try {
    const stats = await Intro.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

