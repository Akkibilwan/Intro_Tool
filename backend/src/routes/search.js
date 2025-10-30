/**
 * Search Routes
 */

const express = require('express');
const router = express.Router();
const { searchIntros } = require('../controllers/searchController');

// POST /api/search - Search intros
router.post('/', searchIntros);

module.exports = router;

