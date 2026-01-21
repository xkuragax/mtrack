import { useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';

interface TrackState {
  volume: number;
  muted: boolean;
  solo: boolean;
}

export const useMultiTrackPlayer = (tracks: Track[]) => {
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackStates, setTrackStates] = useState<Map<number, TrackState>>(new Map());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initialStates = new Map<number, TrackState>();
    tracks.forEach(track => {
      const audio = new Audio(track.audio_url);
      audio.preload = 'metadata';
      audioRefs.current.set(track.id, audio);
      initialStates.set(track.id, { volume: 100, muted: false, solo: false });

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration > duration) {
          setDuration(audio.duration);
        }
      });
    });
    setTrackStates(initialStates);

    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tracks]);

  const updateCurrentTime = useCallback(() => {
    const firstAudio = Array.from(audioRefs.current.values())[0];
    if (firstAudio) {
      setCurrentTime(firstAudio.currentTime);
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateCurrentTime]);

  const play = useCallback(async () => {
    const playPromises = Array.from(audioRefs.current.values()).map(audio => audio.play());
    await Promise.all(playPromises);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRefs.current.forEach(audio => audio.pause());
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    audioRefs.current.forEach(audio => {
      audio.currentTime = time;
    });
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((trackId: number, volume: number) => {
    const audio = audioRefs.current.get(trackId);
    const state = trackStates.get(trackId);
    if (audio && state) {
      const newStates = new Map(trackStates);
      newStates.set(trackId, { ...state, volume });
      setTrackStates(newStates);
      audio.volume = volume / 100;
    }
  }, [trackStates]);

  const toggleMute = useCallback((trackId: number) => {
    const audio = audioRefs.current.get(trackId);
    const state = trackStates.get(trackId);
    if (audio && state) {
      const newMuted = !state.muted;
      const newStates = new Map(trackStates);
      newStates.set(trackId, { ...state, muted: newMuted });
      setTrackStates(newStates);
      audio.muted = newMuted;
    }
  }, [trackStates]);

  const toggleSolo = useCallback((trackId: number) => {
    const state = trackStates.get(trackId);
    if (!state) return;

    const newStates = new Map(trackStates);
    const newSolo = !state.solo;

    const anySolo = Array.from(trackStates.values()).some(s => s.solo);

    if (!anySolo || newSolo) {
      newStates.forEach((s, id) => {
        if (id === trackId) {
          newStates.set(id, { ...s, solo: newSolo });
        } else {
          newStates.set(id, { ...s, solo: false });
        }
      });
    } else {
      newStates.set(trackId, { ...state, solo: false });
    }

    setTrackStates(newStates);

    const hasSolo = Array.from(newStates.values()).some(s => s.solo);
    audioRefs.current.forEach((audio, id) => {
      const trackState = newStates.get(id);
      if (trackState) {
        if (hasSolo) {
          audio.muted = !trackState.solo;
        } else {
          audio.muted = trackState.muted;
        }
      }
    });
  }, [trackStates]);

  return {
    isPlaying,
    currentTime,
    duration,
    trackStates,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleSolo,
  };
};
