import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowLeft, Send } from 'lucide-react';

const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/complaints', formData);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
        <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Submit a Complaint</h2>
        <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>
          Provide details about the issue you've encountered. City officials will review it shortly.
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title"
              required 
              value={formData.title} 
              onChange={handleChange}
              placeholder="Brief summary of the issue"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              required 
              value={formData.category} 
              onChange={handleChange}
            >
              <option value="">Select a Category</option>
              <option value="ROAD">Roads & Transport</option>
              <option value="WATER">Water Supply</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="SANITATION">Sanitation & Waste</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              required 
              rows="5"
              value={formData.description} 
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : (
              <>
                Submit Complaint <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
