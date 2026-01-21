const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const albumRoutes = require('./routes/albums');
const songRoutes = require('./routes/songs');
const trackRoutes = require('./routes/tracks');
const materialRoutes = require('./routes/materials');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/materials', materialRoutes);

app.get('/api/albums/:albumId/songs', async (req, res) => {
  const songController = require('./controllers/songController');
  songController.getSongsByAlbum(req, res);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
