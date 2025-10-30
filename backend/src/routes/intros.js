/**
 * Intro Routes
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  createIntro,
  getAllIntros,
  getIntroById,
  deleteIntro,
} = require('../controllers/introController');

// Rate limiter only for POST requests
const createIntroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 intros per hour
  message: 'Maximum 10 intro submissions per hour. Please try again later.'
});

// POST /api/intros - Create new intro (with rate limit)
router.post('/', createIntroLimiter, createIntro);

// GET /api/intros - Get all intros with pagination (NO rate limit)
router.get('/', getAllIntros);

// GET /api/intros/:id - Get single intro (NO rate limit)
router.get('/:id', getIntroById);

// DELETE /api/intros/:id - Delete intro (NO rate limit)
router.delete('/:id', deleteIntro);

module.exports = router;
