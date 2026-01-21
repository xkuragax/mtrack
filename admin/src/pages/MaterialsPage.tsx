import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Material, Song } from '../types';
import { api } from '../services/api';

export const MaterialsPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [materialType, setMaterialType] = useState<'lyrics' | 'chords' | 'tabs'>('lyrics');
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [materialUrl, setMaterialUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [songId]);

  const fetchData = async () => {
    if (!songId) return;
    try {
      const [songResponse, materialsResponse] = await Promise.all([
        api.songs.getById(parseInt(songId)),
        api.materials.getBySong(parseInt(songId)),
      ]);
      setSong(songResponse.data);
      setMaterials(materialsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!materialFile && !materialUrl) || !songId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('type', materialType);
    if (materialFile) {
      formData.append('file', materialFile);
    } else {
      formData.append('url', materialUrl);
    }

    try {
      await api.materials.create(parseInt(songId), formData);
      setMaterialFile(null);
      setMaterialUrl('');
      fetchData();
    } catch (err) {
      alert('Failed to add material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await api.materials.delete(id);
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (err) {
      alert('Failed to delete material');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="materials-page">
      <div className="page-header">
        <div>
          <button onClick={() => navigate(`/admin/albums/${song?.album_id}/songs`)} className="btn-back">
            ← Back to Songs
          </button>
          <h1>{song?.title} - Materials</h1>
        </div>
      </div>

      <div className="upload-section">
        <h2>Add Material</h2>
        <form onSubmit={handleUpload} className="admin-form">
          <div className="form-group">
            <label>Type *</label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value as 'lyrics' | 'chords' | 'tabs')}
            >
              <option value="lyrics">Lyrics</option>
              <option value="chords">Chords</option>
              <option value="tabs">Tabs</option>
            </select>
          </div>
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => {
                setMaterialFile(e.target.files?.[0] || null);
                setMaterialUrl('');
              }}
            />
          </div>
          <div className="form-group">
            <label>OR Enter URL (e.g., Google Drive link)</label>
            <input
              type="url"
              value={materialUrl}
              onChange={(e) => {
                setMaterialUrl(e.target.value);
                setMaterialFile(null);
              }}
              placeholder="https://..."
            />
          </div>
          <button type="submit" disabled={uploading || (!materialFile && !materialUrl)} className="btn-primary">
            {uploading ? 'Adding...' : 'Add Material'}
          </button>
        </form>
      </div>

      <div className="materials-table">
        <h2>Materials</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td>{material.type}</td>
                <td>
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    {material.url}
                  </a>
                </td>
                <td>
                  <button onClick={() => handleDelete(material.id)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {materials.length === 0 && (
          <div className="empty-state">No materials yet. Add one to get started!</div>
        )}
      </div>
    </div>
  );
};
