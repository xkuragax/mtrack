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
      {/* Mobile-First Player Controls */}
      <div className="player-controls">
        <button 
          onClick={togglePlay} 
          className="btn-play-pause"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Mobile-First Progress Bar */}
      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
          aria-label="Seek through track"
        />
      </div>

      {/* Mobile-First Tracks Container */}
      <div className="tracks-container">
        <h3>🎛️ Individual Track Controls</h3>
        {tracks.map((track, index) => {
          const state = trackStates.get(track.id);
          if (!state) return null;

          return (
            <div key={track.id} className="track-control">
              <div className="track-name">
                🎵 {track.name}
              </div>
              <div className="track-controls">
                {/* Mobile-First Volume Control */}
                <div className="volume-control">
                  <label>🔊 Volume: {state.volume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={state.volume}
                    onChange={(e) => setVolume(track.id, parseInt(e.target.value))}
                    aria-label={`Volume for ${track.name}`}
                  />
                </div>
                
                {/* Mobile-First Mute Button */}
                <button
                  onClick={() => toggleMute(track.id)}
                  className={`btn-mute ${state.muted ? 'active' : ''}`}
                  aria-label={`${state.muted ? 'Unmute' : 'Mute'} ${track.name}`}
                >
                  {state.muted ? '🔇' : '🔊'} {state.muted ? 'Unmute' : 'Mute'}
                </button>
                
                {/* Mobile-First Solo Button */}
                <button
                  onClick={() => toggleSolo(track.id)}
                  className={`btn-solo ${state.solo ? 'active' : ''}`}
                  aria-label={`${state.solo ? 'Stop soloing' : 'Solo'} ${track.name}`}
                >
                  🎯 {state.solo ? 'Soloing' : 'Solo'}
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Mobile-First Solo Status Indicator */}
        {Array.from(trackStates.values()).some(s => s.solo) && (
          <div className="solo-status" role="status" aria-live="polite">
            🎯 Solo mode active - only selected tracks are audible
          </div>
        )}
      </div>
    </div>
  );
};
