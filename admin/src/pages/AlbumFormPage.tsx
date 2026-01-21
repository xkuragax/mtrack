import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export const AlbumFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      fetchAlbum();
    }
  }, [id]);

  const fetchAlbum = async () => {
    if (!id) return;
    try {
      const response = await api.albums.getById(parseInt(id));
      setTitle(response.data.title);
      setDescription(response.data.description || '');
    } catch (err) {
      console.error('Error fetching album:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (cover) {
      formData.append('cover', cover);
    }

    try {
      if (isEdit) {
        await api.albums.update(parseInt(id!), formData);
      } else {
        await api.albums.create(formData);
      }
      navigate('/admin');
    } catch (err) {
      alert('Failed to save album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Album' : 'New Album'}</h1>
        <button onClick={() => navigate('/admin')} className="btn-secondary">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : 'Save Album'}
        </button>
      </form>
    </div>
  );
};
