/**
 * Database Configuration - JSON File Storage
 * Simple file-based database for local development
 */

const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/intros.json');

/**
 * Ensure database file exists
 */
async function initDatabase() {
  const dbDir = path.dirname(DB_FILE);
  
  try {
    await fs.mkdir(dbDir, { recursive: true });
    
    // Check if file exists
    try {
      await fs.access(DB_FILE);
    } catch {
      // Create empty database
      await fs.writeFile(DB_FILE, JSON.stringify({ intros: [], nextId: 1 }, null, 2));
      console.log('✅ Database file created');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

/**
 * Read database
 */
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { intros: [], nextId: 1 };
  }
}

/**
 * Write database
 */
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

/**
 * Query database (simple implementation)
 */
async function query(operation, params = {}) {
  const db = await readDatabase();
  
  switch (operation) {
    case 'INSERT':
      const newIntro = {
        id: db.nextId,
        ...params,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.intros.push(newIntro);
      db.nextId++;
      await writeDatabase(db);
      return { rows: [newIntro], rowCount: 1 };
      
    case 'SELECT_ALL':
      let filtered = [...db.intros];
      
      // Apply filters
      if (params.category) {
        filtered = filtered.filter(i => i.user_category === params.category);
      }
      if (params.mood) {
        filtered = filtered.filter(i => i.mood === params.mood);
      }
      
      // Sort
      const sortBy = params.sortBy || 'created_at';
      filtered.sort((a, b) => {
        if (sortBy === 'created_at') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
      
      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);
      
      return { 
        rows: paginated, 
        rowCount: paginated.length,
        total: filtered.length 
      };
      
    case 'SELECT_BY_ID':
      const intro = db.intros.find(i => i.id === params.id);
      return { rows: intro ? [intro] : [], rowCount: intro ? 1 : 0 };
      
    case 'SEARCH':
      const searchQuery = params.query.toLowerCase();
      const results = db.intros.filter(intro => {
        const searchText = `${intro.ai_description} ${intro.ai_tags?.join(' ')}`.toLowerCase();
        return searchText.includes(searchQuery);
      });
      
      // Apply additional filters
      let filtered2 = results;
      if (params.category) {
        filtered2 = filtered2.filter(i => i.user_category === params.category);
      }
      if (params.mood) {
        filtered2 = filtered2.filter(i => i.mood === params.mood);
      }
      
      const limited = filtered2.slice(0, params.limit || 10);
      return { rows: limited, rowCount: limited.length };
      
    case 'COUNT':
      let countFiltered = db.intros;
      if (params.category) {
        countFiltered = countFiltered.filter(i => i.user_category === params.category);
      }
      if (params.mood) {
        countFiltered = countFiltered.filter(i => i.mood === params.mood);
      }
      return { rows: [{ count: countFiltered.length }], rowCount: 1 };
      
    case 'DELETE':
      const initialLength = db.intros.length;
      db.intros = db.intros.filter(i => i.id !== params.id);
      const deleted = db.intros.length < initialLength;
      
      if (deleted) {
        await writeDatabase(db);
      }
      
      return { rows: [], rowCount: deleted ? 1 : 0, deleted };
      
    case 'STATS':
      // Category stats
      const categoryCount = {};
      const moodCount = {};
      
      db.intros.forEach(intro => {
        categoryCount[intro.user_category] = (categoryCount[intro.user_category] || 0) + 1;
        if (intro.mood) {
          moodCount[intro.mood] = (moodCount[intro.mood] || 0) + 1;
        }
      });
      
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ user_category: category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
        
      const topMoods = Object.entries(moodCount)
        .map(([mood, count]) => ({ mood, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        total: db.intros.length,
        topCategories,
        topMoods
      };
      
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

module.exports = {
  query,
  initDatabase,
  readDatabase,
  writeDatabase
};
