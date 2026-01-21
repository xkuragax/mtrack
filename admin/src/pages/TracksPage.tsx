import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Track, Song } from '../types';
import { api } from '../services/api';

export const TracksPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [trackOrder, setTrackOrder] = useState('0');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [songId]);

  const fetchData = async () => {
    if (!songId) return;
    try {
      const [songResponse, tracksResponse] = await Promise.all([
        api.songs.getById(parseInt(songId)),
        api.tracks.getBySong(parseInt(songId)),
      ]);
      setSong(songResponse.data);
      setTracks(tracksResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackFile || !songId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('audio', trackFile);
    formData.append('name', trackName);
    formData.append('order', trackOrder);

    try {
      await api.tracks.create(parseInt(songId), formData);
      setTrackName('');
      setTrackFile(null);
      setTrackOrder('0');
      fetchData();
    } catch (err) {
      alert('Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      await api.tracks.delete(id);
      setTracks(tracks.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete track');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="tracks-page">
      <div className="page-header">
        <div>
          <button onClick={() => navigate(`/admin/albums/${song?.album_id}/songs`)} className="btn-back">
            ← Back to Songs
          </button>
          <h1>{song?.title} - Tracks</h1>
        </div>
      </div>

      <div className="upload-section">
        <h2>Upload New Track</h2>
        <form onSubmit={handleUpload} className="admin-form">
          <div className="form-group">
            <label>Track Name *</label>
            <input
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="e.g., Vocals, Guitar, Drums"
              required
            />
          </div>
          <div className="form-group">
            <label>Audio File *</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setTrackFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="form-group">
            <label>Order</label>
            <input
              type="number"
              value={trackOrder}
              onChange={(e) => setTrackOrder(e.target.value)}
            />
          </div>
          <button type="submit" disabled={uploading} className="btn-primary">
            {uploading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>
      </div>

      <div className="tracks-table">
        <h2>Uploaded Tracks</h2>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Audio URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track) => (
              <tr key={track.id}>
                <td>{track.order}</td>
                <td>{track.name}</td>
                <td>
                  <audio controls src={track.audio_url} className="audio-preview" />
                </td>
                <td>
                  <button onClick={() => handleDelete(track.id)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tracks.length === 0 && (
          <div className="empty-state">No tracks yet. Upload one to get started!</div>
        )}
      </div>
    </div>
  );
};
