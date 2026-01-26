#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_TOKEN = process.env.SHORTCUT_API_TOKEN;
const DAYS_BACK = parseInt(process.env.DAYS_BACK || '7', 10);
const PAGE_SIZE = parseInt(process.env.PAGE_SIZE || '25', 10);
const WORKFLOW_STATE_IDS = process.env.WORKFLOW_STATE_IDS 
  ? process.env.WORKFLOW_STATE_IDS.split(',').map(id => id.trim()) 
  : [];

// Shortcut API base URL
const SHORTCUT_API_BASE = 'https://api.app.shortcut.com/api/v3';

/**
 * Validate environment variables
 */
function validateConfig() {
  if (!API_TOKEN || API_TOKEN === 'your_api_token_here') {
    console.error('❌ Error: SHORTCUT_API_TOKEN is not set or is using the default value.');
    console.error('Please create a .env file based on .env.example and add your Shortcut API token.');
    console.error('Get your token from: https://app.shortcut.com/settings/account/api-tokens');
    process.exit(1);
  }
}

/**
 * Create axios instance with Shortcut API configuration
 */
function createApiClient() {
  return axios.create({
    baseURL: SHORTCUT_API_BASE,
    headers: {
      'Shortcut-Token': API_TOKEN,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Get the date N days ago in ISO format
 */
function getDateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().substring(0, 10);
}

/**
 * Fetch stories from Shortcut API
 */
async function fetchStories(client) {
  try {
    const cutoffDate = getDateDaysAgo(DAYS_BACK);
    
    // Build search query
    let query = `updated:>${cutoffDate}`;
    
    if (WORKFLOW_STATE_IDS.length > 0) {
      const stateQuery = WORKFLOW_STATE_IDS.map(id => `state:${id}`).join(' OR ');
      query += ` (${stateQuery})`;
    }

    console.log(`🔍 Searching for stories updated in the last ${DAYS_BACK} days...`);
    console.log(`   Query: ${query}\n`);

    const response = await client.post('/search/stories', {
      query: query,
      page_size: PAGE_SIZE
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error: No response received from Shortcut API');
    } else {
      console.error('❌ Error:', error.message);
    }
    throw error;
  }
}

/**
 * Format and display story information
 */
function displayStories(searchResults) {
  const stories = searchResults.data || [];
  const total = searchResults.total || 0;

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📊 SHORTCUT REPORT - Stories Updated (Last ${DAYS_BACK} Days)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (stories.length === 0) {
    console.log('No stories found matching the criteria.\n');
    return;
  }

  console.log(`Total stories found: ${total}`);
  console.log(`Showing first ${stories.length} stories:\n`);

  stories.forEach((story, index) => {
    console.log(`${index + 1}. [${story.story_type.toUpperCase()}] ${story.name}`);
    console.log(`   ID: #${story.id}`);
    console.log(`   State: ${story.workflow_state_id}`);
    console.log(`   URL: https://app.shortcut.com/story/${story.id}`);
    
    if (story.owners && story.owners.length > 0) {
      const ownerNames = story.owners.map(owner => owner.profile.name).join(', ');
      console.log(`   Owners: ${ownerNames}`);
    }
    
    if (story.labels && story.labels.length > 0) {
      const labelNames = story.labels.map(label => label.name).join(', ');
      console.log(`   Labels: ${labelNames}`);
    }
    
    console.log(`   Updated: ${new Date(story.updated_at).toLocaleString()}`);
    console.log('');
  });

  console.log('═══════════════════════════════════════════════════════════════\n');
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Shortcut Weekly Update Script\n');
  
  // Validate configuration
  validateConfig();
  
  // Create API client
  const client = createApiClient();
  
  try {
    // Fetch and display stories
    const searchResults = await fetchStories(client);
    displayStories(searchResults);
    
    console.log('✅ Report generated successfully!\n');
  } catch (error) {
    console.error('\n❌ Failed to generate report. Please check your configuration and try again.\n');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, fetchStories, displayStories };
