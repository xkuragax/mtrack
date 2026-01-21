import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-content">
          <h1>Multi-Track Player Admin</h1>
          <div className="header-actions">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
};
