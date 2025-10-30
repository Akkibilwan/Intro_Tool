/**
 * Intro Model
 * Database operations for intro records
 */

const db = require('../config/database');

class Intro {
  /**
   * Create a new intro record
   */
  static async create(data) {
    const result = await db.query('INSERT', data);
    return result.rows[0];
  }

  /**
   * Find intro by ID
   */
  static async findById(id) {
    const result = await db.query('SELECT_BY_ID', { id: parseInt(id) });
    return result.rows[0] || null;
  }

  /**
   * Get all intros with pagination and filters
   */
  static async findAll(options = {}) {
    const result = await db.query('SELECT_ALL', options);
    return result.rows;
  }

  /**
   * Get total count with filters
   */
  static async count(filters = {}) {
    const result = await db.query('COUNT', filters);
    return parseInt(result.rows[0].count);
  }

  /**
   * Search intros using text search
   */
  static async search(searchQuery, filters = {}) {
    const result = await db.query('SEARCH', {
      query: searchQuery,
      ...filters
    });
    
    // Add rank for compatibility
    return result.rows.map((row, index) => ({
      ...row,
      rank: 1 - (index * 0.1) // Simple ranking
    }));
  }

  /**
   * Delete intro by ID
   */
  static async deleteById(id) {
    const result = await db.query('DELETE', { id: parseInt(id) });
    return result.deleted;
  }

  /**
   * Get stats for dashboard
   */
  static async getStats() {
    const stats = await db.query('STATS');
    return {
      totalIntros: stats.total,
      topCategories: stats.topCategories,
      topMoods: stats.topMoods
    };
  }
}

module.exports = Intro;
