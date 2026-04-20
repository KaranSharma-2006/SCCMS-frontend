import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FilePlus, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === 'ADMIN';

  return (
    <nav style={{
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 20px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          color: 'var(--primary-color)',
          textDecoration: 'none'
        }}>
          🌆 SmartCity
        </Link>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {isAdmin ? (
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          ) : (
            <>
              <Link to="/user/dashboard" className="nav-link">My Complaints</Link>
              <Link to="/user/submit-complaint" className="nav-link">Submit Complaint</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <User size={18} />
          <span style={{ fontWeight: '500' }}>{user ? (isAdmin ? 'Admin' : user.name) : 'User'}</span>
        </div>
        <button onClick={logout} className="btn" style={{ 
          color: 'var(--danger)', 
          background: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <style>{`
        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary-color);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
