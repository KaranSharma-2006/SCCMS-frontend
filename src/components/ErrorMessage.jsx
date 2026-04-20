import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      borderRadius: 'var(--radius)',
      marginBottom: '20px',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid #fecaca'
    }}>
      {message}
    </div>
  );
};

export default ErrorMessage;
