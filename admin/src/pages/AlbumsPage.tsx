import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Album } from '../types';
import { api } from '../services/api';

export const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await api.albums.getAll();
      setAlbums(response.data);
    } catch (err) {
      console.error('Error fetching albums:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this album?')) return;

    try {
      await api.albums.delete(id);
      setAlbums(albums.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete album');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="albums-page">
      <div className="page-header">
        <h1>Albums</h1>
        <button onClick={() => navigate('/admin/albums/new')} className="btn-primary">
          Add Album
        </button>
      </div>
      <div className="albums-table">
        <table>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr key={album.id}>
                <td>
                  {album.cover_url ? (
                    <img src={album.cover_url} alt={album.title} className="table-thumbnail" />
                  ) : (
                    <div className="table-thumbnail-placeholder">No cover</div>
                  )}
                </td>
                <td>{album.title}</td>
                <td>{album.description || '-'}</td>
                <td>
                  <button onClick={() => navigate(`/admin/albums/${album.id}/songs`)} className="btn-secondary">
                    Songs
                  </button>
                  <button onClick={() => navigate(`/admin/albums/${album.id}/edit`)} className="btn-secondary">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(album.id)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {albums.length === 0 && (
          <div className="empty-state">No albums yet. Create one to get started!</div>
        )}
      </div>
    </div>
  );
};
