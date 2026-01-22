import axios from 'axios';
import { Album, Song, Track, Material, AuthResponse } from '../types';

// Use environment variable for production, relative path for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    login: (username: string, password: string) =>
      axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { username, password }),
    logout: () => axios.post(`${API_BASE_URL}/auth/logout`, {}, { headers: getAuthHeader() }),
  },

  albums: {
    getAll: () => axios.get<Album[]>(`${API_BASE_URL}/albums`),
    getById: (id: number) => axios.get<Album>(`${API_BASE_URL}/albums/${id}`),
    create: (formData: FormData) =>
      axios.post<Album>(`${API_BASE_URL}/albums`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      }),
    update: (id: number, formData: FormData) =>
      axios.put<Album>(`${API_BASE_URL}/albums/${id}`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: number) =>
      axios.delete(`${API_BASE_URL}/albums/${id}`, { headers: getAuthHeader() }),
  },

  songs: {
    getByAlbum: (albumId: number) => axios.get<Song[]>(`${API_BASE_URL}/albums/${albumId}/songs`),
    getById: (id: number) => axios.get<Song>(`${API_BASE_URL}/songs/${id}`),
    create: (data: Partial<Song>) =>
      axios.post<Song>(`${API_BASE_URL}/songs`, data, { headers: getAuthHeader() }),
    update: (id: number, data: Partial<Song>) =>
      axios.put<Song>(`${API_BASE_URL}/songs/${id}`, data, { headers: getAuthHeader() }),
    delete: (id: number) =>
      axios.delete(`${API_BASE_URL}/songs/${id}`, { headers: getAuthHeader() }),
  },

  tracks: {
    getBySong: (songId: number) => axios.get<Track[]>(`${API_BASE_URL}/songs/${songId}/tracks`),
    create: (songId: number, formData: FormData) =>
      axios.post<Track>(`${API_BASE_URL}/songs/${songId}/tracks`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: number) =>
      axios.delete(`${API_BASE_URL}/tracks/${id}`, { headers: getAuthHeader() }),
  },

  materials: {
    getBySong: (songId: number) => axios.get<Material[]>(`${API_BASE_URL}/songs/${songId}/materials`),
    create: (songId: number, formData: FormData) =>
      axios.post<Material>(`${API_BASE_URL}/songs/${songId}/materials`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: number) =>
      axios.delete(`${API_BASE_URL}/materials/${id}`, { headers: getAuthHeader() }),
  },
};
