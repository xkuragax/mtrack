import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { AlbumFormPage } from './pages/AlbumFormPage';
import { SongsPage } from './pages/SongsPage';
import { SongFormPage } from './pages/SongFormPage';
import { TracksPage } from './pages/TracksPage';
import { MaterialsPage } from './pages/MaterialsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AlbumsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/albums/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AlbumFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/albums/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AlbumFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/albums/:albumId/songs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SongsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/albums/:albumId/songs/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SongFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/songs/:songId/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SongFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/songs/:songId/tracks"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TracksPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/songs/:songId/materials"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MaterialsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
