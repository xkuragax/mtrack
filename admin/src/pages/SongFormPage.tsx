import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export const SongFormPage = () => {
  const { albumId, songId } = useParams<{ albumId?: string; songId?: string }>();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = !!songId;

  useEffect(() => {
    if (songId) {
      fetchSong();
    }
  }, [songId]);

  const fetchSong = async () => {
    if (!songId) return;
    try {
      const response = await api.songs.getById(parseInt(songId));
      setTitle(response.data.title);
      setDuration(response.data.duration?.toString() || '');
    } catch (err) {
      console.error('Error fetching song:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title,
      duration: duration ? parseInt(duration) : undefined,
      album_id: albumId ? parseInt(albumId) : undefined,
    };

    try {
      if (isEdit && songId) {
        const response = await api.songs.update(parseInt(songId), data);
        navigate(`/admin/albums/${response.data.album_id}/songs`);
      } else if (albumId) {
        await api.songs.create(data);
        navigate(`/admin/albums/${albumId}/songs`);
      }
    } catch (err) {
      alert('Failed to save song');
    } finally {
      setLoading(false);
    }
  };

  const backUrl = songId
    ? `/admin/albums/${albumId}/songs`
    : `/admin/albums/${albumId}/songs`;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Song' : 'New Song'}</h1>
        <button onClick={() => navigate(backUrl)} className="btn-secondary">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Song'}
        </button>
      </form>
    </div>
  );
};
