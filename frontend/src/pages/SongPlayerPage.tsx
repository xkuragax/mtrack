import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Song, Track, Material } from '../types';
import { api } from '../services/api';
import { MultiTrackPlayer } from '../components/MultiTrackPlayer';
import { SongMaterials } from '../components/SongMaterials';

export const SongPlayerPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!songId) return;

      try {
        const [songResponse, tracksResponse, materialsResponse] = await Promise.all([
          api.songs.getById(parseInt(songId)),
          api.tracks.getBySong(parseInt(songId)),
          api.materials.getBySong(parseInt(songId)),
        ]);
        setSong(songResponse.data);
        setTracks(tracksResponse.data);
        setMaterials(materialsResponse.data);
      } catch (err) {
        setError('Failed to load song');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [songId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!song) return <div className="error">Song not found</div>;

  return (
    <div className="song-player-page">
      <button onClick={() => navigate(`/albums/${song.album_id}`)} className="btn-back">
        ← Back to Album
      </button>
      <div className="song-header">
        <h1>{song.title}</h1>
      </div>
      {tracks.length > 0 ? (
        <MultiTrackPlayer tracks={tracks} />
      ) : (
        <div className="empty-state">
          <p>No tracks available for this song.</p>
        </div>
      )}
      <SongMaterials materials={materials} />
    </div>
  );
};
