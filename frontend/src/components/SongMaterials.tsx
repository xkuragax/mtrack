import { Material } from '../types';

interface SongMaterialsProps {
  materials: Material[];
}

export const SongMaterials = ({ materials }: SongMaterialsProps) => {
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'lyrics':
        return '📝';
      case 'chords':
        return '🎸';
      case 'tabs':
        return '🎼';
      default:
        return '📄';
    }
  };

  const getMaterialLabel = (type: string) => {
    switch (type) {
      case 'lyrics':
        return 'Lyrics';
      case 'chords':
        return 'Chords';
      case 'tabs':
        return 'Tabs';
      default:
        return type;
    }
  };

  if (materials.length === 0) {
    return (
      <div className="song-materials">
        <h3>Materials</h3>
        <p>No materials available for this song.</p>
      </div>
    );
  }

  return (
    <div className="song-materials">
      <h3>Materials</h3>
      <div className="materials-list">
        {materials.map(material => (
          <a
            key={material.id}
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="material-link"
          >
            <span className="material-icon">{getMaterialIcon(material.type)}</span>
            <span className="material-label">{getMaterialLabel(material.type)}</span>
            <span className="material-action">Download</span>
          </a>
        ))}
      </div>
    </div>
  );
};
