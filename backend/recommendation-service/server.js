const express = require('express');
const mongoose = require('mongoose');
const kafka = require('kafka-node');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongodb-0.mongodb,mongodb-1.mongodb,mongodb-2.mongodb:27017/recommendations', { useNewUrlParser: true, useUnifiedTopology: true });

// Redis connection
const redisClient = redis.createClient({ host: 'redis-service' });
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Kafka consumer
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka-service:9092' });
const consumer = new Consumer(client, [{ topic: 'user-actions' }], { autoCommit: true });

// UserAction model
const UserAction = mongoose.model('UserAction', {
  userId: String,
  videoId: String,
  action: String,
  createdAt: Date
});

// Process user actions from Kafka
consumer.on('message', async (message) => {
  try {
    const action = JSON.parse(message.value);
    const userAction = new UserAction({
      userId: action.userId,
      videoId: action.videoId,
      action: action.action,
      createdAt: new Date()
    });
    await userAction.save();
  } catch (error) {
    console.error('Error processing Kafka message:', error);
  }
});

// Get recommendations
app.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cachedRecommendations = await getAsync(`recommendations:${userId}`);
    if (cachedRecommendations) {
      return res.json(JSON.parse(cachedRecommendations));
    }

    // Simple recommendation algorithm (most interacted videos)
    const userActions = await UserAction.aggregate([
      { $match: { userId } },
      { $group: { _id: '$videoId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const recommendedVideoIds = userActions.map(action => action._id);
    // Fetch video details (assuming we have a Video model)
    const Video = mongoose.model('Video', {
        _id: String,
        title: String,
        thumbnailUrl: String
      });
  
      const recommendations = await Video.find({ _id: { $in: recommendedVideoIds } });
  
      // Cache the recommendations
      await setAsync(`recommendations:${userId}`, JSON.stringify(recommendations), 'EX', 3600);
  
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching recommendations' });
    }
  });
  
  const port = 3003;
  app.listen(port, () => console.log(`Recommendation service listening on port ${port}`));