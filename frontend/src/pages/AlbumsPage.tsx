import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Album } from '../types';
import { api } from '../services/api';
import { AlbumCard } from '../components/AlbumCard';

export const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.albums.getAll();
        setAlbums(response.data);
      } catch (err) {
        setError('Failed to load albums');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) return <div className="loading">Loading albums...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="albums-page">
      <header>
        <h1>Multi-Track Player</h1>
        <p>Select an album to view songs</p>
      </header>
      <div className="albums-grid">
        {albums.map(album => (
          <AlbumCard
            key={album.id}
            album={album}
            onClick={() => navigate(`/albums/${album.id}`)}
          />
        ))}
      </div>
      {albums.length === 0 && (
        <div className="empty-state">
          <p>No albums available yet.</p>
        </div>
      )}
    </div>
  );
};
