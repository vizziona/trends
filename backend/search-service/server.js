const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const port = 3004;

const client = new Client({ node: 'http://elasticsearch:9200' });

app.use(express.json());

// Search endpoint
app.get('/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const result = await client.search({
      index: 'videos',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'description']
          }
        }
      }
    });

    res.json(result.body.hits.hits);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching' });
  }
});

app.listen(port, () => {
  console.log(`Search Service listening at http://localhost:${port}`);
});
