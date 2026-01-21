import { Song } from '../types';

interface SongListProps {
  songs: Song[];
  onSongClick: (songId: number) => void;
}

export const SongList = ({ songs, onSongClick }: SongListProps) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={song.id} className="song-item">
          <span className="song-number">{index + 1}</span>
          <span className="song-title">{song.title}</span>
          <span className="song-duration">{formatDuration(song.duration)}</span>
          <button onClick={() => onSongClick(song.id)} className="btn-play">
            Play
          </button>
        </div>
      ))}
    </div>
  );
};
