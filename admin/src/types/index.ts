export interface Album {
  id: number;
  title: string;
  description?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: number;
  album_id: number;
  title: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: number;
  song_id: number;
  name: string;
  audio_url: string;
  order: number;
  created_at: string;
}

export interface Material {
  id: number;
  song_id: number;
  type: 'lyrics' | 'chords' | 'tabs';
  url: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
