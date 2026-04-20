import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BarChart2, CheckCircle, Clock, AlertCircle, ExternalLink, Mail, User } from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchAllComplaints = async () => {
      try {
        const response = await axiosInstance.get('/complaints');
        const data = response.data.data;
        setComplaints(data);
        
        // Calculate stats
        const newStats = {
          total: data.length,
          pending: data.filter(c => c.status === 'PENDING').length,
          inProgress: data.filter(c => c.status === 'IN_PROGRESS').length,
          resolved: data.filter(c => c.status === 'RESOLVED').length
        };
        setStats(newStats);
      } catch (err) {
        setError('Failed to load system complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllComplaints();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Total Complaints" value={stats.total} icon={<BarChart2 size={24} />} color="#3b82f6" />
        <StatCard title="Pending" value={stats.pending} icon={<AlertCircle size={24} />} color="#eab308" />
        <StatCard title="In Progress" value={stats.inProgress} icon={<Clock size={24} />} color="#1d4ed8" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle size={24} />} color="#22c55e" />
      </div>

      <ErrorMessage message={error} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Complaint Title</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>#{complaint.id}</td>
                  <td style={{ fontWeight: '600' }}>{complaint.title}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: '500' }}>
                        <User size={14} /> {complaint.userName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <Mail size={12} /> {complaint.userEmail}
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={complaint.status} /></td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</td>
                  <td>
                    <Link to={`/admin/complaint/${complaint.id}`} style={{ 
                      color: 'var(--primary-color)', 
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      Manage <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  No complaints found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ 
    background: 'white', 
    padding: '24px', 
    borderRadius: 'var(--radius)', 
    boxShadow: 'var(--shadow)',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem', textTransform: 'uppercase' }}>{title}</span>
      <div style={{ color }}>{icon}</div>
    </div>
    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

export default AdminDashboard;
