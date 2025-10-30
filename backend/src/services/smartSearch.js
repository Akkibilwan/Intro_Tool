/**
 * Smart Search Service
 * Advanced search algorithm with AI tag and description matching
 */

/**
 * Extract keywords from query
 * Removes stop words and normalizes text
 */
function extractKeywords(query) {
  const stopWords = ['the', 'a', 'an', 'with', 'for', 'i', 'want', 'to', 'and', 'or', 'in', 'on', 'at', 'is', 'are', 'was', 'were'];
  
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => !stopWords.includes(word) && word.length > 2)
    .map(word => word.replace(/[^a-z0-9]/g, '')); // Remove special chars
}

/**
 * Calculate relevance score for an intro
 * 
 * Scoring system:
 * - Exact match in aiTags: +10 points
 * - Partial match in aiTags: +5 points
 * - Keyword in aiDescription: +7 points
 * - Keyword in mood/visualStyle/pace: +8 points
 * - Category match: +3 points
 */
function calculateRelevanceScore(intro, keywords, userContext) {
  let score = 0;
  const matches = {
    tags: [],
    description: [],
    mood: false,
    visualStyle: false,
    pace: false,
    category: false
  };
  
  // Score from AI tags (highest weight)
  if (intro.aiTags && Array.isArray(intro.aiTags)) {
    keywords.forEach(keyword => {
      intro.aiTags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (tagLower === keyword) {
          score += 10; // Exact match
          matches.tags.push(tag);
        } else if (tagLower.includes(keyword) || keyword.includes(tagLower)) {
          score += 5; // Partial match
          matches.tags.push(tag);
        }
      });
    });
  }
  
  // Score from AI description
  if (intro.aiDescription) {
    const descLower = intro.aiDescription.toLowerCase();
    keywords.forEach(keyword => {
      if (descLower.includes(keyword)) {
        score += 7;
        matches.description.push(keyword);
      }
    });
  }
  
  // Score from mood, visual style, pace
  keywords.forEach(keyword => {
    if (intro.mood && intro.mood.toLowerCase().includes(keyword)) {
      score += 8;
      matches.mood = true;
    }
    if (intro.visualStyle && intro.visualStyle.toLowerCase().includes(keyword)) {
      score += 8;
      matches.visualStyle = true;
    }
    if (intro.pace && intro.pace.toLowerCase().includes(keyword)) {
      score += 8;
      matches.pace = true;
    }
  });
  
  // Bonus for user context alignment (if provided)
  if (userContext) {
    const contextKeywords = extractKeywords(userContext);
    contextKeywords.forEach(ck => {
      if (intro.userCategory && intro.userCategory.toLowerCase().includes(ck)) {
        score += 3;
        matches.category = true;
      }
      if (intro.channelName && intro.channelName.toLowerCase().includes(ck)) {
        score += 2;
      }
    });
  }
  
  return { score, matches };
}

/**
 * Smart search intros based on query and context
 * @param {string} query - Search query
 * @param {Array} intros - Array of intro objects
 * @param {string} userContext - Optional user context
 * @param {Object} filters - Optional filters (category, minDuration, maxDuration)
 * @returns {Array} Sorted array of intros with relevance scores
 */
function smartSearch(query, intros, userContext = '', filters = {}) {
  if (!query || query.trim().length === 0) {
    return intros.map(intro => ({
      ...intro,
      relevanceScore: 0,
      matchDetails: {}
    }));
  }
  
  const keywords = extractKeywords(query);
  console.log(`🔍 Smart Search - Keywords: ${keywords.join(', ')}`);
  
  // Apply filters first
  let filteredIntros = intros;
  
  if (filters.category) {
    filteredIntros = filteredIntros.filter(intro => 
      intro.userCategory === filters.category
    );
  }
  
  if (filters.minDuration) {
    filteredIntros = filteredIntros.filter(intro => 
      intro.duration >= filters.minDuration
    );
  }
  
  if (filters.maxDuration) {
    filteredIntros = filteredIntros.filter(intro => 
      intro.duration <= filters.maxDuration
    );
  }
  
  // Calculate relevance scores
  const scoredIntros = filteredIntros.map(intro => {
    const { score, matches } = calculateRelevanceScore(intro, keywords, userContext);
    return {
      ...intro,
      relevanceScore: score,
      matchDetails: matches
    };
  });
  
  // Sort by relevance score (highest first)
  const sortedIntros = scoredIntros
    .filter(intro => intro.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  console.log(`✅ Found ${sortedIntros.length} relevant intros`);
  if (sortedIntros.length > 0) {
    console.log(`   Top score: ${sortedIntros[0].relevanceScore} (${sortedIntros[0].videoTitle})`);
  }
  
  return sortedIntros;
}

/**
 * Get search suggestions based on partial query
 * @param {string} partialQuery - Partial search query
 * @param {Array} intros - Array of intro objects
 * @returns {Array} Array of suggested keywords
 */
function getSearchSuggestions(partialQuery, intros) {
  const suggestions = new Set();
  const queryLower = partialQuery.toLowerCase();
  
  // Collect all unique tags, moods, styles
  intros.forEach(intro => {
    if (intro.aiTags) {
      intro.aiTags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    }
    
    if (intro.mood && intro.mood.toLowerCase().includes(queryLower)) {
      suggestions.add(intro.mood);
    }
    
    if (intro.visualStyle && intro.visualStyle.toLowerCase().includes(queryLower)) {
      suggestions.add(intro.visualStyle);
    }
    
    if (intro.userCategory && intro.userCategory.toLowerCase().includes(queryLower)) {
      suggestions.add(intro.userCategory);
    }
  });
  
  return Array.from(suggestions).slice(0, 10); // Limit to 10 suggestions
}

module.exports = {
  smartSearch,
  extractKeywords,
  calculateRelevanceScore,
  getSearchSuggestions
};

