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
        <div className="activity-list-header">
          <span className="header-user">User</span>
          <span className="header-action">Action</span>
          <span className="header-timestamp">Time</span>
        </div>
        <ul className="activity-list">
          {activities.slice(0, 5).map(activity => (
            <li key={activity.id} className="activity-item">
              <span className="activity-user" onClick={() => handleActivityClick(activity)}>
                {activity.username}
              </span>
              <span className="activity-action">
                {`${activity.actions} actions`}
              </span>
              <span className="activity-timestamp">
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
