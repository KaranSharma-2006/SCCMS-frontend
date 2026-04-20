import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { PlusCircle, ExternalLink } from 'lucide-react';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get('/complaints/my');
        setComplaints(response.data.data);
      } catch (err) {
        setError('Failed to load complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Welcome back, {user?.name}!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your submitted complaints.</p>
        </div>
        <Link to="/user/submit-complaint" className="btn btn-primary">
          <PlusCircle size={20} /> Submit New Complaint
        </Link>
      </div>

      <ErrorMessage message={error} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td style={{ fontWeight: '500' }}>{complaint.title}</td>
                  <td>{complaint.category}</td>
                  <td><StatusBadge status={complaint.status} /></td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</td>
                  <td>
                    <Link to={`/user/complaint/${complaint.id}`} style={{ 
                      color: 'var(--primary-color)', 
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      View Details <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  You haven't submitted any complaints yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
