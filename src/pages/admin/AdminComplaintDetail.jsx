import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowLeft, Calendar, FileText, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    status: '',
    adminReply: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await axiosInstance.get(`/complaints/${id}`);
      const data = response.data.data;
      setComplaint(data);
      setFormData({
        status: data.status,
        adminReply: data.adminReply || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setSuccess('');
    setUpdating(true);

    try {
      await axiosInstance.put(`/complaints/${id}/status`, formData);
      setSuccess('Complaint status updated successfully!');
      fetchComplaint(); // Refresh data
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update complaint status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!complaint) return <ErrorMessage message="Complaint not found." />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/admin/dashboard" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: 'var(--text-secondary)', 
        textDecoration: 'none',
        marginBottom: '24px',
        fontWeight: '500'
      }}>
        <ArrowLeft size={18} /> Back to All Complaints
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Left Side: Complaint Details */}
        <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{complaint.title}</h2>
            <StatusBadge status={complaint.status} />
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> {new Date(complaint.createdAt).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> {complaint.category}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Submitted By</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius)' }}>
              <div style={{ padding: '8px', background: 'white', borderRadius: '50%' }}>
                <User size={20} color="var(--primary-color)" />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{complaint.userName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{complaint.userEmail}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Description</h4>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {complaint.description}
            </p>
          </div>

          {complaint.adminReply && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>Previous Admin Response</h4>
              <div style={{ padding: '16px', backgroundColor: '#f0f9ff', borderRadius: 'var(--radius)', borderLeft: '4px solid #3b82f6' }}>
                <p style={{ color: '#1e3a8a', fontSize: '0.925rem' }}>{complaint.adminReply}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Update Panel */}
        <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content', position: 'sticky', top: '88px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--primary-color)" /> Manage Status
          </h3>

          <ErrorMessage message={updateError} />
          {success && <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: '16px', fontWeight: '500' }}>{success}</div>}

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Update Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Official Response</label>
              <textarea 
                rows="6" 
                placeholder="Enter details for the citizen..."
                value={formData.adminReply}
                onChange={(e) => setFormData({ ...formData, adminReply: e.target.value })}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
              disabled={updating}
            >
              {updating ? 'Updating...' : (
                <>
                  Update Complaint <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
