const pool = require('../config/db');

exports.getAlbums = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM albums ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const cover_url = req.file ? `/uploads/covers/${req.file.filename}` : null;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO albums (title, description, cover_url) VALUES ($1, $2, $3) RETURNING *',
      [title, description, cover_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const cover_url = req.file ? `/uploads/covers/${req.file.filename}` : undefined;

    const existingAlbum = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
    if (existingAlbum.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    let query = 'UPDATE albums SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP';
    let params = [title || existingAlbum.rows[0].title, description !== undefined ? description : existingAlbum.rows[0].description];

    if (cover_url) {
      query += ', cover_url = $3 WHERE id = $4 RETURNING *';
      params.push(cover_url, id);
    } else {
      query += ' WHERE id = $3 RETURNING *';
      params.push(id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
