const pool = require('../config/db');

exports.getTracksBySong = async (req, res) => {
  try {
    const { songId } = req.params;
    const result = await pool.query(
      'SELECT * FROM tracks WHERE song_id = $1 ORDER BY "order" ASC',
      [songId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createTrack = async (req, res) => {
  try {
    const { songId } = req.params;
    const { name, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Track name is required' });
    }

    const audio_url = `/uploads/tracks/${req.file.filename}`;

    const result = await pool.query(
      'INSERT INTO tracks (song_id, name, audio_url, "order") VALUES ($1, $2, $3, $4) RETURNING *',
      [songId, name, audio_url, order || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tracks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
