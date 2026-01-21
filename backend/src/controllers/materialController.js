const pool = require('../config/db');

exports.getMaterialsBySong = async (req, res) => {
  try {
    const { songId } = req.params;
    const result = await pool.query(
      'SELECT * FROM song_materials WHERE song_id = $1 ORDER BY created_at ASC',
      [songId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { songId } = req.params;
    const { type, url } = req.body;

    if (!type || (!url && !req.file)) {
      return res.status(400).json({ error: 'Type and URL (or file) are required' });
    }

    const validTypes = ['lyrics', 'chords', 'tabs'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be one of: lyrics, chords, tabs' });
    }

    const materialUrl = req.file ? `/uploads/materials/${req.file.filename}` : url;

    const result = await pool.query(
      'INSERT INTO song_materials (song_id, type, url) VALUES ($1, $2, $3) RETURNING *',
      [songId, type, materialUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM song_materials WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
