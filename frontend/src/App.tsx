import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlbumsPage } from './pages/AlbumsPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { SongPlayerPage } from './pages/SongPlayerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<AlbumsPage />} />
          <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
          <Route path="/songs/:songId" element={<SongPlayerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
