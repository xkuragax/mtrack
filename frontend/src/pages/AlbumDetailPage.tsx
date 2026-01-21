import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Album, Song } from '../types';
import { api } from '../services/api';
import { SongList } from '../components/SongList';

export const AlbumDetailPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        setError('Failed to load album details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albumId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!album) return <div className="error">Album not found</div>;

  return (
    <div className="album-detail-page">
      <button onClick={() => navigate('/')} className="btn-back">
        ← Back to Albums
      </button>
      <div className="album-header">
        {album.cover_url && (
          <img src={album.cover_url} alt={album.title} className="album-cover-large" />
        )}
        <div className="album-info">
          <h1>{album.title}</h1>
          {album.description && <p>{album.description}</p>}
          <p className="song-count">{songs.length} songs</p>
        </div>
      </div>
      <SongList songs={songs} onSongClick={(songId) => navigate(`/songs/${songId}`)} />
    </div>
  );
};
