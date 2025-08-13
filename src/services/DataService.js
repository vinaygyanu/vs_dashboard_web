/**
 * Data service for fetching dashboard data
 * Currently uses local db.json file but can be replaced with actual API calls
 */

import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

/**
 * Service to retrieve dashboard data
 * This can be replaced with actual API calls in the future
 */
export const DataService = {
  /**
   * Get all dashboard data
   * @returns {Promise} Promise that resolves to the entire dashboard data
   */
  getAllData: async () => {
    // Optionally, fetch all relevant data in parallel
    const [summary, usage, activity, anomalies, systemStatus] = await Promise.all([
      axios.get(`${API_URL}/summary`),
      axios.get(`${API_URL}/usage`),
      axios.get(`${API_URL}/user-activity`),
      axios.get(`${API_URL}/anomalies`),
      axios.get(`${API_URL}/system-status`)
    ]);
    return {
      summary: summary.data,
      usage: usage.data,
      activity: activity.data,
      anomalies: anomalies.data,
      systemStatus: systemStatus.data
    };
  },

  /**
   * Get summary card data
   * @returns {Promise} Promise that resolves to summary card data
   */
  getSummaryData: async () => {
    const res = await axios.get(`${API_URL}/summary`);
    return res.data;
  },

  /**
   * Get usage metrics data
   * @param {string} timeframe - 'daily' or 'monthly'
   * @returns {Promise} Promise that resolves to usage metrics data
   */
  getUsageData: async (timeframe = 'daily') => {
    try {
      console.log(`Fetching usage data with timeframe: ${timeframe}`);
      const res = await axios.get(`${API_URL}/usage?timeframe=${timeframe}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching usage data:', error);
      // Return fallback data matching the expected structure
      return {
        daily: [
          { date: '2025-08-07', users: 7845, sessions: 12456, duration: 345 },
          { date: '2025-08-08', users: 8102, sessions: 13012, duration: 362 },
          { date: '2025-08-09', users: 7920, sessions: 12780, duration: 351 },
          { date: '2025-08-10', users: 8350, sessions: 14102, duration: 375 },
          { date: '2025-08-11', users: 7102, sessions: 10524, duration: 298 },
          { date: '2025-08-12', users: 6845, sessions: 9876, duration: 287 },
          { date: '2025-08-13', users: 8426, sessions: 15240, duration: 412 }
        ],
        monthly: [
          { month: 'Jan', users: 187450, sessions: 342100, duration: 9876 },
          { month: 'Feb', users: 198320, sessions: 356700, duration: 10234 },
          { month: 'Mar', users: 210450, sessions: 375600, duration: 11420 },
          { month: 'Apr', users: 215780, sessions: 382400, duration: 12105 },
          { month: 'May', users: 220150, sessions: 390800, duration: 12980 },
          { month: 'Jun', users: 226450, sessions: 402300, duration: 13450 },
          { month: 'Jul', users: 231200, sessions: 415600, duration: 14230 }
        ]
      };
    }
  },

  /**
   * Get user activity data
   * @returns {Promise} Promise that resolves to user activity data
   */
  getUserActivity: async () => {
    const res = await axios.get(`${API_URL}/user-activity`);
    return res.data;
  },

  /**
   * Get anomalies data
   * @returns {Promise} Promise that resolves to anomalies data
   */
  getAnomalies: async () => {
    const res = await axios.get(`${API_URL}/anomalies`);
    return res.data;
  },

  /**
   * Get system status data
   * @returns {Promise} Promise that resolves to system status data
   */
  getSystemStatus: async () => {
    const res = await axios.get(`${API_URL}/system-status`);
    return res.data;
  }
};

export default DataService;
