/**
 * Smart Search Routes
 * Enhanced search with AI-powered relevance scoring
 */

const express = require('express');
const router = express.Router();
const { readDatabase } = require('../config/database');
const { smartSearch, getSearchSuggestions } = require('../services/smartSearch');

/**
 * POST /api/search/smart
 * Enhanced search with relevance scoring
 */
router.post('/smart', async (req, res, next) => {
  try {
    const { query, userContext, filters } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    console.log(`\n🔍 Smart Search Request:`);
    console.log(`   Query: "${query}"`);
    if (userContext) console.log(`   Context: "${userContext}"`);
    if (filters) console.log(`   Filters:`, filters);
    
    // Get all intros from database
    const db = await readDatabase();
    const intros = db.intros || [];
    
    // Perform smart search
    const results = smartSearch(query, intros, userContext, filters);
    
    console.log(`✅ Returning ${results.length} results\n`);
    
    res.json({
      success: true,
      query,
      userContext,
      filters,
      resultCount: results.length,
      results: results
    });
    
  } catch (error) {
    console.error('❌ Smart search error:', error);
    next(error);
  }
});

/**
 * GET /api/search/suggestions?q=partial_query
 * Get search suggestions
 */
router.get('/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }
    
    const db = await readDatabase();
    const intros = db.intros || [];
    
    const suggestions = getSearchSuggestions(q, intros);
    
    res.json({
      success: true,
      query: q,
      suggestions
    });
    
  } catch (error) {
    console.error('❌ Suggestions error:', error);
    next(error);
  }
});

module.exports = router;

