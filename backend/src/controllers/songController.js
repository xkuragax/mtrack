const pool = require('../config/db');

exports.getSongsByAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const result = await pool.query(
      'SELECT * FROM songs WHERE album_id = $1 ORDER BY created_at ASC',
      [albumId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createSong = async (req, res) => {
  try {
    const { album_id, title, duration } = req.body;

    if (!album_id || !title) {
      return res.status(400).json({ error: 'Album ID and title are required' });
    }

    const result = await pool.query(
      'INSERT INTO songs (album_id, title, duration) VALUES ($1, $2, $3) RETURNING *',
      [album_id, title, duration || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration } = req.body;

    const existingSong = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
    if (existingSong.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const result = await pool.query(
      'UPDATE songs SET title = $1, duration = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title || existingSong.rows[0].title, duration !== undefined ? duration : existingSong.rows[0].duration, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
