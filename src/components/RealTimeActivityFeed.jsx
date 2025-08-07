import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import ActivityDetailModal from './ActivityDetailModal';
import './RealTimeActivityFeed.css';
import { timeSince } from '../utils/timeUtils';

const RealTimeActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await DataService.getUserActivity();
        setActivities(data);
      } catch (err) {
        setError('Failed to fetch activities');
        console.error(err);
      }
    };

    fetchActivities();
    const intervalId = setInterval(fetchActivities, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  if (error) {
    return <div className="activity-feed error-message">{error}</div>;
  }

  return (
    <>
      <div className="activity-feed">
        <h2 className="activity-feed-title">Real-Time Activity</h2>
        <div className="activity-list-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(90deg,#f3f4f6 60%,#e0e7ff 100%)',
          padding: '0.75rem', fontWeight: 600, color: '#6366f1',
          borderRadius: '0.375rem', boxShadow: '0 1px 4px rgba(99,102,241,0.07)',
          position: 'sticky', top: 0, zIndex: 1
        }}>
          <span className="header-user" style={{flex:1}}>User</span>
          <span className="header-action" style={{flex:1}}>Action</span>
          <span className="header-timestamp" style={{flex:1}}>Time</span>
        </div>
        <ul className="activity-list">
          {activities.slice(0, 5).map(activity => (
            <li key={activity.id} className="activity-item" style={{display:'flex',alignItems:'center',gap:12}}>
              <span className="activity-user" style={{display:'flex',alignItems:'center',gap:8,flex:1}} onClick={() => handleActivityClick(activity)}>
                <span style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#f472b6)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'1rem',boxShadow:'0 2px 8px #6366f122'}}>{activity.username.charAt(0).toUpperCase()}</span>
                <span>{activity.username}</span>
              </span>
              <span className="activity-action" style={{flex:1}}>
                <span style={{background:'#e0e7ff',color:'#6366f1',borderRadius:'999px',padding:'0.25em 0.9em',fontWeight:600,boxShadow:'0 1px 6px #6366f144',fontSize:'0.95em',display:'inline-flex',alignItems:'center',gap:4}}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M5 12h14M12 5l7 7-7 7" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {activity.actions} actions
                </span>
              </span>
              <span className="activity-timestamp" style={{flex:1,display:'flex',alignItems:'center',gap:4,color:'#9ca3af'}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {timeSince(new Date(activity.lastLogin))}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ActivityDetailModal activity={selectedActivity} onClose={handleCloseModal} />
    </>
  );
};

export default RealTimeActivityFeed;
