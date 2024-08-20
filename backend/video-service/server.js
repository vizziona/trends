const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const pulsar = require('pulsar-client');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongodb-0.mongodb,mongodb-1.mongodb,mongodb-2.mongodb:27017/videos', { useNewUrlParser: true, useUnifiedTopology: true });

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

// Pulsar client
const pulsarClient = new pulsar.Client({
  serviceUrl: 'pulsar://pulsar-service:6650'
});

const producer = pulsarClient.createProducer({
  topic: 'video-processing'
});

// Video model
const Video = mongoose.model('Video', {
  userId: String,
  title: String,
  description: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: Number,
  views: { type: Number, default: 0 },
  createdAt: Date,
  updatedAt: Date
});

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });

// Upload video
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
    const video = new Video({
      userId,
      title,
      description,
      videoUrl: result.secure_url,
      thumbnailUrl: result.thumbnail_url,
      duration: result.duration,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await video.save();

    // Send message to Pulsar for video processing
    await producer.send({
      data: Buffer.from(JSON.stringify({ videoId: video._id }))
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading video' });
  }
});

// Get video
app.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching video' });
  }
});

const port = 3001;
app.listen(port, () => console.log(`Video service listening on port ${port}`));
