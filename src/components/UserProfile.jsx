import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="spinner"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-profile-error">
        <p>{error || 'User profile not available'}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <div className="user-avatar">
          {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <h2>{user.displayName || user.username}</h2>
          <p className="user-role">{user.role}</p>
          {user.email && <p className="user-email">{user.email}</p>}
        </div>
      </div>
      
      <div className="user-details">
        {user.phone && (
          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <a href={`tel:${user.phone}`} className="detail-value link">
              {user.phone}
            </a>
          </div>
        )}
        
        {user.website && (
          <div className="detail-item">
            <span className="detail-label">Website</span>
            <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="detail-value link">
              {user.website}
            </a>
          </div>
        )}
        
        {user.company && (
          <div className="detail-item">
            <span className="detail-label">Company</span>
            <span className="detail-value">{user.company}</span>
          </div>
        )}
        
        {user.id && (
          <div className="detail-item">
            <span className="detail-label">User ID</span>
            <span className="detail-value">{user.id}</span>
          </div>
        )}
        
        {user.lastLogin && (
          <div className="detail-item">
            <span className="detail-label">Last Login</span>
            <span className="detail-value">
              {new Date(user.lastLogin).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
