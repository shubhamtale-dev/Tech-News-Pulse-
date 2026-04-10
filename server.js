const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Serve static files from the root directory
app.use(express.static(__dirname));

// Proxy endpoint for NewsAPI
app.get('/api/news', async (req, res) => {
  try {
    const { endpoint, ...params } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ status: 'error', message: 'Missing endpoint parameter' });
    }

    const url = new URL(`https://newsapi.org/v2/${endpoint}`);
    
    // Add all query parameters forwarded from the frontend
    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }
    
    // Append the securely stored API key
    url.searchParams.append('apiKey', process.env.NEWS_API_KEY);
    
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'TechNewsPulse/1.0' // NewsAPI requires User-Agent
      }
    });

    const data = await response.json();
    
    // Log failures, but forward status
    if (!response.ok || data.status === 'error') {
      console.error(`NewsAPI Error (${response.status}):`, data);
      return res.status(response.status !== 200 ? response.status : 400).json(data);
    }
    
    res.json(data);
  } catch (error) {
    console.error('Proxy Server Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch news from server proxy' });
  }
});

// Fallback to index.html for SPA routing (if needed)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server proxy is running on port ${PORT}`);
});
