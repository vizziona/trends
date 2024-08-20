const express = require('express');
const mongoose = require('mongoose');
const kafka = require('kafka-node');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongodb-0.mongodb,mongodb-1.mongodb,mongodb-2.mongodb:27017/interactions', { useNewUrlParser: true, useUnifiedTopology: true });

// Redis connection
const redisClient = redis.createClient({ host: 'redis-service' });
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Kafka producer
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka-service:9092' });
const producer = new Producer(client);

// Models
const Like = mongoose.model('Like', {
  userId: String,
  videoId: String,
  createdAt: Date
});

const Comment = mongoose.model('Comment', {
  userId: String,
  videoId: String,
  content: String,
  createdAt: Date,
  updatedAt: Date
});

// Like video
app.post('/like', async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const like = new Like({ userId, videoId, createdAt: new Date() });
    await like.save();

    // Update cache
    const likesCount = await Like.countDocuments({ videoId });
    await setAsync(`likes:${videoId}`, likesCount, 'EX', 3600);

    // Send to Kafka
    producer.send([{ topic: 'user-actions', messages: JSON.stringify({ action: 'like', userId, videoId }) }], (err) => {
      if (err) console.error('Error sending to Kafka:', err);
    });

    res.status(201).json({ message: 'Like added' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding like' });
  }
});

// Add comment
app.post('/comment', async (req, res) => {
  try {
    const { userId, videoId, content } = req.body;
    const comment = new Comment({
      userId,
      videoId,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await comment.save();

    // Send to Kafka
    producer.send([{ topic: 'user-actions', messages: JSON.stringify({ action: 'comment', userId, videoId, commentId: comment._id }) }], (err) => {
      if (err) console.error('Error sending to Kafka:', err);
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Get likes count
app.get('/likes/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const cachedLikes = await getAsync(`likes:${videoId}`);
    if (cachedLikes) {
      return res.json({ likes: parseInt(cachedLikes) });
    }
    const likesCount = await Like.countDocuments({ videoId });
    await setAsync(`likes:${videoId}`, likesCount, 'EX', 3600);
    res.json({ likes: likesCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching likes count' });
  }
});

// Get comments
app.get('/comments/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId }).sort('-createdAt').limit(10);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

const port = 3002;
app.listen(port, () => console.log(`Interaction service listening on port ${port}`));
