import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Song, Album } from '../types';
import { api } from '../services/api';

export const SongsPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [albumId]);

  const fetchData = async () => {
    if (!albumId) return;
    try {
      const [albumResponse, songsResponse] = await Promise.all([
        api.albums.getById(parseInt(albumId)),
        api.songs.getByAlbum(parseInt(albumId)),
      ]);
      setAlbum(albumResponse.data);
      setSongs(songsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      await api.songs.delete(id);
      setSongs(songs.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete song');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="songs-page">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/admin')} className="btn-back">
            ← Back to Albums
          </button>
          <h1>{album?.title} - Songs</h1>
        </div>
        <button onClick={() => navigate(`/admin/albums/${albumId}/songs/new`)} className="btn-primary">
          Add Song
        </button>
      </div>
      <div className="songs-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td>{song.title}</td>
                <td>{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '-'}</td>
                <td>
                  <button onClick={() => navigate(`/admin/songs/${song.id}/tracks`)} className="btn-secondary">
                    Tracks
                  </button>
                  <button onClick={() => navigate(`/admin/songs/${song.id}/materials`)} className="btn-secondary">
                    Materials
                  </button>
                  <button onClick={() => navigate(`/admin/songs/${song.id}/edit`)} className="btn-secondary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(song.id)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {songs.length === 0 && (
          <div className="empty-state">No songs yet. Create one to get started!</div>
        )}
      </div>
    </div>
  );
};
