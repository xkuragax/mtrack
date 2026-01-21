import { Track } from '../types';
import { useMultiTrackPlayer } from '../hooks/useMultiTrackPlayer';

interface MultiTrackPlayerProps {
  tracks: Track[];
}

export const MultiTrackPlayer = ({ tracks }: MultiTrackPlayerProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    trackStates,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleSolo,
  } = useMultiTrackPlayer(tracks);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  return (
    <div className="multitrack-player">
      <div className="player-controls">
        <button onClick={togglePlay} className="btn-play-pause">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
        />
      </div>

      <div className="tracks-container">
        <h3>Tracks</h3>
        {tracks.map(track => {
          const state = trackStates.get(track.id);
          if (!state) return null;

          return (
            <div key={track.id} className="track-control">
              <div className="track-name">{track.name}</div>
              <div className="track-controls">
                <button
                  onClick={() => toggleMute(track.id)}
                  className={`btn-mute ${state.muted ? 'active' : ''}`}
                >
                  {state.muted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={() => toggleSolo(track.id)}
                  className={`btn-solo ${state.solo ? 'active' : ''}`}
                >
                  Solo
                </button>
                <div className="volume-control">
                  <label>Volume: {state.volume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={state.volume}
                    onChange={(e) => setVolume(track.id, parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
