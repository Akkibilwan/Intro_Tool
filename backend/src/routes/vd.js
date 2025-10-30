/**
 * Visual Direction Routes
 * Generate and manage visual directions
 */

const express = require('express');
const router = express.Router();
const { readDatabase, writeDatabase } = require('../config/database');
const { generateVisualDirection } = require('../services/vdGenerator');

/**
 * POST /api/generate-vd
 * Generate visual direction from selected intros
 */
router.post('/', async (req, res, next) => {
  try {
    const { selectedIntroIds, userDescription, preferences } = req.body;
    
    // Validation
    if (!selectedIntroIds || !Array.isArray(selectedIntroIds) || selectedIntroIds.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 3 intro IDs must be selected'
      });
    }
    
    if (!userDescription || userDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User description is required'
      });
    }
    
    console.log(`\n${'█'.repeat(70)}`);
    console.log(`🎬 VISUAL DIRECTION GENERATION REQUEST`);
    console.log(`   Selected Intros: ${selectedIntroIds.join(', ')}`);
    console.log(`   Description: "${userDescription}"`);
    console.log(`${'█'.repeat(70)}\n`);
    
    // Fetch selected intros from database
    const db = await readDatabase();
    const selectedIntros = selectedIntroIds.map(id => {
      const intro = db.intros.find(i => i.id === id);
      if (!intro) {
        throw new Error(`Intro with ID ${id} not found`);
      }
      return intro;
    });
    
    console.log('✅ Found all 3 selected intros');
    selectedIntros.forEach((intro, i) => {
      console.log(`   ${i + 1}. ${intro.videoTitle} (${intro.channelName})`);
    });
    
    // Generate Visual Direction
    const startTime = Date.now();
    const visualDirection = await generateVisualDirection(
      selectedIntros,
      userDescription,
      preferences || {}
    );
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // Save VD to database
    if (!db.visualDirections) {
      db.visualDirections = [];
      db.nextVdId = 1;
    }
    
    const vdRecord = {
      id: db.nextVdId++,
      createdAt: new Date().toISOString(),
      userDescription,
      selectedIntroIds,
      preferences: preferences || {},
      generatedVD: visualDirection
    };
    
    db.visualDirections.push(vdRecord);
    await writeDatabase(db);
    
    console.log(`\n${'█'.repeat(70)}`);
    console.log(`✅ VISUAL DIRECTION GENERATED SUCCESSFULLY!`);
    console.log(`   VD ID: ${vdRecord.id}`);
    console.log(`   Generation Time: ${generationTime}s`);
    console.log(`   Title: "${visualDirection.title}"`);
    console.log(`${'█'.repeat(70)}\n`);
    
    res.json({
      success: true,
      message: 'Visual Direction generated successfully',
      vdId: vdRecord.id,
      generationTime: parseFloat(generationTime),
      visualDirection
    });
    
  } catch (error) {
    console.error('\n❌ Visual Direction generation error:', error);
    console.error(`${'━'.repeat(70)}\n`);
    next(error);
  }
});

/**
 * GET /api/generate-vd/:id
 * Get a saved visual direction by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const db = await readDatabase();
    if (!db.visualDirections) {
      return res.status(404).json({
        success: false,
        message: 'No visual directions found'
      });
    }
    
    const vd = db.visualDirections.find(v => v.id === parseInt(id));
    
    if (!vd) {
      return res.status(404).json({
        success: false,
        message: 'Visual Direction not found'
      });
    }
    
    // Also fetch the selected intros for reference
    const selectedIntros = vd.selectedIntroIds.map(introId => {
      return db.intros.find(i => i.id === introId);
    }).filter(Boolean);
    
    res.json({
      success: true,
      vd,
      selectedIntros
    });
    
  } catch (error) {
    console.error('❌ Error fetching VD:', error);
    next(error);
  }
});

/**
 * GET /api/generate-vd
 * Get all saved visual directions
 */
router.get('/', async (req, res, next) => {
  try {
    const db = await readDatabase();
    
    const visualDirections = db.visualDirections || [];
    
    res.json({
      success: true,
      count: visualDirections.length,
      visualDirections: visualDirections.map(vd => ({
        id: vd.id,
        createdAt: vd.createdAt,
        userDescription: vd.userDescription,
        title: vd.generatedVD?.title || 'Untitled',
        selectedIntroIds: vd.selectedIntroIds
      }))
    });
    
  } catch (error) {
    console.error('❌ Error fetching VDs:', error);
    next(error);
  }
});

module.exports = router;

