import axios from 'axios';
import { Album, Song, Track, Material } from '../types';

const API_BASE_URL = '/api';

export const api = {
  albums: {
    getAll: () => axios.get<Album[]>(`${API_BASE_URL}/albums`),
    getById: (id: number) => axios.get<Album>(`${API_BASE_URL}/albums/${id}`),
  },
  
  songs: {
    getByAlbum: (albumId: number) => axios.get<Song[]>(`${API_BASE_URL}/albums/${albumId}/songs`),
    getById: (id: number) => axios.get<Song>(`${API_BASE_URL}/songs/${id}`),
  },
  
  tracks: {
    getBySong: (songId: number) => axios.get<Track[]>(`${API_BASE_URL}/songs/${songId}/tracks`),
  },
  
  materials: {
    getBySong: (songId: number) => axios.get<Material[]>(`${API_BASE_URL}/songs/${songId}/materials`),
  },
};
