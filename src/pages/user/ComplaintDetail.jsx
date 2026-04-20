import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowLeft, Calendar, FileText, User, MessageCircle } from 'lucide-react';

const ComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axiosInstance.get(`/complaints/${id}`);
        setComplaint(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!complaint) return <ErrorMessage message="Complaint not found." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/user/dashboard" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        color: 'var(--text-secondary)', 
        textDecoration: 'none',
        marginBottom: '24px',
        fontWeight: '500'
      }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: 'var(--primary-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '8px'
            }}>
              Complaint #{id}
            </span>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{complaint.title}</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Calendar size={16} /> {new Date(complaint.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <FileText size={16} /> {complaint.category}
              </div>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '1rem' }}>Description</h4>
          <p style={{ 
            color: 'var(--text-secondary)', 
            whiteSpace: 'pre-wrap',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius)',
            lineHeight: '1.6'
          }}>
            {complaint.description}
          </p>
        </div>

        {complaint.adminReply && (
          <div style={{ 
            borderTop: '2px solid var(--border-color)', 
            paddingTop: '32px',
            marginTop: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MessageCircle size={20} color="var(--primary-color)" />
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>Official Update</h4>
            </div>
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '20px', 
              borderRadius: 'var(--radius)',
              borderLeft: '4px solid var(--primary-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <User size={16} color="var(--primary-color)" />
                <span style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.875rem' }}>City Administrator</span>
              </div>
              <p style={{ color: '#1e40af', lineHeight: '1.6' }}>
                {complaint.adminReply}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetail;
