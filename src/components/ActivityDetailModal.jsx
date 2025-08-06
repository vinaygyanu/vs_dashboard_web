import React, { useEffect } from 'react';
import './ActivityDetailModal.css';

const ActivityDetailModal = ({ activity, onClose }) => {
  // Add escape key listener to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && activity) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    // Prevent body scroll when modal is open
    if (activity) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [activity, onClose]);

  if (!activity) {
    return null;
  }

  // Format timestamp for better display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-effect" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Activity Details</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <div className="detail-item">
            <strong>Username</strong> {activity.username || 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Email</strong> {activity.email || 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Last Login</strong> {activity.lastLogin ? formatDate(activity.lastLogin) : 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Status</strong> 
            {activity.status ? (
              <span className={`status-badge status-${activity.status.toLowerCase()}`}>
                {activity.status}
              </span>
            ) : 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Session</strong> {activity.sessionDuration || 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Location</strong> {activity.location || 'Unknown'}
          </div>
          <div className="detail-item">
            <strong>Device</strong> {activity.device || 'N/A'}
          </div>
          <div className="detail-item">
            <strong>Actions</strong> {typeof activity.actions === 'number' ? activity.actions : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
