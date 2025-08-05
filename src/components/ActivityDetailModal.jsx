import React from 'react';
import './ActivityDetailModal.css';

const ActivityDetailModal = ({ activity, onClose }) => {
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
            <strong>Username</strong> {activity.username}
          </div>
          <div className="detail-item">
            <strong>Email</strong> {activity.email}
          </div>
          <div className="detail-item">
            <strong>Last Login</strong> {formatDate(activity.lastLogin)}
          </div>
          <div className="detail-item">
            <strong>Status</strong> <span className={`status-badge status-${activity.status.toLowerCase()}`}>{activity.status}</span>
          </div>
          <div className="detail-item">
            <strong>Session</strong> {activity.sessionDuration}
          </div>
          <div className="detail-item">
            <strong>Location</strong> {activity.location}
          </div>
          <div className="detail-item">
            <strong>Device</strong> {activity.device}
          </div>
          <div className="detail-item">
            <strong>Actions</strong> {activity.actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
