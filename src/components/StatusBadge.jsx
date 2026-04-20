import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toUpperCase() : 'PENDING';
  const badgeClass = `badge badge-${normalizedStatus.toLowerCase()}`;
  
  return (
    <span className={badgeClass}>
      {normalizedStatus.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
