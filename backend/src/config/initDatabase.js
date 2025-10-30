/**
 * Database Initialization Script
 * Run this to create tables and indexes
 */

const { pool } = require('./database');

const createTableSQL = `
CREATE TABLE IF NOT EXISTS intros (
    id SERIAL PRIMARY KEY,
    video_url VARCHAR(500) NOT NULL,
    video_id VARCHAR(100) NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    thumbnail_url VARCHAR(500),
    channel_name VARCHAR(255) NOT NULL,
    video_title VARCHAR(500) NOT NULL,
    user_category VARCHAR(100) NOT NULL,
    ai_description TEXT NOT NULL,
    ai_tags TEXT[],
    mood VARCHAR(50),
    visual_style VARCHAR(50),
    pace VARCHAR(50),
    color_scheme VARCHAR(100),
    has_text BOOLEAN DEFAULT false,
    has_person BOOLEAN DEFAULT false,
    has_music BOOLEAN DEFAULT false,
    transition_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_video_id ON intros(video_id);
CREATE INDEX IF NOT EXISTS idx_category ON intros(user_category);
CREATE INDEX IF NOT EXISTS idx_mood ON intros(mood);
CREATE INDEX IF NOT EXISTS idx_created_at ON intros(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tags ON intros USING GIN(ai_tags);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_fulltext_search ON intros 
USING gin(to_tsvector('english', ai_description || ' ' || array_to_string(ai_tags, ' ')));
`;

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    await pool.query(createTableSQL);
    console.log('✅ Database tables and indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

