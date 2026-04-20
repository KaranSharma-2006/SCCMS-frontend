import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '32px', color: 'var(--text-primary)' }}>Admin Panel</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
