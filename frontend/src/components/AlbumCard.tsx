import { Album } from '../types';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  return (
    <div className="album-card" onClick={onClick}>
      <div className="album-cover">
        {album.cover_url ? (
          <img src={album.cover_url} alt={album.title} />
        ) : (
          <div className="album-cover-placeholder">No Cover</div>
        )}
      </div>
      <div className="album-info">
        <h3>{album.title}</h3>
        {album.description && <p>{album.description}</p>}
      </div>
    </div>
  );
};
